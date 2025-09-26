import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Verificar se já existe um admin
    const existingAdmin = await usersService.findByEmail('admin@timeadministrator.com');
    
    if (!existingAdmin) {
      // Criar utilizador admin
      await usersService.create({
        name: 'Administrador',
        email: 'admin@timeadministrator.com',
        password: 'admin123', // Plain password for testing
        role: UserRole.ADMIN,
        phone: '+351912345678',
      });

      console.log('✅ Utilizador admin criado com sucesso!');
      console.log('📧 Email: admin@timeadministrator.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('ℹ️ Utilizador admin já existe');
    }

    // Criar utilizador cliente de teste
    const existingClient = await usersService.findByEmail('cliente@teste.com');

    if (!existingClient) {
      await usersService.create({
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        password: 'cliente123', // Plain password for testing
        role: UserRole.CLIENT,
        phone: '+351987654321',
      });

      console.log('✅ Utilizador cliente de teste criado!');
      console.log('📧 Email: cliente@teste.com');
      console.log('🔑 Password: cliente123');
    } else {
      console.log('ℹ️ Utilizador cliente de teste já existe');
    }

    // Criar utilizador Sandro
    const existingSandro = await usersService.findByEmail('sandro@gmail.com');

    if (!existingSandro) {
      await usersService.create({
        name: 'Sandro Admin',
        email: 'sandro@gmail.com',
        password: '1234567890aa', // Plain password for testing
        role: UserRole.ADMIN,
        phone: '+351912345678',
      });

      console.log('✅ Utilizador Sandro criado!');
      console.log('📧 Email: sandro@gmail.com');
      console.log('🔑 Password: 1234567890aa');
    } else {
      console.log('ℹ️ Utilizador Sandro já existe');
    }

  } catch (error) {
    console.error('❌ Erro ao criar utilizadores:', error);
  } finally {
    await app.close();
  }
}

seed();