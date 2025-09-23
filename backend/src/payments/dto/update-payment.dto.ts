import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { CreatePaymentDto } from './create-payment.dto';
import { PaymentStatus } from '../enums/payment-status.enum';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'Estado do pagamento inválido' })
  status?: PaymentStatus;
}