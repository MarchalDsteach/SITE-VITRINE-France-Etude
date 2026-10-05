import { PaymentsService } from './payments.service';

describe('PaymentsService.create', () => {
  it('should create a pending payment for an application owned by the user', async () => {
    const prisma = {
      application: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'app-1',
          userId: 'user-1',
        }),
        update: jest.fn().mockResolvedValue({ id: 'app-1', status: 'PAYMENT_PENDING' }),
      },
      payment: {
        create: jest.fn().mockResolvedValue({
          id: 'pay-1',
          applicationId: 'app-1',
          status: 'PENDING',
          amount: 149,
          currency: 'EUR',
        }),
      },
    };

    const service = new PaymentsService(prisma as any);

    const result = await service.create({
      applicationId: 'app-1',
      userId: 'user-1',
      amount: 149,
      currency: 'EUR',
      provider: 'manual',
      description: 'Frais de dossier',
    });

    expect(result.status).toBe('PENDING');
    expect(prisma.payment.create).toHaveBeenCalled();
  });
});
