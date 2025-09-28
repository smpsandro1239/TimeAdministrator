// c:/laragon/www/TimeAdministrator/backend/src/payments/dto/create-payment-intent.dto.ts

import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SubscriptionPeriod } from '../../subscriptions/enums/subscription-period.enum';

export class CreatePaymentIntentDto {
  @IsString()
  @IsNotEmpty()
  subscriptionPeriod: SubscriptionPeriod;

  @IsNumber()
  amount: number;
}