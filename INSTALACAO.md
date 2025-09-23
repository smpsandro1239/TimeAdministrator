# TimeAdministrator - Guia de Instalação Completo

## 🚀 Instalação Rápida (Recomendada)

### Pré-requisitos
1. **Docker Desktop** instalado e em execução
2. **Node.js 18+** instalado no sistema
3. **Git** para clonar o repositório

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/smpsandro1239/TimeAdministrator.git
cd TimeAdministrator
```

2. **Execute o script de instalação**
```bash
scripts\start-final.bat
```

3. **Abra duas janelas de terminal**

**Terminal 1 - Backend:**
```bash
cd backend
npm install --legacy-peer-deps
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
ng serve
```

4. **Aceda à aplicação**
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api/v1

5. **Credenciais de teste**
- **Email**: admin@timeadministrator.com
- **Password**: admin123

## 📋 Verificação da Instalação

### ✅ MongoDB
- Deve estar rodando na porta 27017
- Verificar com: `docker ps | grep mongo`

### ✅ Backend
- Deve estar rodando na porta 3000
- Testar: http://localhost:3000/api/v1/auth/profile
- Deve retornar erro 401 (normal sem autenticação)

### ✅ Frontend
- Deve estar rodando na porta 4200
- Testar: http://localhost:4200
- Deve mostrar a página de login

## 🔧 Resolução de Problemas

### Problema: "npm não é reconhecido"
**Solução**: Instale Node.js 18+ de https://nodejs.org

### Problema: "Docker não está rodando"
**Solução**: Inicie o Docker Desktop

### Problema: "Porta já em uso"
**Solução**: 
```bash
# Verificar processos
netstat -ano | findstr :3000
netstat -ano | findstr :4200

# Parar processos se necessário
taskkill /PID <PID> /F
```

### Problema: Erros de dependências npm
**Solução**:
```bash
# Limpar cache
npm cache clean --force

# Reinstalar
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 🎯 Funcionalidades Testadas

### ✅ Autenticação
- Login/Logout funcionando
- JWT tokens
- Guards de rota

### ✅ Base de Dados
- MongoDB conectado
- Utilizador admin criado
- Esquemas definidos

### ✅ API Endpoints
- `/api/v1/auth/login` - Login
- `/api/v1/auth/register` - Registo
- `/api/v1/clients` - Gestão de clientes
- `/api/v1/subscriptions` - Subscrições
- `/api/v1/payments` - Pagamentos

### ✅ Interface
- Página de login responsiva
- Dashboard diferenciado por role
- Navegação funcional

## 📱 Teste da Aplicação

1. **Aceda a** http://localhost:4200
2. **Faça login** com admin@timeadministrator.com / admin123
3. **Explore o dashboard** administrativo
4. **Teste as funcionalidades** de gestão

## 🔄 Desenvolvimento

Para desenvolvimento contínuo:

```bash
# Backend (hot-reload)
cd backend
npm run start:dev

# Frontend (hot-reload)
cd frontend
ng serve

# MongoDB (sempre rodando)
docker-compose -f docker-compose.final.yml up mongodb -d
```

## 📦 Deploy em Produção

### Opção 1: Docker Completo
```bash
docker-compose up --build -d
```

### Opção 2: Serviços Cloud
- **Frontend**: Vercel/Netlify
- **Backend**: Railway/Render
- **Base de Dados**: MongoDB Atlas

## 🎉 Aplicação Completa!

A aplicação **TimeAdministrator** está agora **100% funcional** com:

- ✅ Backend NestJS completo
- ✅ Frontend Angular responsivo
- ✅ MongoDB configurado
- ✅ Autenticação JWT
- ✅ Sistema de roles
- ✅ Interface administrativa
- ✅ Portal do cliente
- ✅ Gestão de subscrições
- ✅ Sistema de pagamentos
- ✅ Notificações (estrutura pronta)

**Pronto para uso e desenvolvimento!** 🚀