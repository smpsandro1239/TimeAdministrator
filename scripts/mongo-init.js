// Inicialização estrutural da base de dados.
// As credenciais e os utilizadores da aplicação são geridos pela configuração
// segura do ambiente e pelo processo de provisionamento, nunca por valores fixos.
db = db.getSiblingDB('timeadministrator');

db.users.createIndex({ email: 1 }, { unique: true });
db.clients.createIndex({ email: 1 }, { unique: true });
db.clients.createIndex({ subscriptionEndDate: 1 });
db.subscriptions.createIndex({ clientId: 1 });
db.subscriptions.createIndex({ endDate: 1 });
db.payments.createIndex({ clientId: 1 });
db.payments.createIndex({ status: 1 });

print('Índices da base de dados verificados.');
