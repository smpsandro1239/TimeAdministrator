// Script de inicialização do MongoDB
db = db.getSiblingDB('timeadministrator');

// Criar utilizador da aplicação
db.createUser({
  user: 'timeadmin',
  pwd: 'timeadmin123',
  roles: [
    {
      role: 'readWrite',
      db: 'timeadministrator'
    }
  ]
});

// Criar índices para melhor performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.clients.createIndex({ "email": 1 }, { unique: true });
db.clients.createIndex({ "subscriptionEndDate": 1 });
db.subscriptions.createIndex({ "clientId": 1 });
db.subscriptions.createIndex({ "endDate": 1 });
db.payments.createIndex({ "clientId": 1 });
db.payments.createIndex({ "status": 1 });

// Criar utilizador administrador padrão
db.users.insertOne({
  name: "Administrador",
  email: "admin@timeadministrator.com",
  password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS", // password: admin123
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('Base de dados inicializada com sucesso!');
print('Utilizador admin criado: admin@timeadministrator.com / admin123');