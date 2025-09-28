// c:/laragon/www/TimeAdministrator/frontend/src/app/models/plan.model.ts

import { SubscriptionPeriod } from './subscription.model';

/**
 * Define a estrutura de um plano de subscrição para exibição na interface.
 */
export interface SubscriptionPlan {
  period: SubscriptionPeriod;
  name: string;
  price: number;
  description: string;
  discount?: string;
}