import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Nécessaire pour vérifier la signature des webhooks Stripe (voir
    // guide paiements) sur les routes qui en ont besoin.
    rawBody: true,
  });

  const logger = new Logger('Bootstrap');

  // --- Headers de sécurité HTTP (helmet) ---
  app.use(helmet());
  app.use(cookieParser());

  // --- CORS : whitelist explicite, jamais de wildcard '*' ---
  const allowedOrigins = [
    'https://app.votredomaine.com',
    'https://staging.votredomaine.com',
    ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000'] : []),
  ];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origine non autorisée par CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // --- Validation globale des inputs (voir guide sécurité) ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Préfixe global : toutes les routes deviennent /api/xxx sauf /health
  // (pratique pour distinguer clairement l'API du reste si un jour un
  // reverse proxy partage le même domaine)
  app.setGlobalPrefix('api', {
    exclude: ['health'],
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`API démarrée sur http://localhost:${port}`);
}
bootstrap();
