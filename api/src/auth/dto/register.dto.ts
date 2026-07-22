import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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

}
