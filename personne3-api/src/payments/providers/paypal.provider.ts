import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import {
  Client,
  Environment,
  OrdersController,
  CheckoutPaymentIntent,
  Order,
} from '@paypal/paypal-server-sdk';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider, CreatePaymentResult, WebhookResult } from '../payment-provider.interface';

@Injectable()
export class PaypalProvider implements PaymentProvider {
  private readonly ordersController: OrdersController;
  private readonly apiBaseUrl: string;

  constructor(private readonly config: ConfigService) {
    const clientId = this.config.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.config.get<string>('PAYPAL_CLIENT_SECRET');
    if (!clientId || !clientSecret) {
      throw new Error('PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET manquants dans les variables d\'environnement');
    }

    const isProd = this.config.get<string>('NODE_ENV') === 'production';

    const client = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret,
      },
      environment: isProd ? Environment.Production : Environment.Sandbox,
    });

    this.ordersController = new OrdersController(client);
    // Nécessaire pour l'appel direct de vérification de signature webhook
    // (non exposé par le SDK — on utilise l'API REST PayPal directement).
    this.apiBaseUrl = isProd ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  }

  async createPayment(params: {
    amount: number;
    currency: string;
    dossierId: string;
    description: string;
  }): Promise<CreatePaymentResult> {
    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    // PayPal attend un montant en unité décimale (ex: "25.00"), pas en
    // centimes contrairement à Stripe — conversion explicite ici.
    const amountDecimal = (params.amount / 100).toFixed(2);

    const { result } = await this.ordersController.createOrder({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            referenceId: params.dossierId,
            description: params.description,
            customId: params.dossierId,
            amount: {
              currencyCode: params.currency.toUpperCase(),
              value: amountDecimal,
            },
          },
        ],
        applicationContext: {
          returnUrl: `${frontendUrl}/paiement/succes`,
          cancelUrl: `${frontendUrl}/paiement/annule`,
        },
      },
    });

    const order = result as Order;
    const approveLink = order.links?.find((link) => link.rel === 'approve');
    if (!approveLink?.href) {
      throw new BadRequestException('Impossible de créer la commande PayPal');
    }

    return { paymentUrl: approveLink.href, providerRef: order.id as string };
  }

  async handleWebhook(rawBody: Buffer, headers: Record<string, string>): Promise<WebhookResult> {
    const webhookId = this.config.get<string>('PAYPAL_WEBHOOK_ID');
    if (!webhookId) {
      throw new Error('PAYPAL_WEBHOOK_ID manquant');
    }

    const event = JSON.parse(rawBody.toString('utf-8'));
    const accessToken = await this.getAccessToken();

    // PayPal vérifie la signature à partir de 5 headers distincts, pas
    // d'un seul comme Stripe — tous doivent être transmis tels que reçus.
    const verifyResponse = await axios.post(
      `${this.apiBaseUrl}/v1/notifications/verify-webhook-signature`,
      {
        transmission_id: headers['paypal-transmission-id'],
        transmission_time: headers['paypal-transmission-time'],
        cert_url: headers['paypal-cert-url'],
        auth_algo: headers['paypal-auth-algo'],
        transmission_sig: headers['paypal-transmission-sig'],
        webhook_id: webhookId,
        webhook_event: event,
      },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (verifyResponse.data.verification_status !== 'SUCCESS') {
      throw new BadRequestException('Signature webhook PayPal invalide');
    }

    if (event.event_type === 'CHECKOUT.ORDER.APPROVED' || event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      return { providerRef: event.resource.id, status: 'paid' };
    }

    return { providerRef: '', status: 'failed' };
  }

  private async getAccessToken(): Promise<string> {
    const clientId = this.config.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.config.get<string>('PAYPAL_CLIENT_SECRET');
    const response = await axios.post(
      `${this.apiBaseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        auth: { username: clientId as string, password: clientSecret as string },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    return response.data.access_token;
  }
}
