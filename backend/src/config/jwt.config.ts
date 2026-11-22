import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  const secret = configService.get<string>('JWT_SECRET');

  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET tem de estar definido e conter pelo menos 32 caracteres.');
  }

  return {
    secret,
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
    },
  };
};
