import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../app.module';
import { ClientsService } from '../clients/clients.service';
import { UserRole } from '../users/enums/user-role.enum';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const clientsService = app.get(ClientsService);

  try {
    console.log('🌱 Iniciando seed da base de dados...');

    // Criar utilizador admin
    const adminExists = await usersService.findByEmail('admin@timeadministrator.com');
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = await usersService.create({
        name: 'Administrador',
        email: 'admin@timeadministrator.com',
        password: hashedPassword,
        role: UserRole.ADMIN
      });
      console.log('✅ Admin criado: admin@timeadministrator.com / admin123');
    } else {
      console.log('ℹ️  Admin já existe');
    }

    // Criar cliente de demonstração
    const demoClientExists = await usersService.findByEmail('cliente@demo.com');
    if (!demoClientExists) {
      const hashedPassword = await bcrypt.hash('cliente123', 10);
      const demoClientUser = await usersService.create({
        name: 'Cliente Demo',
        email: 'cliente@demo.com',
        password: hashedPassword,
        role: UserRole.CLIENT
      });

      // Criar perfil de cliente
      await clientsService.create({
        name: 'Cliente Demo',
        email: 'cliente@demo.com',
        phone: '+351912345678',
        notes: 'Cliente de demonstração criado automaticamente',
        isActive: true,
        userId: (demoClientUser as any)._id.toString()
      });
      console.log('✅ Cliente demo criado: cliente@demo.com / cliente123');
    } else {
      console.log('ℹ️  Cliente demo já existe');
    }

    // Criar admin de demonstração
    const demoAdminExists = await usersService.findByEmail('admin@demo.com');
    if (!demoAdminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await usersService.create({
        name: 'Admin Demo',
        email: 'admin@demo.com',
        password: hashedPassword,
        role: UserRole.ADMIN
      });
      console.log('✅ Admin demo criado: admin@demo.com / admin123');
    } else {
      console.log('ℹ️  Admin demo já existe');
    }

    console.log('🎉 Seed concluído com sucesso!');
    console.log('');
    console.log('📋 Credenciais:');
    console.log('   Admin: admin@timeadministrator.com / admin123');
    console.log('   Admin Demo: admin@demo.com / admin123');
    console.log('   Cliente Demo: cliente@demo.com / cliente123');

  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
