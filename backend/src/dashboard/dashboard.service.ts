import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from '../clients/schemas/client.schema';
import { Subscription, SubscriptionDocument } from '../subscriptions/schemas/subscription.schema';
import { Payment, PaymentDocument } from '../payments/schemas/payment.schema';
import { SubscriptionPeriod, SubscriptionPeriodLabels } from '../subscriptions/enums/subscription-period.enum';
import { SubscriptionStatus } from '../subscriptions/enums/subscription-status.enum';
import { PaymentStatus } from '../payments/enums/payment-status.enum';

type Period = '7d' | '30d' | '90d' | 'all';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  private getDateFilter(period: Period, field: string = 'createdAt') {
    if (period === 'all') {
      return {};
    }
    const days = parseInt(period.replace('d', ''), 10);
    const date = new Date();
    date.setDate(date.getDate() - days);
    return { [field]: { $gte: date } };
  }

  async getAdminMetrics(period: Period) {
    const dateFilter = this.getDateFilter(period);

    const [
      totalClients,
      activeSubscriptions,
      expiringSoon,
      pendingPayments,
    ] = await Promise.all([
      this.clientModel.countDocuments(dateFilter).exec(),
      this.subscriptionModel.countDocuments({ status: SubscriptionStatus.ACTIVE, ...dateFilter }).exec(),
      this.subscriptionModel.countDocuments({
        status: SubscriptionStatus.ACTIVE,
        endDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      }).exec(),
      this.paymentModel.countDocuments({ status: PaymentStatus.PENDING, ...dateFilter }).exec(),
    ]);

    return { totalClients, activeSubscriptions, expiringSoon, pendingPayments };
  }

  async getMonthlyClientGrowth(period: Period) {
    const dateFilter = this.getDateFilter(period);

    const growthData = await this.clientModel.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          name: { $concat: [{ $toString: '$_id.month' }, '/', { $toString: '$_id.year' }] },
          value: '$count',
        },
      },
    ]);
    return growthData;
  }

  async getSubscriptionPlanDistribution(period: Period) {
    const dateFilter = this.getDateFilter(period, 'startDate');

    const distributionData = await this.subscriptionModel.aggregate([
      { $match: { status: SubscriptionStatus.ACTIVE, ...dateFilter } },
      { $group: { _id: '$period', value: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', value: '$value' } },
    ]);

    const planOrder = [SubscriptionPeriod.ONE_MONTH, SubscriptionPeriod.THREE_MONTHS, SubscriptionPeriod.SIX_MONTHS, SubscriptionPeriod.ONE_YEAR];

    const formattedAndSortedData = distributionData
      .map((item: { name: SubscriptionPeriod; value: number }) => ({
        ...item,
        name: SubscriptionPeriodLabels[item.name] || item.name,
      }))
      .sort((a: { name: string }, b: { name: string }) => {
        const aKey = Object.keys(SubscriptionPeriodLabels).find(key => SubscriptionPeriodLabels[key] === a.name) as SubscriptionPeriod;
        const bKey = Object.keys(SubscriptionPeriodLabels).find(key => SubscriptionPeriodLabels[key] === b.name) as SubscriptionPeriod;
        return planOrder.indexOf(aKey) - planOrder.indexOf(bKey);
      });

    return formattedAndSortedData;
  }
}