import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  subject: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  body: string;
}
