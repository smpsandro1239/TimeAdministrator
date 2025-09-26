import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'Password é obrigatória' })
  @MinLength(6, { message: 'Password deve ter pelo menos 6 caracteres' })
  password: string;

  @IsOptional()
  phone?: string;
}