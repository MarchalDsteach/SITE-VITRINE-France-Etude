import { Controller, Get, Param } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { VerificateurService } from './verificateur.service';
import { VerifyReferenceParamsDto } from './dto/verify-reference-params.dto';

@Controller('verificateur')
export class VerificateurController {
  constructor(private readonly verificateurService: VerificateurService) {}

  // Endpoint public, sans authentification — c'est le point le plus
  // exposé du système. Limite renforcée par rapport au throttling global
  // (voir guide sécurité) : 20 vérifications / minute / IP.
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Get(':reference')
  verify(@Param() params: VerifyReferenceParamsDto) {
    return this.verificateurService.verify(params.reference);
  }
}
