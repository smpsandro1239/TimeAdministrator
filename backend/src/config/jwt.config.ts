import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => ({
  secret: configService.get<string>('JWT_SECRET', 'your-super-secret-jwt-key'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
  },
});