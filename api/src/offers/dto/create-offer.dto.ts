import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OfferType } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateOfferDto {
  @ApiProperty() @IsString() @MaxLength(160) title: string;
  @ApiProperty() @IsString() @MaxLength(120) company: string;
  @ApiProperty() @IsString() @MaxLength(120) location: string;
  @ApiPropertyOptional({ enum: OfferType, default: OfferType.ALTERNANCE }) @IsOptional() @IsEnum(OfferType) type?: OfferType;
  @ApiPropertyOptional({ example: 'Alternance' }) @IsOptional() @IsString() contractType?: string;
  @ApiPropertyOptional({ example: '12 mois' }) @IsOptional() @IsString() duration?: string;
  @ApiProperty() @IsString() description: string;
  @ApiPropertyOptional() @IsOptional() @IsString() requirements?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() applyUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPublished?: boolean;
}
