import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AdminService.updateUserStatus', () => {
  it('confirms the email address when an administrator activates an account', async () => {
    const prisma = {
      user: {
        update: jest.fn().mockResolvedValue({ id: 'student-1' }),
      },
    };
    const service = new AdminService(prisma as unknown as PrismaService);

    await service.updateUserStatus('student-1', 'ACTIVE', 'admin-1');

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'student-1' },
        data: { status: 'ACTIVE', emailVerified: true },
      }),
    );
  });

  it('does not change the email verification state for other statuses', async () => {
    const prisma = {
      user: {
        update: jest.fn().mockResolvedValue({ id: 'student-1' }),
      },
    };
    const service = new AdminService(prisma as unknown as PrismaService);

    await service.updateUserStatus('student-1', 'REJECTED', 'admin-1');

    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'student-1' },
        data: { status: 'REJECTED' },
      }),
    );
  });
});
