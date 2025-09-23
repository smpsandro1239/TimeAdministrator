import { IsNotEmpty, IsEnum, IsDateString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { SubscriptionPeriod } from '../enums/subscription-period.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

export class CreateSubscriptionDto {
  @IsNotEmpty({ message: 'ID do cliente é obrigatório' })
  clientId: string;

  @IsEnum(SubscriptionPeriod, { message: 'Período de subscrição inválido' })
  period: SubscriptionPeriod;

  @IsOptional()
  @IsEnum(SubscriptionStatus, { message: 'Estado da subscrição inválido' })
  status?: SubscriptionStatus;

  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  startDate: string;

  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  endDate: string;

  @IsDateString({}, { message: 'Data de renovação deve ser uma data válida' })
  renewalDate: string;

  @IsNumber({}, { message: 'Preço deve ser um número válido' })
  price: number;

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;

  @IsOptional()
  notes?: string;
}