import { connect, connection } from 'mongoose';
import * as bcrypt from 'bcryptjs';

async function createAtlasDatabase() {
  try {
    console.log('🌱 Conectando ao MongoDB Atlas...');
    
    // Conectar ao MongoDB Atlas
    const uri = 'mongodb+srv://timeadmin:TimeAdmin2024@cluster0.mongodb.net/timeadministrator?retryWrites=true&w=majority';
    await connect(uri);
    console.log('✅ Conectado ao MongoDB Atlas');

    const db = connection.db;
    
    // Limpar coleções existentes
    await db.collection('users').deleteMany({});
    await db.collection('clients').deleteMany({});
    console.log('🧹 Coleções limpas');
    
    // Criar admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminResult = await db.collection('users').insertOne({
      name: 'Administrador',
      email: 'admin@timeadministrator.com',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date()
    });
    
    console.log('✅ Admin criado');

    // Criar cliente
    const clientPassword = await bcrypt.hash('cliente123', 10);
    const clientUserResult = await db.collection('users').insertOne({
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      password: clientPassword,
      role: 'CLIENT',
      isActive: true,
      createdAt: new Date()
    });
    
    console.log('✅ Cliente user criado');

    // Criar perfil cliente
    await db.collection('clients').insertOne({
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      phone: '+351912345678',
      notes: 'Cliente de teste criado automaticamente',
      isActive: true,
      userId: clientUserResult.insertedId.toString(),
      createdAt: new Date()
    });
    
    console.log('✅ Cliente profile criado');

    console.log('');
    console.log('🎉 Base de dados Atlas criada com sucesso!');
    console.log('');
    console.log('📋 Credenciais para login:');
    console.log('   👨💼 Admin: admin@timeadministrator.com / admin123');
    console.log('   👤 Cliente: cliente@teste.com / cliente123');
    console.log('');
    console.log('🌐 Base de dados: MongoDB Atlas (Cloud)');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await connection.close();
  }
}

createAtlasDatabase();