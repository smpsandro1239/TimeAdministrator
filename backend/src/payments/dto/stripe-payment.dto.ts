import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { SubscriptionPeriod } from '../../subscriptions/enums/subscription-period.enum';

export class CreateStripePaymentDto {
  @IsString()
  clientId: string;

  @IsNumber()
  amount: number;

  @IsEnum(SubscriptionPeriod)
  subscriptionPeriod: SubscriptionPeriod;

  @IsOptional()
  @IsString()
  notes?: string;
}