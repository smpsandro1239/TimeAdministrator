export enum SubscriptionPeriod {
  ONE_MONTH = '1_month',
  THREE_MONTHS = '3_months',
  SIX_MONTHS = '6_months',
  ONE_YEAR = '1_year',
}

export enum SubscriptionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export const SubscriptionPeriodLabels = {
  [SubscriptionPeriod.ONE_MONTH]: '1 Mês',
  [SubscriptionPeriod.THREE_MONTHS]: '3 Meses',
  [SubscriptionPeriod.SIX_MONTHS]: '6 Meses',
  [SubscriptionPeriod.ONE_YEAR]: '1 Ano',
};

export interface Subscription {
  id: string;
  clientId: string;
  period: SubscriptionPeriod;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  renewalDate: Date;
  price: number;
  autoRenew: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionRequest {
  clientId: string;
  period: SubscriptionPeriod;
  status?: SubscriptionStatus;
  startDate: string;
  endDate: string;
  renewalDate: string;
  price: number;
  autoRenew?: boolean;
  notes?: string;
}

export interface UpdateSubscriptionRequest extends Partial<CreateSubscriptionRequest> {}