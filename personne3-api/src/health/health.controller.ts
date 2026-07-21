import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('health')
export class HealthController {
  // On désactive le rate limiting sur /health : Uptime Robot appelle cet
  // endpoint toutes les 5 min, il ne doit jamais être bloqué par erreur.
  @SkipThrottle()
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
