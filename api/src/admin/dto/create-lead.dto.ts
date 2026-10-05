import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { LeadSource } from '@prisma/client';

export class CreateLeadDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  subject?: string;

  @IsEnum(LeadSource)
  source: LeadSource;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  message?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  serviceName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  country?: string;
}
