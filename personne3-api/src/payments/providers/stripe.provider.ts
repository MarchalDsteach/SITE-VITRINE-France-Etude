import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe = require('stripe');
import { ConfigService } from '@nestjs/config';
import { PaymentProvider, CreatePaymentResult, WebhookResult } from '../payment-provider.interface';

@Injectable()
export class StripeProvider implements PaymentProvider {
  private readonly stripe: Stripe;

  constructor(private readonly config: ConfigService) {
    const secretKey = this.config.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      // On échoue explicitement au démarrage plutôt que silencieusement
      // au premier paiement — plus facile à diagnostiquer.
      throw new Error('STRIPE_SECRET_KEY manquante dans les variables d\'environnement');
    }
    this.stripe = new Stripe(secretKey);
  }

  async createPayment(params: {
    amount: number;
    currency: string;
    dossierId: string;
    description: string;
  }): Promise<CreatePaymentResult> {
    const frontendUrl = this.config.get<string>('FRONTEND_URL');

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: params.currency.toLowerCase(),
            unit_amount: params.amount,
            product_data: { name: params.description },
          },
          quantity: 1,
        },
      ],
      success_url: `${frontendUrl}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/paiement/annule`,
      // dossierId permet de retrouver le dossier métier depuis le webhook,
      // sans jamais faire confiance à un montant renvoyé par le frontend.
      metadata: { dossierId: params.dossierId },
    });

    if (!session.url) {
      throw new BadRequestException('Impossible de créer la session de paiement Stripe');
    }

    return { paymentUrl: session.url, providerRef: session.id };
  }

  async handleWebhook(rawBody: Buffer, headers: Record<string, string>): Promise<WebhookResult> {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET manquante');
    }
    const signature = headers['stripe-signature'];

    // Vérifie la signature — c'est ce qui garantit que l'appel vient bien
    // de Stripe et pas d'un tiers qui imite le format du payload.
    const event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      return { providerRef: session.id, status: 'paid' };
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      return { providerRef: session.id, status: 'failed' };
    }

    // Type d'événement non géré : on ne fait rien, mais on ne renvoie pas
    // d'erreur (Stripe réessaierait indéfiniment sinon).
    return { providerRef: '', status: 'failed' };
  }
}
