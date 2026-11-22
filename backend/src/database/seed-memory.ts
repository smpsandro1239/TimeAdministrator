import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/clients.service';
import { UserRole } from '../users/enums/user-role.enum';
import { startMemoryDB, stopMemoryDB } from './memory-db';

async function bootstrap(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const clientEmail = process.env.CLIENT_EMAIL;
  const clientPassword = process.env.CLIENT_PASSWORD;

  if (!adminEmail || !adminPassword || adminPassword.length < 12 ||
      !clientEmail || !clientPassword || clientPassword.length < 12) {
    throw new Error('Define ADMIN_EMAIL, ADMIN_PASSWORD, CLIENT_EMAIL e CLIENT_PASSWORD com passwords de pelo menos 12 caracteres.');
  }

  const mongoUri = await startMemoryDB();
  process.env.MONGODB_URI = mongoUri;
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const usersService = app.get(UsersService);
    const clientsService = app.get(ClientsService);

    const admin = await usersService.create({
      name: 'Administrador de teste',
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 12),
      role: UserRole.ADMIN,
    });

    const client = await usersService.create({
      name: 'Cliente de teste',
      email: clientEmail,
      password: await bcrypt.hash(clientPassword, 12),
      role: UserRole.CLIENT,
    });

    await clientsService.create({
      name: 'Cliente de teste',
      email: clientEmail,
      isActive: true,
      userId: (client as any)._id.toString(),
    });

    console.log('Contas temporárias criadas na base de dados em memória.');
    void admin;
  } catch (error: unknown) {
    console.error('Falha ao criar contas de teste:', error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    await app.close();
    await stopMemoryDB();
  }
}

void bootstrap();
