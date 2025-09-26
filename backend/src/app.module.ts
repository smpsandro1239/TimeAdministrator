import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';

// Módulos da aplicação
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CommonModule } from './common/common.module';

// Configuração
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';

@Module({
  controllers: [AppController],
  imports: [
    // Configuração
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Base de dados
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: databaseConfig,
      inject: [ConfigService],
    }),

    // JWT Global
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: jwtConfig,
      inject: [ConfigService],
      global: true,
    }),

    // Agendamento de tarefas
    ScheduleModule.forRoot(),

    // Módulos da aplicação
    CommonModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    SubscriptionsModule,
    PaymentsModule,
    NotificationsModule,
  ],
})
export class AppModule {}