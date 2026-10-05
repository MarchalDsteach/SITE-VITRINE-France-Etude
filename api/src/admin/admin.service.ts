import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LeadPriority, LeadSource, LeadStatus } from '@prisma/client';
import { basename, join } from 'path';
import { unlink } from 'fs/promises';
import { PrismaService } from '../prisma/prisma.service';
import { uploadsDirectory } from '../documents/upload-storage';
import { SendMessageDto } from './dto/send-message.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async stats() {
    const [
      students,
      advisors,
      activeUsers,
      applications,
      pendingApplications,
      offers,
      messages,
      leads,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'STUDENT' } }),
      this.prisma.user.count({ where: { role: 'ADVISOR' } }),
      this.prisma.user.count({
        where: {
          role: { in: ['STUDENT', 'ADVISOR'] },
          lastSeenAt: { gt: new Date(Date.now() - 5 * 60 * 1000) },
        },
      }),
      this.prisma.application.count(),
      this.prisma.application.count({
        where: {
          status: {
            in: ['DRAFT', 'SUBMITTED', 'IN_REVIEW', 'PAYMENT_PENDING'],
          },
        },
      }),
      this.prisma.offer.count(),
      this.prisma.message.count({ where: { isRead: false } }),
      this.prisma.lead.count(),
    ]);
    return {
      users: students,
      advisors,
      activeUsers,
      applications,
      pendingApplications,
      offers,
      unreadMessages: messages,
      leads,
    };
  }

  findUsers(search?: string) {
    return this.prisma.user.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        country: true,
        originCountry: true,
        role: true,
        status: true,
        emailVerified: true,
        lastSeenAt: true,
        createdAt: true,
        _count: {
          select: {
            applications: true,
            receivedMessages: true,
            createdLeads: true,
            assignedLeads: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findPendingUsers() {
    return this.prisma.user.findMany({
      where: { status: 'PENDING' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        country: true,
        originCountry: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserRole(
    userId: string,
    role: 'STUDENT' | 'ADVISOR' | 'ADMIN',
    adminId: string,
  ) {
    if (userId === adminId && role !== 'ADMIN') {
      throw new ForbiddenException(
        'Vous ne pouvez pas supprimer votre propre rôle administrateur.',
      );
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
      },
    });
  }

  async updateUserStatus(
    userId: string,
    status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED',
    adminId: string,
  ) {
    if (userId === adminId && status !== 'ACTIVE') {
      throw new ForbiddenException(
        'Vous ne pouvez pas suspendre votre propre compte.',
      );
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
      },
    });
  }

  async removeUser(userId: string, adminId: string) {
    if (userId === adminId) {
      throw new ForbiddenException(
        'Vous ne pouvez pas supprimer votre propre compte.',
      );
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!user) throw new NotFoundException('Compte introuvable.');
    if (user.role === 'ADMIN') {
      throw new ForbiddenException(
        'La suppression d’un compte administrateur est interdite depuis cette page.',
      );
    }

    const documents = await this.prisma.document.findMany({
      where: { application: { userId } },
      select: { storageKey: true },
    });
    await this.prisma.user.delete({ where: { id: userId } });
    await Promise.all(
      documents.map((document) =>
        unlink(
          join(uploadsDirectory, basename(document.storageKey)),
        ).catch(() => undefined),
      ),
    );
    return { id: userId, deleted: true };
  }

  findApplications() {
    return this.prisma.application.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            lastSeenAt: true,
          },
        },
        documents: true,
        payments: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  findUserApplications(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: { documents: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendMessage(
    senderId: string,
    recipientId: string,
    dto: SendMessageDto,
  ) {
    const recipient = await this.prisma.user.findUnique({
      where: { id: recipientId },
      select: { id: true, role: true },
    });
    if (!recipient || recipient.role !== 'STUDENT')
      throw new NotFoundException('Étudiant introuvable.');
    return this.prisma.message.create({
      data: { ...dto, senderId, recipientId },
    });
  }

  async sendAdvisorMessage(
    senderId: string,
    recipientId: string,
    dto: SendMessageDto,
  ) {
    const assignment = await this.prisma.lead.findFirst({
      where: { advisorId: senderId, userId: recipientId },
      select: { id: true },
    });
    if (!assignment)
      throw new NotFoundException('Cet étudiant ne vous est pas attribué.');
    return this.sendMessage(senderId, recipientId, dto);
  }

  findMessages() {
    return this.prisma.message.findMany({
      include: {
        recipient: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        sender: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeMessage(messageId: string) {
    if (!(await this.prisma.message.findUnique({ where: { id: messageId }, select: { id: true } }))) {
      throw new NotFoundException('Message introuvable.');
    }
    return this.prisma.message.delete({ where: { id: messageId } });
  }

  async removeDocument(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      select: { id: true, storageKey: true },
    });
    if (!document) throw new NotFoundException('Document introuvable.');

    await this.prisma.document.delete({ where: { id: documentId } });
    await unlink(join(uploadsDirectory, basename(document.storageKey))).catch(() => undefined);
    return { id: documentId, deleted: true };
  }

  async documentPath(documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      select: { storageKey: true, name: true, mimeType: true },
    });
    if (!document) throw new NotFoundException('Document introuvable.');
    return document;
  }

  findLeads(advisorId?: string) {
    return this.prisma.lead.findMany({
      where: advisorId ? { advisorId } : undefined,
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        advisor: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateAdvisorLead(
    id: string,
    advisorId: string,
    status: 'CONTACTED' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED',
  ) {
    const lead = await this.prisma.lead.findFirst({ where: { id, advisorId } });
    if (!lead)
      throw new NotFoundException(
        'Demande introuvable ou non assignée à ce conseiller.',
      );
    return this.prisma.lead.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async createLead(data: {
    fullName?: string;
    email?: string;
    phone?: string;
    subject?: string;
    source?: LeadSource;
    message?: string;
    serviceName?: string;
    country?: string;
    userId?: string;
    advisorId?: string;
    status?: LeadStatus;
    priority?: LeadPriority;
  }) {
    return this.prisma.lead.create({
      data: {
        fullName: data.fullName ?? null,
        email: data.email ?? null,
        phone: data.phone ?? null,
        subject: data.subject ?? null,
        source: data.source ?? LeadSource.CONTACT_FORM,
        status: data.status ?? LeadStatus.NEW,
        priority: data.priority ?? LeadPriority.NORMAL,
        message: data.message ?? null,
        serviceName: data.serviceName ?? null,
        country: data.country ?? null,
        userId: data.userId ?? null,
        advisorId: data.advisorId ?? null,
      },
    });
  }

  async assignLead(id: string, dto: AssignLeadDto) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Demande introuvable.');
    if (dto.advisorId) {
      const advisor = await this.prisma.user.findUnique({
        where: { id: dto.advisorId },
        select: { role: true, status: true },
      });
      if (advisor?.role !== 'ADVISOR' || advisor.status !== 'ACTIVE') {
        throw new NotFoundException('Conseiller actif introuvable.');
      }
    }
    return this.prisma.lead.update({
      where: { id },
      data: {
        advisorId: dto.advisorId === undefined ? lead.advisorId : dto.advisorId,
        status: dto.status ?? lead.status,
        priority: dto.priority ?? lead.priority,
      },
      include: {
        advisor: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }
}
