import { Module } from '@nestjs/common';
import { VerificateurController } from './verificateur.controller';
import { VerificateurService } from './verificateur.service';

@Module({
  controllers: [VerificateurController],
  providers: [VerificateurService],
})
export class VerificateurModule {}
