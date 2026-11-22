import 'dotenv/config';
import * as bcrypt from 'bcryptjs';

const mockDatabase = {
  users: [] as any[],
  clients: [] as any[],
};

async function createMockDatabase(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const clientEmail = process.env.CLIENT_EMAIL;
  const clientPassword = process.env.CLIENT_PASSWORD;

  if (!adminEmail || !adminPassword || adminPassword.length < 12 ||
      !clientEmail || !clientPassword || clientPassword.length < 12) {
    throw new Error('Define ADMIN_EMAIL, ADMIN_PASSWORD, CLIENT_EMAIL e CLIENT_PASSWORD; passwords com pelo menos 12 caracteres.');
  }

  const admin = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Administrador',
    email: adminEmail,
    password: await bcrypt.hash(adminPassword, 12),
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date(),
  };
  mockDatabase.users.push(admin);

  const clientUser = {
    _id: '507f1f77bcf86cd799439012',
    name: 'Cliente de demonstração',
    email: clientEmail,
    password: await bcrypt.hash(clientPassword, 12),
    role: 'CLIENT',
    isActive: true,
    createdAt: new Date(),
  };
  mockDatabase.users.push(clientUser);

  mockDatabase.clients.push({
    _id: '507f1f77bcf86cd799439013',
    name: 'Cliente de demonstração',
    email: clientEmail,
    isActive: true,
    userId: clientUser._id,
    createdAt: new Date(),
  });

  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(__dirname, '../../data/mock-db.json');
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify(mockDatabase, null, 2));
  console.log('Base de dados mock criada. As credenciais são lidas apenas do ambiente.');
}

void createMockDatabase().catch((error: unknown) => {
  console.error('Falha ao criar base de dados mock:', error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
