import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from './mail.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mail: MailService,
    private readonly config: ConfigService = new ConfigService(),
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser)
      throw new ConflictException('Un compte existe déjà pour cet email.');

    const rawToken = randomBytes(32).toString('hex');
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(dto.password, 12),
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        phone: dto.phone?.trim(),
        country: dto.country?.trim(),
        originCountry: dto.originCountry?.trim(),
        status: 'PENDING',
        emailVerified: false,
        emailVerificationTokenHash: this.hashToken(rawToken),
        emailVerificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    try {
      await this.mail.sendVerification(
        user.email,
        `${user.firstName} ${user.lastName}`,
        rawToken,
      );
    } catch (error) {
      await this.prisma.user.delete({ where: { id: user.id } });
      throw error;
    }
    return {
      message:
        'Compte créé. Consultez votre email pour vérifier votre adresse, puis attendez la validation administrative.',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }
    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Vérifiez votre adresse email avant de vous connecter.',
      );
    }
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(
        'Votre compte est en attente de validation par l’administrateur.',
      );
    }
    return this.createSession(user);
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationTokenHash: this.hashToken(token),
        emailVerificationExpiresAt: { gt: new Date() },
      },
    });
    if (!user)
      throw new BadRequestException('Lien de vérification invalide ou expiré.');
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationTokenHash: null,
        emailVerificationExpiresAt: null,
      },
    });
    return {
      message:
        'Adresse email vérifiée. Votre compte reste en attente de validation administrative.',
    };
  }

  async resendVerification(emailInput: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: emailInput.trim().toLowerCase() },
    });
    const message =
      'Si cette adresse correspond à un compte non vérifié, un nouveau lien sera envoyé.';
    if (
      !user ||
      user.emailVerified ||
      (user.emailVerificationExpiresAt &&
        user.emailVerificationExpiresAt > new Date())
    ) {
      return { message };
    }

    const rawToken = randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationTokenHash: this.hashToken(rawToken),
        emailVerificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    try {
      await this.mail.sendVerification(
        user.email,
        `${user.firstName} ${user.lastName}`,
        rawToken,
      );
    } catch {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationTokenHash: null,
          emailVerificationExpiresAt: null,
        },
      });
    }
    return { message };
  }

  async forgotPassword(emailInput: string) {
    const email = emailInput.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user)
      return {
        message:
          'Si cette adresse est associée à un compte, un lien de réinitialisation a été envoyé.',
      };

    const rawToken = randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: this.hashToken(rawToken),
        passwordResetExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });
    try {
      await this.mail.sendPasswordReset(
        user.email,
        `${user.firstName} ${user.lastName}`,
        rawToken,
      );
    } catch {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { passwordResetTokenHash: null, passwordResetExpiresAt: null },
      });
    }
    return {
      message:
        'Si cette adresse est associée à un compte, un lien de réinitialisation a été envoyé.',
    };
  }

  async resetPassword(token: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetTokenHash: this.hashToken(token),
        passwordResetExpiresAt: { gt: new Date() },
      },
    });
    if (!user)
      throw new BadRequestException(
        'Lien de réinitialisation invalide ou expiré.',
      );
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await bcrypt.hash(password, 12),
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });
    return {
      message: 'Mot de passe modifié. Vous pouvez maintenant vous connecter.',
    };
  }

  profile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        country: true,
        originCountry: true,
        role: true,
        status: true,
        emailVerified: true,
      },
    });
  }

  updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        phone: dto.phone?.trim(),
        country: dto.country?.trim(),
        originCountry: dto.originCountry?.trim(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        country: true,
        originCountry: true,
        role: true,
        status: true,
        emailVerified: true,
      },
    });
  }

  async createAdmin(dto: CreateAdminDto) {
    const expectedSecret = this.config.get<string>('ADMIN_BOOTSTRAP_SECRET');
    if (!expectedSecret || dto.secret !== expectedSecret) {
      throw new UnauthorizedException(
        'Secret de création d’administrateur invalide.',
      );
    }

    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Un compte existe déjà pour cet email.');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(dto.password, 12),
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        phone: dto.phone?.trim(),
        country: dto.country?.trim(),
        originCountry: dto.originCountry?.trim(),
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: true,
      },
    });

    return this.createSession(user);
  }

  heartbeat(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastSeenAt: new Date() },
      select: { lastSeenAt: true },
    });
  }

  messages(userId: string) {
    return this.prisma.message.findMany({
      where: { recipientId: userId },
      include: {
        sender: { select: { firstName: true, lastName: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  markMessageRead(messageId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: { id: messageId, recipientId: userId },
      data: { isRead: true },
    });
  }

  private createSession(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'STUDENT' | 'ADVISOR' | 'ADMIN';
    status?: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status ?? 'ACTIVE',
    };
    return {
      accessToken: this.jwt.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: payload.status,
      },
    };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
