# 📋 Guia de Instalação - TimeAdministrator

## 🎯 Visão Geral

O TimeAdministrator pode ser executado de duas formas:
- **Docker** (Recomendado para produção)
- **Local** (Recomendado para desenvolvimento)

## 🔧 Pré-requisitos

### Obrigatórios
- **Git** - Para clonar o repositório
- **Node.js 20+** - Para desenvolvimento local

### Opcionais
- **Docker Desktop** - Para execução em containers

## 🚀 Instalação Rápida

### 1. Clone o Repositório
```bash
git clone https://github.com/smpsandro1239/TimeAdministrator.git
cd TimeAdministrator
```

### 2. Escolha o Método de Execução

#### Opção A: Docker (Recomendado)
```bash
# Execute o script principal
start.bat

# Ou diretamente
scripts\start-docker.bat
```

#### Opção B: Desenvolvimento Local
```bash
# Instale dependências
scripts\install.bat

# Inicie em modo desenvolvimento
scripts\start-local.bat
```

## 📱 Acesso à Aplicação

Após a instalação, aceda a:
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api/v1
- **MongoDB**: localhost:27017

### 🔑 Credenciais Padrão
- **Email**: admin@timeadministrator.com
- **Password**: admin123

## ⚙️ Configuração Avançada

### Variáveis de Ambiente

Copie `backend/.env.example` para `backend/.env` e configure:

```env
# Base de Dados
MONGODB_URI=mongodb://admin:password123@mongodb:27017/timeadministrator?authSource=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@timeadministrator.com

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret
```

### Configuração de Email (Gmail)

1. Ative a autenticação de 2 fatores na sua conta Google
2. Vá a **Conta Google** > **Segurança** > **Palavras-passe de aplicação**
3. Gere uma palavra-passe para "Mail"
4. Use essa palavra-passe no `SMTP_PASS`

### Configuração do Stripe

1. Crie conta em https://stripe.com
2. No Dashboard, vá a **Developers** > **API keys**
3. Copie as chaves para o `.env`
4. Configure webhook: `http://your-domain.com/api/v1/payments/stripe/webhook`

### Configuração do Twilio

1. Crie conta em https://twilio.com
2. Configure WhatsApp Business API
3. Obtenha credenciais no Console

## 🐳 Docker - Comandos Úteis

```bash
# Ver status dos containers
docker ps

# Ver logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Conectar ao container
docker exec -it timeadmin-backend /bin/sh
docker exec -it timeadmin-mongodb mongosh

# Rebuild completo
docker-compose down && docker-compose up --build

# Reset completo (apaga dados)
scripts\reset.bat
```

## 💻 Desenvolvimento Local

### Estrutura de Desenvolvimento
```bash
# Terminal 1 - MongoDB
docker-compose -f docker-compose.dev.yml up -d

# Terminal 2 - Backend
cd backend
npm run start:dev

# Terminal 3 - Frontend
cd frontend
ng serve
```

### Hot Reload
- **Backend**: Reinicia automaticamente com mudanças
- **Frontend**: Recompila automaticamente com mudanças

## 🔧 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Menu Principal** | `start.bat` | Menu interativo |
| **Docker** | `scripts\start-docker.bat` | Inicia com Docker |
| **Local** | `scripts\start-local.bat` | Inicia desenvolvimento local |
| **Instalar** | `scripts\install.bat` | Instala dependências |
| **Parar** | `scripts\stop.bat` | Para todos os serviços |
| **Reset** | `scripts\reset.bat` | Reset completo |
| **Logs** | `scripts\logs.bat` | Visualizar logs |

## 🚨 Resolução de Problemas

### Erro: "Docker não encontrado"
```bash
# Instale Docker Desktop
# https://www.docker.com/products/docker-desktop
```

### Erro: "Node.js não encontrado"
```bash
# Instale Node.js 20+
# https://nodejs.org
```

### Erro: "Porta já em uso"
```bash
# Pare processos existentes
scripts\stop.bat

# Ou mate processos manualmente
taskkill /f /im node.exe
```

### Erro: "MongoDB connection failed"
```bash
# Verifique se MongoDB está rodando
docker ps

# Reinicie MongoDB
docker-compose -f docker-compose.dev.yml restart mongodb
```

### Erro: "npm install failed"
```bash
# Limpe cache e reinstale
npm cache clean --force
scripts\install.bat
```

## 📊 Verificação da Instalação

### Checklist Pós-Instalação
- [ ] Frontend carrega em http://localhost:4200
- [ ] Backend responde em http://localhost:3000/api/v1
- [ ] Login funciona com credenciais padrão
- [ ] Dashboard mostra dados
- [ ] MongoDB conecta corretamente

### Testes Rápidos
```bash
# Teste backend
curl http://localhost:3000/api/v1/auth/profile

# Teste frontend
# Abra http://localhost:4200 no browser
```

## 🔄 Atualizações

### Atualizar Código
```bash
git pull origin main
scripts\stop.bat
scripts\install.bat
scripts\start-docker.bat  # ou start-local.bat
```

### Atualizar Dependências
```bash
cd backend && npm update
cd ../frontend && npm update
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique este guia de instalação
2. Consulte os logs: `scripts\logs.bat`
3. Abra issue no GitHub
4. Email: suporte@timeadministrator.com

---

**TimeAdministrator** - Instalação simplificada! 🚀