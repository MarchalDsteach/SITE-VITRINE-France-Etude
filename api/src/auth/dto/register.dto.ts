import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'amina@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, example: 'MotDePasseFort1!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Amina' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Diallo' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '+33612345678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'France', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'Sénégal', required: false })
  @IsOptional()
  @IsString()
  originCountry?: string;
}
