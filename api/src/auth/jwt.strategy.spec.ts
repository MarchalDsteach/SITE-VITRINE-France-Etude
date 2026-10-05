import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  it('loads the current account status and role from the database', async () => {
    const user = {
      id: 'user-1',
      email: 'student@example.com',
      role: 'STUDENT',
      status: 'SUSPENDED',
    };
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue(user) } };
    const config = { getOrThrow: jest.fn().mockReturnValue('test-secret') };
    const strategy = new JwtStrategy(config as any, prisma as any);

    await expect(strategy.validate({ sub: 'user-1' })).resolves.toEqual(user);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: { id: true, email: true, role: true, status: true },
    });
  });

  it('rejects a token belonging to a deleted account', async () => {
    const prisma = { user: { findUnique: jest.fn().mockResolvedValue(null) } };
    const config = { getOrThrow: jest.fn().mockReturnValue('test-secret') };
    const strategy = new JwtStrategy(config as any, prisma as any);

    await expect(strategy.validate({ sub: 'deleted-user' })).rejects.toThrow(
      'Compte introuvable.',
    );
  });
});
