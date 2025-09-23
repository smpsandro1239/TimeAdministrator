import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { SubscriptionPeriod } from '../../subscriptions/enums/subscription-period.enum';

export class CreateStripePaymentDto {
  @IsNotEmpty({ message: 'ID do cliente é obrigatório' })
  clientId: string;

  @IsNumber({}, { message: 'Valor deve ser um número válido' })
  amount: number;

  @IsEnum(SubscriptionPeriod, { message: 'Período de subscrição inválido' })
  subscriptionPeriod: SubscriptionPeriod;
}