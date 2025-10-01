import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/clients.service';
import { UserRole } from '../users/enums/user-role.enum';
import { startMemoryDB, stopMemoryDB } from './memory-db';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  // Iniciar MongoDB em memória
  const mongoUri = await startMemoryDB();
  
  // Configurar variável de ambiente temporariamente
  process.env.MONGODB_URI = mongoUri;
  
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const clientsService = app.get(ClientsService);

  try {
    console.log('🌱 Criando utilizadores de teste...');

    // Criar utilizador admin
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const admin = await usersService.create({
      name: 'Administrador',
      email: 'admin@timeadministrator.com',
      password: hashedAdminPassword,
      role: UserRole.ADMIN
    });
    console.log('✅ Admin criado: admin@timeadministrator.com / admin123');

    // Criar cliente de teste
    const hashedClientPassword = await bcrypt.hash('cliente123', 10);
    const clientUser = await usersService.create({
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      password: hashedClientPassword,
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

    console.log('🎉 Utilizadores criados com sucesso!');
    console.log('');
    console.log('📋 Credenciais para login:');
    console.log('   👨‍💼 Admin: admin@timeadministrator.com / admin123');
    console.log('   👤 Cliente: cliente@teste.com / cliente123');
    console.log('');
    console.log('⚠️  NOTA: Esta é uma base de dados temporária em memória');
    console.log('   Os dados serão perdidos quando parar a aplicação');
    
  } catch (error) {
    console.error('❌ Erro ao criar utilizadores:', error);
  } finally {
    await app.close();
    await stopMemoryDB();
  }
}

bootstrap();