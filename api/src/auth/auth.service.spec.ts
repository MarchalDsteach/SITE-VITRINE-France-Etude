import { createHash } from 'crypto';
import { AuthService } from './auth.service';

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

describe('AuthService email and password tokens', () => {
  it('stores only the hash of a valid email verification token', async () => {
    const findFirst = jest.fn(
      (query: {
        where: {
          emailVerificationTokenHash: string;
          emailVerificationExpiresAt: { gt: Date };
        };
      }) => {
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
    const service = new AuthService(prisma as any, {} as any, {} as any);

    await expect(service.verifyEmail('one-time-token')).resolves.toEqual({
      message:
        'Adresse email vérifiée. Votre compte reste en attente de validation administrative.',
    });
    const query = findFirst.mock.calls[0][0];
    expect(query.where.emailVerificationTokenHash).toBe(
      createHash('sha256').update('one-time-token').digest('hex'),
    );
    expect(query.where.emailVerificationExpiresAt.gt).toBeInstanceOf(Date);
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
    const service = new AuthService(prisma as any, {} as any, {} as any);

    await expect(
      service.resetPassword('expired-token', 'new-password'),
    ).rejects.toThrow('Lien de réinitialisation invalide ou expiré.');
  });
});
