import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export const startMemoryDB = async (): Promise<string> => {
  mongod = await MongoMemoryServer.create({
    instance: {
      dbName: 'timeadministrator'
    }
  });
  
  const uri = mongod.getUri();
  console.log('🗄️  MongoDB em memória iniciado:', uri);
  return uri;
};

export const stopMemoryDB = async (): Promise<void> => {
  if (mongod) {
    await mongod.stop();
    console.log('🗄️  MongoDB em memória parado');
  }
};