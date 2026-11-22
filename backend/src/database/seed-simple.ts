import 'dotenv/config';
import { connect, connection } from 'mongoose';
import * as bcrypt from 'bcryptjs';

async function createDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const clientEmail = process.env.CLIENT_EMAIL;
  const clientPassword = process.env.CLIENT_PASSWORD;

  if (!uri || !adminEmail || !adminPassword || adminPassword.length < 12 ||
      !clientEmail || !clientPassword || clientPassword.length < 12) {
    throw new Error('Define MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, CLIENT_EMAIL e CLIENT_PASSWORD; passwords com pelo menos 12 caracteres.');
  }

  try {
    await connect(uri);
    const db = connection.db;
    if (!db) throw new Error('Ligação MongoDB sem base de dados selecionada.');

    const adminExists = await db.collection('users').findOne({ email: adminEmail });
    if (!adminExists) {
      await db.collection('users').insertOne({
        name: 'Administrador',
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 12),
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date(),
      });
    }

    let clientUser = await db.collection('users').findOne({ email: clientEmail });
    if (!clientUser) {
      const inserted = await db.collection('users').insertOne({
        name: 'Cliente de demonstração',
        email: clientEmail,
        password: await bcrypt.hash(clientPassword, 12),
        role: 'CLIENT',
        isActive: true,
        createdAt: new Date(),
      });
      clientUser = await db.collection('users').findOne({ _id: inserted.insertedId });
    }

    const profileExists = await db.collection('clients').findOne({ email: clientEmail });
    if (!profileExists && clientUser) {
      await db.collection('clients').insertOne({
        name: 'Cliente de demonstração',
        email: clientEmail,
        isActive: true,
        userId: clientUser._id.toString(),
        createdAt: new Date(),
      });
    }

    console.log('Seed concluído sem apagar nem substituir contas existentes.');
  } catch (error: unknown) {
    console.error('Falha no seed:', error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    await connection.close();
  }
}

void createDatabase();
