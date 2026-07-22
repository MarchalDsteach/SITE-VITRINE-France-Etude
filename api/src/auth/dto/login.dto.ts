import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'amina@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'MotDePasseFort1!' })
  @IsString()
  @MinLength(8)
  password: string;
}
