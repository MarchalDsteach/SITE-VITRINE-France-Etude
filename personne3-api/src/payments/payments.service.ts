import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeProvider } from './providers/stripe.provider';
import { PaypalProvider } from './providers/paypal.provider';
import { MobileMoneyProvider } from './providers/mobile-money.provider';
import { PaymentProvider } from './payment-provider.interface';
import { TARIFS } from './tarifs';

export type ProviderName = 'stripe' | 'paypal' | 'mobile_money';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly providers: Record<ProviderName, PaymentProvider>;

  constructor(
    private readonly prisma: PrismaService,
    stripeProvider: StripeProvider,
    paypalProvider: PaypalProvider,
    mobileMoneyProvider: MobileMoneyProvider,
  ) {
    this.providers = {
      stripe: stripeProvider,
      paypal: paypalProvider,
      mobile_money: mobileMoneyProvider,
    };
  }

  async createPayment(dossierId: string, providerName: ProviderName) {
    const dossier = await this.prisma.dossier.findUnique({ where: { id: dossierId } });
    if (!dossier) {
      throw new NotFoundException('Dossier introuvable');
    }
    if (dossier.statut !== 'EN_ATTENTE_PAIEMENT') {
      throw new BadRequestException('Ce dossier n\'est pas en attente de paiement');
    }

    // Montant recalculé côté serveur à partir du type de dossier —
    // jamais depuis une valeur transmise par le frontend.
    const amount = TARIFS[dossier.type];
    const provider = this.providers[providerName];

    const { paymentUrl, providerRef } = await provider.createPayment({
      amount,
      currency: 'EUR',
      dossierId: dossier.id,
      description: `Frais de dossier ${dossier.type} — réf. ${dossier.reference}`,
    });

    await this.prisma.paiement.upsert({
      where: { dossierId: dossier.id },
      create: {
        montant: amount,
        devise: 'EUR',
        provider: providerName,
        providerRef,
        statut: 'pending',
        dossierId: dossier.id,
      },
      update: {
        provider: providerName,
        providerRef,
        statut: 'pending',
      },
    });

    return { paymentUrl };
  }

  async handleWebhook(providerName: ProviderName, rawBody: Buffer, headers: Record<string, string>) {
    const provider = this.providers[providerName];
    const { providerRef, status } = await provider.handleWebhook(rawBody, headers);
    if (!providerRef) return; // événement non géré, on ignore silencieusement

    const paiement = await this.prisma.paiement.findUnique({ where: { providerRef } });
    if (!paiement) {
      this.logger.warn(`Webhook ${providerName} reçu pour une référence inconnue: ${providerRef}`);
      return;
    }

    // Idempotence : si déjà marqué payé, on ne retraite pas (un webhook
    // peut être envoyé plusieurs fois pour le même événement).
    if (paiement.statut === 'paid') {
      return;
    }

    await this.prisma.$transaction([
      this.prisma.paiement.update({
        where: { id: paiement.id },
        data: { statut: status },
      }),
      this.prisma.dossier.update({
        where: { id: paiement.dossierId },
        data: { statut: status === 'paid' ? 'PAYE' : 'EN_ATTENTE_PAIEMENT' },
      }),
    ]);
  }
}
