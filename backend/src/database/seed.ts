import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/clients.service';
import { UserRole } from '../users/enums/user-role.enum';
import * as bcrypt from 'bcryptjs';

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

    // Criar cliente de teste
    const clientExists = await usersService.findByEmail('cliente@teste.com');
    if (!clientExists) {
      const hashedPassword = await bcrypt.hash('cliente123', 10);
      const clientUser = await usersService.create({
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        password: hashedPassword,
        role: UserRole.CLIENT
      });

      // Criar perfil de cliente
      await clientsService.create({
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        phone: '+351912345678',
        notes: 'Cliente de teste criado automaticamente',
        isActive: true,
        userId: (clientUser as any)._id.toString()
      });
      console.log('✅ Cliente criado: cliente@teste.com / cliente123');
    } else {
      console.log('ℹ️  Cliente teste já existe');
    }

    console.log('🎉 Seed concluído com sucesso!');
    console.log('');
    console.log('📋 Credenciais:');
    console.log('   Admin: admin@timeadministrator.com / admin123');
    console.log('   Cliente: cliente@teste.com / cliente123');
    
  } catch (error) {
    console.error('❌ Erro no seed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();