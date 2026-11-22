import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../app.module';
import { ClientsService } from '../clients/clients.service';
import { UserRole } from '../users/enums/user-role.enum';
import { UsersService } from '../users/users.service';

async function bootstrap(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const clientEmail = process.env.CLIENT_EMAIL;
  const clientPassword = process.env.CLIENT_PASSWORD;

  if (!adminEmail || !adminPassword || adminPassword.length < 12 ||
      !clientEmail || !clientPassword || clientPassword.length < 12) {
    throw new Error('Define ADMIN_EMAIL, ADMIN_PASSWORD, CLIENT_EMAIL e CLIENT_PASSWORD; cada password deve ter pelo menos 12 caracteres.');
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const usersService = app.get(UsersService);
    const clientsService = app.get(ClientsService);

    const adminExists = await usersService.findByEmail(adminEmail);
    if (!adminExists) {
      await usersService.create({
        name: 'Administrador',
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 12),
        role: UserRole.ADMIN,
      });
      console.log('Conta administrativa inicial criada.');
    } else {
      console.log('A conta administrativa já existe; não foi alterada.');
    }

    const clientExists = await usersService.findByEmail(clientEmail);
    if (!clientExists) {
      const clientUser = await usersService.create({
        name: 'Cliente de demonstração',
        email: clientEmail,
        password: await bcrypt.hash(clientPassword, 12),
        role: UserRole.CLIENT,
      });

      await clientsService.create({
        name: 'Cliente de demonstração',
        email: clientEmail,
        notes: 'Conta de demonstração criada por seed.',
        isActive: true,
        userId: (clientUser as any)._id.toString(),
      });
      console.log('Conta de demonstração criada.');
    } else {
      console.log('A conta de demonstração já existe; não foi alterada.');
    }

    console.log('Seed concluído sem apagar contas existentes nem revelar credenciais.');
  } catch (error: unknown) {
    console.error('Falha no seed:', error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

void bootstrap();
