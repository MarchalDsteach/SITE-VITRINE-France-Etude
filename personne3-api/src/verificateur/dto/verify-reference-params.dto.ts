import { IsString, Matches, Length } from 'class-validator';

export class VerifyReferenceParamsDto {
  // Format UUID (généré par Prisma @default(uuid())) — rejette tout ce
  // qui n'a pas cette forme avant même de toucher la base.
  @IsString()
  @Length(36, 36)
  @Matches(/^[0-9a-f-]{36}$/i, { message: 'Format de référence invalide' })
  reference: string;
}
