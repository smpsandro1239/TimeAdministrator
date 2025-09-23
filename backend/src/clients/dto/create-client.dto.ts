import { IsEmail, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  phone: string;

  @IsOptional()
  notes?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  subscriptionStartDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  subscriptionEndDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de renovação deve ser uma data válida' })
  nextRenewalDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  userId?: string;
}