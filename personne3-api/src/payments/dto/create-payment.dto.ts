import { IsUUID, IsIn } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  dossierId: string;

  @IsIn(['stripe', 'paypal', 'mobile_money'])
  provider: 'stripe' | 'paypal' | 'mobile_money';
}
