import { connect, connection } from 'mongoose';
import * as bcrypt from 'bcryptjs';

// Schemas simples
const userSchema = {
  name: String,
  email: String,
  password: String,
  role: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
};

const clientSchema = {
  name: String,
  email: String,
  phone: String,
  notes: String,
  isActive: { type: Boolean, default: true },
  userId: String,
  createdAt: { type: Date, default: Date.now }
};

async function createDatabase() {
  try {
    console.log('🌱 Criando base de dados local...');
    
    // Conectar ao MongoDB local
    await connect('mongodb://localhost:27017/timeadministrator');
    console.log('✅ Conectado ao MongoDB');

    // Criar coleções
    const db = connection.db;
    
    // Limpar coleções existentes
    await db.collection('users').deleteMany({});
    await db.collection('clients').deleteMany({});
    
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
    
    console.log('✅ Admin criado:', adminResult.insertedId);

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
    
    console.log('✅ Cliente user criado:', clientUserResult.insertedId);

    // Criar perfil cliente
    const clientResult = await db.collection('clients').insertOne({
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      phone: '+351912345678',
      notes: 'Cliente de teste criado automaticamente',
      isActive: true,
      userId: clientUserResult.insertedId.toString(),
      createdAt: new Date()
    });
    
    console.log('✅ Cliente profile criado:', clientResult.insertedId);

    console.log('');
    console.log('🎉 Base de dados criada com sucesso!');
    console.log('');
    console.log('📋 Credenciais para login:');
    console.log('   👨💼 Admin: admin@timeadministrator.com / admin123');
    console.log('   👤 Cliente: cliente@teste.com / cliente123');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('');
      console.log('💡 SOLUÇÃO:');
      console.log('1. Instalar MongoDB: https://www.mongodb.com/try/download/community');
      console.log('2. Ou usar MongoDB Atlas: https://mongodb.com/atlas');
      console.log('3. Ou executar: mongod --dbpath ./data');
    }
  } finally {
    await connection.close();
  }
}

createDatabase();