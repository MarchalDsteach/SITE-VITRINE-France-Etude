import { ApiProperty } from '@nestjs/swagger';
import { ApplicationType } from '@prisma/client';
import { IsEnum, IsObject } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ enum: ApplicationType, example: ApplicationType.AVI })
  @IsEnum(ApplicationType)
  type: ApplicationType;

  @ApiProperty({
    example: { country: 'France', institution: 'Université Paris Cité' },
    description: 'Champs spécifiques au type de demande.',
  })
  @IsObject()
  formData: Record<string, unknown>;
}
