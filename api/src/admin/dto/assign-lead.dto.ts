import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeadPriority, LeadStatus } from '@prisma/client';

export class AssignLeadDto {
  @IsOptional()
  @IsString()
  advisorId?: string | null;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsEnum(LeadPriority)
  priority?: LeadPriority;
}
