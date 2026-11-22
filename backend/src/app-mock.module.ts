import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthMockController } from './auth/auth-mock.controller';
import { AuthMockService } from './auth/auth-mock.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret || secret.length < 32) {
          throw new Error('JWT_SECRET tem de estar definido e conter pelo menos 32 caracteres.');
        }
        return {
          secret,
          signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d') },
        };
      },
    }),
  ],
  controllers: [AuthMockController],
  providers: [AuthMockService],
})
export class AppMockModule {}
