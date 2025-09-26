import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';
import * as bcrypt from 'bcryptjs';

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Remover utilizador admin existente
    try {
      const existingAdmin = await usersService.findByEmail('admin@timeadministrator.com');
      if (existingAdmin) {
        await usersService.remove((existingAdmin as any)._id);
        console.log('🗑️ Utilizador admin existente removido');
      }
    } catch (error) {
      console.log('ℹ️ Nenhum utilizador admin existente');
    }

    // Criar novo utilizador admin
    const admin = await usersService.create({
      name: 'Administrador',
      email: 'admin@timeadministrator.com',
      password: 'admin123', // Plain password for testing
      role: UserRole.ADMIN,
      phone: '+351912345678',
    });

    console.log('✅ Utilizador admin criado com sucesso!');
    console.log('📧 Email: admin@timeadministrator.com');
    console.log('🔑 Password: admin123');
    console.log('👤 ID:', (admin as any)._id);

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  } finally {
    await app.close();
  }
}

createAdmin();