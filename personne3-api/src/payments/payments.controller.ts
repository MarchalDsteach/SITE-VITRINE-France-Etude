import { Controller, Post, Body, Req, HttpCode, BadRequestException } from '@nestjs/common';
import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // TODO: brancher un guard d'authentification une fois le module `auth`
  // en place côté Personne 2 — un étudiant ne doit payer que pour son
  // propre dossier.
  @Post()
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(dto.dossierId, dto.provider);
  }

  // Chaque webhook ci-dessous reçoit rawBody + tous ses headers : pas de
  // ValidationPipe/DTO ici, le payload vient du provider externe et est
  // vérifié par signature, pas par une forme attendue.

  @Post('webhooks/stripe')
  @HttpCode(200)
  async stripeWebhook(@Req() req: RawBodyRequest<Request>) {
    this.assertRawBody(req);
    await this.paymentsService.handleWebhook('stripe', req.rawBody as Buffer, req.headers as Record<string, string>);
    return { received: true };
  }

  @Post('webhooks/paypal')
  @HttpCode(200)
  async paypalWebhook(@Req() req: RawBodyRequest<Request>) {
    this.assertRawBody(req);
    await this.paymentsService.handleWebhook('paypal', req.rawBody as Buffer, req.headers as Record<string, string>);
    return { received: true };
  }

  @Post('webhooks/mobile-money')
  @HttpCode(200)
  async mobileMoneyWebhook(@Req() req: RawBodyRequest<Request>) {
    this.assertRawBody(req);
    await this.paymentsService.handleWebhook(
      'mobile_money',
      req.rawBody as Buffer,
      req.headers as Record<string, string>,
    );
    return { received: true };
  }

  private assertRawBody(req: RawBodyRequest<Request>) {
    if (!req.rawBody) {
      throw new BadRequestException('Corps de requête brut manquant');
    }
  }
}
