import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { PaymentProvider, CreatePaymentResult, WebhookResult } from '../payment-provider.interface';

// CinetPay est un agrégateur qui unifie MTN Mobile Money, Airtel Money et
// d'autres moyens de paiement mobile derrière une seule API — voir le
// guide paiements pour la justification de ce choix par rapport à une
// intégration directe avec chaque opérateur.
@Injectable()
export class MobileMoneyProvider implements PaymentProvider {
  private readonly apiBaseUrl = 'https://api-checkout.cinetpay.com/v2';

  constructor(private readonly config: ConfigService) {
    if (!this.config.get<string>('CINETPAY_API_KEY') || !this.config.get<string>('CINETPAY_SITE_ID')) {
      throw new Error('CINETPAY_API_KEY / CINETPAY_SITE_ID manquants dans les variables d\'environnement');
    }
  }

  async createPayment(params: {
    amount: number;
    currency: string;
    dossierId: string;
    description: string;
  }): Promise<CreatePaymentResult> {
    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    const apiUrl = this.config.get<string>('API_URL');

    // CinetPay attend un montant entier dans la devise locale (ex: XOF,
    // XAF), pas en centimes. Si vous facturez en EUR/USD, une conversion
    // de devise est nécessaire avant cet appel — à clarifier selon les
    // devises réellement supportées par votre configuration CinetPay.
    const transactionId = `${params.dossierId}-${Date.now()}`;

    const response = await axios.post(`${this.apiBaseUrl}/payment`, {
      apikey: this.config.get<string>('CINETPAY_API_KEY'),
      site_id: this.config.get<string>('CINETPAY_SITE_ID'),
      transaction_id: transactionId,
      amount: params.amount,
      currency: params.currency.toUpperCase(),
      description: params.description,
      // CinetPay notifie via un POST serveur-à-serveur sur cette URL,
      // séparé du retour navigateur (return_url) — c'est ça qui fait foi,
      // exactement comme les webhooks Stripe/PayPal.
      notify_url: `${apiUrl}/payments/webhooks/mobile-money`,
      return_url: `${frontendUrl}/paiement/succes`,
      channels: 'MOBILE_MONEY',
      metadata: params.dossierId,
    });

    if (response.data.code !== '201') {
      throw new BadRequestException(
        `Impossible de créer le paiement Mobile Money : ${response.data.message}`,
      );
    }

    return {
      paymentUrl: response.data.data.payment_url,
      providerRef: transactionId,
    };
  }

  async handleWebhook(rawBody: Buffer, headers: Record<string, string>): Promise<WebhookResult> {
    const payload = JSON.parse(rawBody.toString('utf-8'));

    // CinetPay signe sa notification avec un token HMAC calculé sur des
    // champs précis de leur documentation (montant, transaction_id, site_id...)
    // — voir doc CinetPay "Sécurisation des notifications" pour le detail exact
    // des champs concaténés, qui varie selon la version d'API utilisée.
    const secretKey = this.config.get<string>('CINETPAY_SECRET_KEY') as string;
    const expectedToken = crypto
      .createHmac('sha256', secretKey)
      .update(
        [
          payload.cpm_site_id,
          payload.cpm_trans_id,
          payload.cpm_trans_date,
          payload.cpm_amount,
          payload.cpm_currency,
          payload.signature,
          payload.payment_method,
          payload.cel_phone_num,
          payload.cpm_phone_prefixe,
          payload.cpm_language,
          payload.cpm_version,
          payload.cpm_payment_config,
          payload.cpm_page_action,
          payload.cpm_custom,
          payload.cpm_designation,
          payload.cpm_error_message,
        ].join(''),
      )
      .digest('hex');

    const receivedToken = headers['x-token'];
    if (!receivedToken || receivedToken !== expectedToken) {
      throw new BadRequestException('Signature de notification CinetPay invalide');
    }

    const status = payload.cpm_trans_status === 'ACCEPTED' ? 'paid' : 'failed';
    return { providerRef: payload.cpm_trans_id, status };
  }
}
