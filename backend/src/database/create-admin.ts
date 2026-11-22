import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';

async function createAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 12) {
    throw new Error('Define ADMIN_EMAIL e uma ADMIN_PASSWORD com pelo menos 12 caracteres.');
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const usersService = app.get(UsersService);
    const existingAdmin = await usersService.findByEmail(email);

    if (existingAdmin) {
      console.log('A conta indicada já existe; nenhuma password foi alterada.');
      return;
    }

    await usersService.create({
      name: 'Administrador',
      email,
      password,
      role: UserRole.ADMIN,
    });

    console.log('Conta administrativa criada. Não são apresentados dados de autenticação.');
  } finally {
    await app.close();
  }
}

void createAdmin().catch((error: unknown) => {
  console.error('Falha ao criar administrador:', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
