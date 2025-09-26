import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getApiInfo() {
    return {
      name: 'TimeAdministrator API',
      version: '1.0.0',
      description: 'Sistema de gestão de subscrições de clientes',
      endpoints: {
        auth: '/api/v1/auth',
        users: '/api/v1/users',
        clients: '/api/v1/clients',
        subscriptions: '/api/v1/subscriptions',
        payments: '/api/v1/payments',
        notifications: '/api/v1/notifications',
      },
      documentation: '/api/v1',
      status: 'online',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}