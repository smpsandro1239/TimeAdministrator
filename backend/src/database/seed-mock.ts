import * as bcrypt from 'bcryptjs';

// Mock da base de dados para desenvolvimento
const mockDatabase = {
  users: [] as any[],
  clients: [] as any[]
};

async function createMockDatabase() {
  try {
    console.log('🌱 Criando base de dados mock para desenvolvimento...');
    
    // Limpar dados existentes
    mockDatabase.users = [];
    mockDatabase.clients = [];
    
    // Criar admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Administrador',
      email: 'admin@timeadministrator.com',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date()
    };
    mockDatabase.users.push(admin);
    
    console.log('✅ Admin criado');

    // Criar cliente
    const clientPassword = await bcrypt.hash('cliente123', 10);
    const clientUser = {
      _id: '507f1f77bcf86cd799439012',
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      password: clientPassword,
      role: 'CLIENT',
      isActive: true,
      createdAt: new Date()
    };
    mockDatabase.users.push(clientUser);
    
    console.log('✅ Cliente user criado');

    // Criar perfil cliente
    const client = {
      _id: '507f1f77bcf86cd799439013',
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      phone: '+351912345678',
      notes: 'Cliente de teste criado automaticamente',
      isActive: true,
      userId: clientUser._id,
      createdAt: new Date()
    };
    mockDatabase.clients.push(client);
    
    console.log('✅ Cliente profile criado');

    // Salvar dados em arquivo JSON para persistência
    const fs = require('fs');
    const path = require('path');
    
    const dataPath = path.join(__dirname, '../../data/mock-db.json');
    const dataDir = path.dirname(dataPath);
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(dataPath, JSON.stringify(mockDatabase, null, 2));
    console.log('💾 Dados salvos em mock-db.json');

    console.log('');
    console.log('🎉 Base de dados mock criada com sucesso!');
    console.log('');
    console.log('📋 Credenciais para login:');
    console.log('   👨💼 Admin: admin@timeadministrator.com / admin123');
    console.log('   👤 Cliente: cliente@teste.com / cliente123');
    console.log('');
    console.log('⚠️  NOTA: Esta é uma base de dados mock para desenvolvimento');
    console.log('   Configure MongoDB real para produção');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

createMockDatabase();