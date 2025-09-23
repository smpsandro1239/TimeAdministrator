export enum SubscriptionPeriod {
  ONE_MONTH = '1_month',
  THREE_MONTHS = '3_months',
  SIX_MONTHS = '6_months',
  ONE_YEAR = '1_year',
}

export const SubscriptionPeriodLabels = {
  [SubscriptionPeriod.ONE_MONTH]: '1 Mês',
  [SubscriptionPeriod.THREE_MONTHS]: '3 Meses',
  [SubscriptionPeriod.SIX_MONTHS]: '6 Meses',
  [SubscriptionPeriod.ONE_YEAR]: '1 Ano',
};

export const SubscriptionPeriodMonths = {
  [SubscriptionPeriod.ONE_MONTH]: 1,
  [SubscriptionPeriod.THREE_MONTHS]: 3,
  [SubscriptionPeriod.SIX_MONTHS]: 6,
  [SubscriptionPeriod.ONE_YEAR]: 12,
};