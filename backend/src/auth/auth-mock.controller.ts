import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthMockService } from './auth-mock.service';

@Controller('auth')
export class AuthMockController {
  constructor(private authMockService: AuthMockService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; password: string }) {
    return this.authMockService.login(body.email, body.password);
  }
}