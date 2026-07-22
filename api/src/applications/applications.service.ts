import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateApplicationDto) {
    return this.prisma.application.create({
      data: {
        userId,
        type: dto.type,
        formData: dto.formData as Prisma.InputJsonValue,
        reference: `PE-${randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()}`,
      },
    });
  }

  findMine(userId: string) {
    return this.prisma.application.findMany({
      where: { userId },
      include: { documents: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(id: string, userId: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: { documents: true, payments: true },
    });
    if (!application) throw new NotFoundException('Dossier introuvable.');
    if (application.userId !== userId) throw new ForbiddenException('Accès non autorisé à ce dossier.');
    return application;
  }
}
