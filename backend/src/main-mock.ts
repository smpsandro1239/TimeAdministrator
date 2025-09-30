import { NestFactory } from '@nestjs/core';
import { AppMockModule } from './app-mock.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppMockModule);
  
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  
  await app.listen(3000);
  console.log('🚀 Backend Mock rodando em http://localhost:3000');
  console.log('📋 Credenciais: admin@timeadministrator.com / admin123');
}

bootstrap();