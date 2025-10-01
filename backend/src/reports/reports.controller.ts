import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { ReportsService } from './reports.service';

@Controller('api/v1/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  async getDashboardData(
    @Query('period') period: string = '30days',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getDashboardData(period, startDate, endDate);
  }

  @Get('metrics')
  async getMetrics(@Query('period') period: string = '30days') {
    return this.reportsService.getMetrics(period);
  }

  @Get('revenue-by-plan')
  async getRevenueByPlan(@Query('period') period: string = '30days') {
    return this.reportsService.getRevenueByPlan(period);
  }

  @Get('expiring-subscriptions')
  async getExpiringSubscriptions(@Query('days') days: string = '30') {
    return this.reportsService.getExpiringSubscriptions(parseInt(days));
  }

  @Get('recent-payments')
  async getRecentPayments(@Query('limit') limit: string = '10') {
    return this.reportsService.getRecentPayments(parseInt(limit));
  }

  @Get('monthly-revenue')
  async getMonthlyRevenue(@Query('year') year?: string) {
    return this.reportsService.getMonthlyRevenue(year ? parseInt(year) : undefined);
  }

  @Get('export')
  async exportReport(
    @Query('period') period: string = '30days',
    @Query('format') format: string = 'pdf',
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.exportReport(period, format as 'pdf' | 'excel');
    
    const filename = `relatorio-${period}-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
    const contentType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    
    res.send(buffer);
  }

  @Get('export-metric')
  async exportMetricDetails(
    @Query('metric') metric: string,
    @Query('period') period: string = '30days',
    @Res() res: Response,
  ) {
    const buffer = await this.reportsService.exportMetricDetails(metric, period);
    
    const filename = `detalhes-${metric}-${period}-${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    
    res.send(buffer);
  }
}