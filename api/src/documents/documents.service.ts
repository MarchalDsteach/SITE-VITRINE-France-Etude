import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    applicationId: string,
    userId: string,
    file: Express.Multer.File,
  ) {
    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!application) throw new NotFoundException('Dossier introuvable.');
    if (application.userId !== userId) throw new ForbiddenException('Accès non autorisé à ce dossier.');

    return this.prisma.document.create({
      data: {
        name: file.originalname,
        storageKey: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        applicationId,
      },
    });
  }
}