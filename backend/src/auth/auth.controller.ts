import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Logger } from '../common/logger/logger.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private logger: Logger,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Tentativa de login para: ${loginDto.email}`, 'AuthController');
    const result = await this.authService.login(loginDto);
    this.logger.log(`Login bem-sucedido para: ${loginDto.email}`, 'AuthController');
    return result;
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Tentativa de registo para: ${registerDto.email}`, 'AuthController');
    const result = await this.authService.register(registerDto);
    this.logger.log(`Registo bem-sucedido para: ${registerDto.email}`, 'AuthController');
    return {
      message: 'Utilizador criado com sucesso',
      user: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    // Implementar refresh token se necessário
    return {
      message: 'Token ainda válido',
      user: req.user,
    };
  }
}