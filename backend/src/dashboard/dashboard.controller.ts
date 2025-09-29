// c:/laragon/www/TimeAdministrator/backend/src/dashboard/dashboard.controller.ts

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Retorna as métricas principais para o dashboard do administrador.
   */
  @Get('admin-metrics')
  @Roles(UserRole.ADMIN)
  getAdminMetrics(@Query('period') period: '7d' | '30d' | '90d' | 'all' = 'all') {
    return this.dashboardService.getAdminMetrics(period);
  }

  /**
   * Retorna dados de crescimento mensal de clientes para o gráfico.
   */
  @Get('client-growth')
  @Roles(UserRole.ADMIN)
  getClientGrowth(@Query('period') period: '7d' | '30d' | '90d' | 'all' = 'all') {
    return this.dashboardService.getMonthlyClientGrowth(period);
  }

  /**
   * Retorna a distribuição de planos de subscrição ativos.
   */
  @Get('plan-distribution')
  @Roles(UserRole.ADMIN)
  getPlanDistribution(@Query('period') period: '7d' | '30d' | '90d' | 'all' = 'all') {
    return this.dashboardService.getSubscriptionPlanDistribution(period);
  }
}