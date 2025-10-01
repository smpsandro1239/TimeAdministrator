# 🍃 Configuração MongoDB - TimeAdministrator

## 🚀 **Opção 1: MongoDB Atlas (Cloud - RECOMENDADO)**

### **Passos Rápidos:**

1. **Ir para:** https://mongodb.com/atlas
2. **Criar conta gratuita**
3. **Criar cluster gratuito** (M0 Sandbox)
4. **Configurar acesso:**
   - Username: `timeadmin`
   - Password: `timeadmin123`
   - IP Access: `0.0.0.0/0` (permitir todos)

5. **Obter Connection String:**
   - Clicar em "Connect"
   - Escolher "Connect your application"
   - Copiar a string de conexão

6. **Atualizar backend/.env:**
```env
MONGODB_URI=mongodb+srv://timeadmin:timeadmin123@cluster0.xxxxx.mongodb.net/timeadministrator?retryWrites=true&w=majority
```

### **Vantagens:**
- ✅ Sem necessidade de Docker
- ✅ Sempre disponível
- ✅ Backup automático
- ✅ Grátis até 512MB

---

## 🐳 **Opção 2: MongoDB Local (Docker)**

### **Pré-requisitos:**
- Docker Desktop instalado e rodando

### **Comandos:**
```bash
# Iniciar MongoDB
docker-compose -f docker-compose.dev-local.yml up -d

# Verificar se está rodando
docker ps

# Configurar backend/.env
MONGODB_URI=mongodb://localhost:27017/timeadministrator
```

---

## 🔧 **Opção 3: MongoDB Local (Instalação)**

### **Windows:**
1. Baixar MongoDB Community Server
2. Instalar com configurações padrão
3. Iniciar serviço MongoDB
4. Usar: `MONGODB_URI=mongodb://localhost:27017/timeadministrator`

---

## ✅ **Testar Conexão**

Após configurar, reiniciar o backend:
```bash
cd backend
npm run start:dev
```

**Deve aparecer:**
```
[Nest] LOG [InstanceLoader] MongooseModule dependencies initialized
```

**Se aparecer erro de conexão, verificar:**
1. Connection string está correta
2. Username/password estão corretos
3. IP está liberado (Atlas)
4. MongoDB está rodando (local)

---

## 🎯 **Recomendação**

**Para desenvolvimento:** Use MongoDB Atlas (Opção 1)
**Para produção:** Configure MongoDB dedicado

---

**⚡ Com MongoDB Atlas, o setup leva apenas 2-3 minutos!**