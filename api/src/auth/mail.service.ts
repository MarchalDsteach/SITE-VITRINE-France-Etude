import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private readonly config: ConfigService) {}

  sendVerification(email: string, name: string, token: string) {
    return this.sendLink(
      email,
      'Vérifiez votre adresse email',
      `/verify-email?token=${encodeURIComponent(token)}`,
      `Bonjour ${name}, vérifiez votre adresse email pour terminer la création de votre compte GPI.`,
    );
  }

  sendPasswordReset(email: string, name: string, token: string) {
    return this.sendLink(
      email,
      'Réinitialisation de votre mot de passe GPI',
      `/reset-password?token=${encodeURIComponent(token)}`,
      `Bonjour ${name}, utilisez le lien ci-dessous pour choisir un nouveau mot de passe. Le lien expire dans une heure.`,
    );
  }

  private async sendLink(
    email: string,
    subject: string,
    path: string,
    intro: string,
  ) {
    const host = this.config.get<string>('SMTP_HOST');
    const from = this.config.get<string>('SMTP_FROM');
    const port = Number(this.config.get<string>('SMTP_PORT') ?? 587);
    if (!host || !from || !Number.isInteger(port) || port < 1) {
      throw new ServiceUnavailableException(
        'Le service email n’est pas configuré.',
      );
    }

    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      ...(user && pass ? { auth: { user, pass } } : {}),
    });
    const frontendUrl = (
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000'
    ).replace(/\/$/, '');
    const link = `${frontendUrl}${path}`;

    await transporter.sendMail({
      from,
      to: email,
      subject,
      text: `${intro}\n\n${link}\n\nSi vous n’êtes pas à l’origine de cette demande, ignorez cet email.`,
    });
  }
}
