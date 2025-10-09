import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { Logger } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  // Segurança
  app.use(helmet());

  // CORS: permitir múltiplas origens
  const allowedOrigins = [
    'http://localhost:4200',
    'https://time-administrator-git-main-smpsandro1239s-projects.vercel.app',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origem ${origin} não permitida por CORS`));
        }
      },
      credentials: true,
    }),
  );

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // máximo 100 requests por IP
      message: 'Demasiados pedidos deste IP, tente novamente mais tarde.',
    }),
  );

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefixo global da API
  app.setGlobalPrefix('api/v1');

  const port = configService.get('PORT', 3000);
  await app.listen(port);

  logger.log(`🚀 Aplicação iniciada na porta ${port}`, 'Bootstrap');
  logger.log(`📖 Documentação disponível em http://localhost:${port}/api`, 'Bootstrap');
}

bootstrap();
