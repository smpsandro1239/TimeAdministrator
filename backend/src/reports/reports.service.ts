import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from '../clients/schemas/client.schema';
import { Subscription } from '../subscriptions/schemas/subscription.schema';
import { Payment } from '../payments/schemas/payment.schema';
import { PaymentStatus } from '../payments/enums/payment-status.enum';
import { SubscriptionStatus } from '../subscriptions/enums/subscription-status.enum';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {}

  async getDashboardData(period: string, startDate?: string, endDate?: string) {
    const dateRange = this.getDateRange(period, startDate, endDate);
    
    const [metrics, revenueByPlan, expiringSubscriptions, recentPayments, monthlyRevenue] = await Promise.all([
      this.getMetrics(period),
      this.getRevenueByPlan(period),
      this.getExpiringSubscriptions(30),
      this.getRecentPayments(10),
      this.getMonthlyRevenue()
    ]);

    return {
      metrics,
      revenueByPlan,
      expiringSubscriptions,
      recentPayments,
      monthlyRevenue: monthlyRevenue.data,
      monthlyLabels: monthlyRevenue.labels
    };
  }

  async getMetrics(period: string) {
    const dateRange = this.getDateRange(period);
    
    const [totalRevenue, activeSubscriptions, expiringCount, totalClients] = await Promise.all([
      this.paymentModel.aggregate([
        {
          $match: {
            status: PaymentStatus.COMPLETED,
            createdAt: { $gte: dateRange.start, $lte: dateRange.end }
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      this.subscriptionModel.countDocuments({
        status: SubscriptionStatus.ACTIVE,
        createdAt: { $gte: dateRange.start, $lte: dateRange.end }
      }),
      this.subscriptionModel.countDocuments({
        status: SubscriptionStatus.ACTIVE,
        endDate: { 
          $gte: new Date(),
          $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      }),
      this.clientModel.countDocuments({
        createdAt: { $gte: dateRange.start, $lte: dateRange.end }
      })
    ]);

    const revenue = totalRevenue[0]?.total || 0;
    const conversionRate = totalClients > 0 ? Math.round((activeSubscriptions / totalClients) * 100) : 0;

    return {
      totalRevenue: revenue,
      activeSubscriptions,
      expiringSubscriptions: expiringCount,
      conversionRate,
      revenueGrowth: 12, // Mock data - implementar cálculo real
      subscriptionGrowth: 8 // Mock data - implementar cálculo real
    };
  }

  async getRevenueByPlan(period: string) {
    const dateRange = this.getDateRange(period);
    
    const revenueData = await this.paymentModel.aggregate([
      {
        $match: {
          status: PaymentStatus.COMPLETED,
          createdAt: { $gte: dateRange.start, $lte: dateRange.end }
        }
      },
      {
        $lookup: {
          from: 'subscriptions',
          localField: 'subscriptionId',
          foreignField: '_id',
          as: 'subscription'
        }
      },
      { $unwind: '$subscription' },
      {
        $group: {
          _id: '$subscription.period',
          count: { $sum: 1 },
          revenue: { $sum: '$amount' }
        }
      }
    ]);

    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    
    return revenueData.map(item => ({
      plan: this.formatPeriod(item._id),
      count: item.count,
      revenue: item.revenue,
      percentage: totalRevenue > 0 ? Math.round((item.revenue / totalRevenue) * 100) : 0
    }));
  }

  async getExpiringSubscriptions(days: number) {
    const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    
    const expiring = await this.subscriptionModel.aggregate([
      {
        $match: {
          status: SubscriptionStatus.ACTIVE,
          endDate: { $gte: new Date(), $lte: endDate }
        }
      },
      {
        $lookup: {
          from: 'clients',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client'
        }
      },
      { $unwind: '$client' },
      {
        $addFields: {
          daysLeft: {
            $ceil: {
              $divide: [
                { $subtract: ['$endDate', new Date()] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        }
      },
      { $sort: { daysLeft: 1 } }
    ]);

    return expiring.map(sub => ({
      clientName: sub.client.name,
      plan: this.formatPeriod(sub.period),
      daysLeft: sub.daysLeft,
      value: sub.price,
      clientId: sub.clientId,
      subscriptionId: sub._id
    }));
  }

  async getRecentPayments(limit: number) {
    const payments = await this.paymentModel.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'clients',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client'
        }
      },
      { $unwind: '$client' }
    ]);

    return payments.map(payment => ({
      date: payment.createdAt,
      clientName: payment.client.name,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      paymentId: payment._id
    }));
  }

  async getMonthlyRevenue(year?: number) {
    const currentYear = year || new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const monthlyData = await this.paymentModel.aggregate([
      {
        $match: {
          status: PaymentStatus.COMPLETED,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const data = new Array(12).fill(0);
    
    monthlyData.forEach(item => {
      data[item._id - 1] = item.revenue;
    });

    return {
      labels: months,
      data
    };
  }

  async exportReport(period: string, format: 'pdf' | 'excel'): Promise<Buffer> {
    // Mock implementation - implementar com bibliotecas como puppeteer ou exceljs
    const mockData = `Relatório ${period} - ${new Date().toLocaleDateString('pt-PT')}`;
    return Buffer.from(mockData, 'utf-8');
  }

  async exportMetricDetails(metric: string, period: string): Promise<Buffer> {
    // Mock implementation - implementar com exceljs
    const mockData = `Detalhes ${metric} - ${period} - ${new Date().toLocaleDateString('pt-PT')}`;
    return Buffer.from(mockData, 'utf-8');
  }

  private getDateRange(period: string, startDate?: string, endDate?: string) {
    if (period === 'custom' && startDate && endDate) {
      return {
        start: new Date(startDate),
        end: new Date(endDate)
      };
    }

    const now = new Date();
    let start: Date;

    switch (period) {
      case '7days':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return { start, end: now };
  }

  private formatPeriod(period: string): string {
    switch (period) {
      case 'MONTHLY': return '1 Mês';
      case 'QUARTERLY': return '3 Meses';
      case 'SEMI_ANNUAL': return '6 Meses';
      case 'ANNUAL': return '12 Meses';
      default: return period;
    }
  }
}