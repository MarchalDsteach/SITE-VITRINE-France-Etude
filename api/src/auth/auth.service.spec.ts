import { createHash } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from './mail.service';

describe('AuthService.createAdmin', () => {
  it('should create an admin account only when the bootstrap secret matches', async () => {
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({
          id: 'admin-1',
          email: 'admin@gpi.fr',
          firstName: 'Admin',
          lastName: 'GPI',
          role: 'ADMIN',
        }),
      },
    };

    const jwt = { sign: jest.fn().mockReturnValue('token-admin') };
    const config = {
      get: jest.fn().mockReturnValue('private-bootstrap-secret'),
    };
    const service = new AuthService(
      prisma as any,
      jwt as any,
      {} as any,
      config as any,
    );

    const result = await service.createAdmin({
      email: 'admin@gpi.fr',
      password: 'SecurePass123!',
      firstName: 'Admin',
      lastName: 'GPI',
      secret: 'private-bootstrap-secret',
    });

    expect(result.user.role).toBe('ADMIN');
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('refuses admin creation when no bootstrap secret is configured', async () => {
    const prisma = { user: { findUnique: jest.fn(), create: jest.fn() } };
    const config = { get: jest.fn().mockReturnValue(undefined) };
    const service = new AuthService(
      prisma as any,
      {} as any,
      {} as any,
      config as any,
    );

    await expect(
      service.createAdmin({
        email: 'new-admin@example.test',
        password: 'SecurePass123!',
        firstName: 'New',
        lastName: 'Admin',
        secret: 'gpi-admin-secret',
      }),
    ).rejects.toThrow('Secret de création d’administrateur invalide.');
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});

describe('AuthService.register', () => {
  const registration = {
    email: 'student@example.com',
    password: 'SecurePass123!',
    firstName: 'Amina',
    lastName: 'Diallo',
  };

  it('keeps a new student account pending when verification email is unavailable', async () => {
    const user = {
      id: 'student-1',
      email: registration.email,
      firstName: registration.firstName,
      lastName: registration.lastName,
    };
    let createdAccount:
      | { email?: string; status?: string; emailVerified?: boolean }
      | undefined;
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest
          .fn()
          .mockImplementation(
            ({
              data,
            }: {
              data: {
                email?: string;
                status?: string;
                emailVerified?: boolean;
              };
            }) => {
              createdAccount = data;
              return Promise.resolve(user);
            },
          ),
        update: jest.fn().mockResolvedValue(user),
      },
    };
    const mail = {
      sendVerification: jest
        .fn()
        .mockRejectedValue(new Error('SMTP unavailable')),
    };
    const service = new AuthService(
      prisma as unknown as PrismaService,
      {} as JwtService,
      mail as unknown as MailService,
    );

    await expect(service.register(registration)).resolves.toEqual({
      message:
        'Compte créé, mais la vérification par email est indisponible. Votre compte est en attente de validation manuelle par l’équipe GPI.',
    });
    expect(prisma.user.create).toHaveBeenCalled();
    expect(createdAccount?.email).toBe(registration.email);
    expect(createdAccount?.status).toBe('PENDING');
    expect(createdAccount?.emailVerified).toBe(false);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        emailVerificationTokenHash: null,
        emailVerificationExpiresAt: null,
      },
    });
  });

  it('returns the verification instructions when the email is sent', async () => {
    const user = {
      id: 'student-1',
      email: registration.email,
      firstName: registration.firstName,
      lastName: registration.lastName,
    };
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(user),
        update: jest.fn(),
      },
    };
    const mail = { sendVerification: jest.fn().mockResolvedValue(undefined) };
    const service = new AuthService(
      prisma as unknown as PrismaService,
      {} as JwtService,
      mail as unknown as MailService,
    );

    await expect(service.register(registration)).resolves.toEqual({
      message:
        'Compte créé. Consultez votre email pour vérifier votre adresse, puis attendez la validation administrative.',
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});

describe('AuthService email and password tokens', () => {
  it('stores only the hash of a valid email verification token', async () => {
    const findFirst = jest.fn(
      (query: {
        where: {
          emailVerificationTokenHash: string;
          emailVerificationExpiresAt: { gt: Date };
        };
      }): Promise<{ id: string }> => {
        void query;
        return Promise.resolve({ id: 'user-1' });
      },
    );
    const prisma = {
      user: {
        findFirst,
        update: jest.fn().mockResolvedValue({}),
      },
    };
    const service = new AuthService(
      prisma as unknown as PrismaService,
      {} as JwtService,
      {} as MailService,
    );

    await expect(service.verifyEmail('one-time-token')).resolves.toEqual({
      message:
        'Adresse email vérifiée. Votre compte reste en attente de validation administrative.',
    });
    expect(findFirst).toHaveBeenCalledTimes(1);
    expect(
      findFirst.mock.calls[0]?.[0].where.emailVerificationTokenHash,
    ).toBe(createHash('sha256').update('one-time-token').digest('hex'));
    expect(
      findFirst.mock.calls[0]?.[0].where.emailVerificationExpiresAt.gt,
    ).toBeInstanceOf(Date);
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          emailVerified: true,
          emailVerificationTokenHash: null,
          emailVerificationExpiresAt: null,
        },
      }),
    );
  });

  it('rejects an expired or unknown password reset token', async () => {
    const prisma = { user: { findFirst: jest.fn().mockResolvedValue(null) } };
    const service = new AuthService(
      prisma as unknown as PrismaService,
      {} as JwtService,
      {} as MailService,
    );

    await expect(
      service.resetPassword('expired-token', 'new-password'),
    ).rejects.toThrow('Lien de réinitialisation invalide ou expiré.');
  });
});
