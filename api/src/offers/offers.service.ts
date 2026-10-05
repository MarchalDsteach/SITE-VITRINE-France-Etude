import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OfferType } from '@prisma/client';

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  findPublished(type?: OfferType) {
    return this.prisma.offer.findMany({
      where: { isPublished: true, ...(type ? { type } : {}) },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  findAll() {
    return this.prisma.offer.findMany({ orderBy: { updatedAt: 'desc' } });
  }

  create(authorId: string, dto: CreateOfferDto) {
    const isPublished = dto.isPublished ?? false;
    return this.prisma.offer.create({
      data: { ...dto, authorId, isPublished, publishedAt: isPublished ? new Date() : null },
    });
  }

  async update(id: string, dto: UpdateOfferDto) {
    await this.ensureExists(id);
    const isBeingPublished = dto.isPublished === true;
    return this.prisma.offer.update({
      where: { id },
      data: { ...dto, ...(isBeingPublished ? { publishedAt: new Date() } : {}) },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.offer.delete({ where: { id } });
  }

  async getApplicationRedirect(id: string) {
    const offer = await this.prisma.offer.findFirst({
      where: { id, isPublished: true },
      select: { applyUrl: true },
    });
    if (!offer?.applyUrl) throw new NotFoundException('Lien de candidature introuvable.');

    await this.prisma.offer.update({
      where: { id },
      data: { applicationClicks: { increment: 1 }, lastClickedAt: new Date() },
    });

    const destination = new URL(offer.applyUrl);
    destination.searchParams.set('utm_source', 'gpi-voyages');
    destination.searchParams.set('utm_medium', 'partner_listing');
    destination.searchParams.set('utm_campaign', `offer-${id}`);
    return destination.toString();
  }

  private async ensureExists(id: string) {
    if (!(await this.prisma.offer.findUnique({ where: { id }, select: { id: true } }))) {
      throw new NotFoundException('Offre introuvable.');
    }
  }
}
