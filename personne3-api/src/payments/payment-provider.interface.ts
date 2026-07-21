export interface CreatePaymentResult {
  paymentUrl: string;
  providerRef: string;
}

export interface WebhookResult {
  providerRef: string;
  status: 'paid' | 'failed';
}

export interface PaymentProvider {
  createPayment(params: {
    amount: number; // en centimes
    currency: string;
    dossierId: string;
    description: string;
  }): Promise<CreatePaymentResult>;

  // rawBody est nécessaire pour vérifier la signature (Stripe, PayPal...).
  // headers contient TOUS les headers de la requête : Stripe n'a besoin
  // que de 'stripe-signature', mais PayPal a besoin de 5 headers
  // différents (transmission-id, timestamp, cert-url, auth-algo, sig)
  // pour vérifier une seule signature — d'où un objet générique plutôt
  // qu'un paramètre unique.
  handleWebhook(rawBody: Buffer, headers: Record<string, string>): Promise<WebhookResult>;
}

export const PAYMENT_PROVIDER = 'PAYMENT_PROVIDER';
