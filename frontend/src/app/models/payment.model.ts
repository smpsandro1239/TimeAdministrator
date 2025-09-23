import { SubscriptionPeriod } from './subscription.model';

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  MANUAL = 'manual',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
}

export interface Payment {
  id: string;
  clientId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  subscriptionPeriod: SubscriptionPeriod;
  stripePaymentIntentId?: string;
  receiptUrl?: string;
  proofOfPaymentUrl?: string;
  notes?: string;
  paidAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentRequest {
  clientId: string;
  amount: number;
  currency?: string;
  method: PaymentMethod;
  subscriptionPeriod: SubscriptionPeriod;
  proofOfPaymentUrl?: string;
  notes?: string;
}

export interface CreateStripePaymentRequest {
  clientId: string;
  amount: number;
  subscriptionPeriod: SubscriptionPeriod;
}

export interface StripePaymentResponse {
  clientSecret: string;
  paymentId: string;
}