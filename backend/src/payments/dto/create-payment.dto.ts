import { IsNotEmpty, IsEnum, IsNumber, IsOptional, IsUrl } from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';
import { SubscriptionPeriod } from '../../subscriptions/enums/subscription-period.enum';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'ID do cliente é obrigatório' })
  clientId: string;

  @IsNumber({}, { message: 'Valor deve ser um número válido' })
  amount: number;

  @IsOptional()
  currency?: string = 'EUR';

  @IsEnum(PaymentMethod, { message: 'Método de pagamento inválido' })
  method: PaymentMethod;

  @IsEnum(SubscriptionPeriod, { message: 'Período de subscrição inválido' })
  subscriptionPeriod: SubscriptionPeriod;

  @IsOptional()
  @IsUrl({}, { message: 'URL do comprovativo deve ser válida' })
  proofOfPaymentUrl?: string;

  @IsOptional()
  notes?: string;
}