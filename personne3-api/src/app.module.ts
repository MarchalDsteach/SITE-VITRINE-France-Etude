import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { VerificateurModule } from './verificateur/verificateur.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    // Rend process.env.* disponible partout dans l'app sans réimporter dotenv
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting global : 100 requêtes / 60s par IP.
    // Des limites plus strictes peuvent être appliquées endpoint par
    // endpoint avec le décorateur @Throttle() (voir guide sécurité).
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    HealthModule,
    PrismaModule,
    VerificateurModule,
    PaymentsModule,
    // Les futurs modules métier (auth, dossiers...) s'ajoutent ici.
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
