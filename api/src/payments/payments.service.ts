import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { applicationId: string; userId: string; amount: number; currency?: string; provider?: string; description?: string }) {
    const application = await this.prisma.application.findUnique({
      where: { id: data.applicationId },
      select: { id: true, userId: true, status: true },
    });

    if (!application) {
      throw new NotFoundException('Dossier introuvable.');
    }

    if (application.userId !== data.userId) {
      throw new ForbiddenException('Accès non autorisé à ce dossier.');
    }

    const payment = await this.prisma.payment.create({
      data: {
        applicationId: data.applicationId,
        provider: data.provider ?? 'manual',
        amount: data.amount,
        currency: data.currency ?? 'EUR',
        status: 'PENDING',
      },
    });

    await this.prisma.application.update({
      where: { id: data.applicationId },
      data: { status: 'PAYMENT_PENDING' },
    });

    return payment;
  }

  async findMine(userId: string) {
    const applications = await this.prisma.application.findMany({
      where: { userId },
      select: { id: true },
    });

    if (applications.length === 0) {
      return [];
    }

    const ids = applications.map((application) => application.id);
    return this.prisma.payment.findMany({
      where: { applicationId: { in: ids } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
