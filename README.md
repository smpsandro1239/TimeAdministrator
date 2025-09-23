# TimeAdministrator - Sistema de Gestão de Subscrições de Clientes

## Descrição
Sistema completo de gestão de tempo de clientes com subscrições, desenvolvido com Angular, NestJS, MongoDB e Docker.

## 🚀 Funcionalidades

### Para Administradores
- 👥 **Gestão de Clientes**: CRUD completo de clientes com informações detalhadas
- 📊 **Dashboard Administrativo**: Visão geral de métricas e estatísticas
- 💳 **Gestão de Subscrições**: Controlo total sobre períodos e estados das subscrições
- 💰 **Aprovação de Pagamentos**: Sistema de aprovação manual e automática via Stripe
- 📧 **Sistema de Notificações**: Emails e WhatsApp automáticos para clientes
- ⚙️ **Gestão de Utilizadores**: Controlo de acessos e permissões
- 📈 **Relatórios**: Subscrições a expirar, pagamentos pendentes, etc.

### Para Clientes
- 👤 **Perfil Pessoal**: Visualização e edição de dados pessoais
- 📋 **Estado da Subscrição**: Informações detalhadas sobre a subscrição atual
- 💳 **Histórico de Pagamentos**: Visualização de todos os pagamentos realizados
- 🛒 **Nova Subscrição**: Interface para adquirir novas subscrições
- 💰 **Pagamentos Online**: Integração com Stripe para pagamentos seguros

### Funcionalidades Técnicas
- 🔐 **Autenticação JWT**: Sistema seguro de login e autorização
- 📱 **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- 🔔 **Notificações Automáticas**: Sistema de cron jobs para notificações
- 🐳 **Containerização**: Deploy fácil com Docker
- 🔄 **Hot Reload**: Desenvolvimento ágil com recarga automática

## 🛠️ Stack Tecnológico

### Frontend
- **Angular 18+** com TypeScript
- **Angular Material** para componentes UI
- **RxJS** para programação reativa
- **Nginx** para servir em produção

### Backend
- **NestJS** com TypeScript
- **MongoDB** com Mongoose ODM
- **JWT** para autenticação
- **Passport.js** para estratégias de auth
- **Node-cron** para tarefas agendadas
- **Winston** para logging

### Integrações
- **Stripe** para pagamentos online
- **Nodemailer** para envio de emails
- **Twilio** para WhatsApp
- **Docker** para containerização

## 📁 Estrutura do Projeto
```
TimeAdministrator/
├── frontend/                 # Aplicação Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/    # Módulos por funcionalidade
│   │   │   ├── shared/      # Componentes partilhados
│   │   │   ├── services/    # Serviços da aplicação
│   │   │   ├── models/      # Interfaces e modelos
│   │   │   └── guards/      # Guards de rota
│   │   └── environments/    # Configurações de ambiente
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                  # API NestJS
│   ├── src/
│   │   ├── auth/           # Módulo de autenticação
│   │   ├── users/          # Gestão de utilizadores
│   │   ├── clients/        # Gestão de clientes
│   │   ├── subscriptions/  # Gestão de subscrições
│   │   ├── payments/       # Gestão de pagamentos
│   │   ├── notifications/  # Sistema de notificações
│   │   └── common/         # Utilitários partilhados
│   ├── Dockerfile
│   └── .env.example
├── scripts/                 # Scripts de automação
│   ├── start.bat           # Iniciar aplicação
│   ├── start-dev.bat       # Iniciar em desenvolvimento
│   ├── stop.bat            # Parar aplicação
│   ├── logs.bat            # Ver logs
│   └── connect-backend.bat # Conectar ao container
├── docker-compose.yml       # Produção
├── docker-compose.dev.yml   # Desenvolvimento
└── README.md
```

## ⚡ Instalação e Configuração

### Pré-requisitos
- **Docker Desktop** (obrigatório)
- **Git** para clonar o repositório
- **Node.js 18+** (opcional, apenas se não usar Docker)

### 🚀 Início Rápido

1. **Clone o repositório**
```bash
git clone https://github.com/smpsandro1239/TimeAdministrator.git
cd TimeAdministrator
```

2. **Inicie a aplicação**
```bash
# Windows
scripts\start.bat

# Linux/Mac
chmod +x scripts/start.sh && ./scripts/start.sh
```

3. **Aceda à aplicação**
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api/v1
- **MongoDB**: localhost:27017

4. **Credenciais padrão**
- **Email**: admin@timeadministrator.com
- **Password**: admin123

### 🔧 Desenvolvimento

Para desenvolvimento com hot-reload:
```bash
# Windows
scripts\start-dev.bat

# Linux/Mac
./scripts/start-dev.sh
```

### 📋 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `start.bat` | Inicia aplicação em produção |
| `start-dev.bat` | Inicia em modo desenvolvimento |
| `stop.bat` | Para a aplicação |
| `logs.bat` | Mostra logs em tempo real |
| `connect-backend.bat` | Conecta ao container do backend |
| `reset-database.bat` | Reset completo da base de dados |

## ⚙️ Configuração

### Variáveis de Ambiente

Copie `backend/.env.example` para `backend/.env` e configure:

```env
# Base de Dados
MONGODB_URI=mongodb://admin:password123@mongodb:27017/timeadministrator?authSource=admin

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email (Gmail exemplo)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token

# Stripe
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
```

### Configuração de Email

Para Gmail:
1. Ative a autenticação de 2 fatores
2. Gere uma palavra-passe de aplicação
3. Use essa palavra-passe no `SMTP_PASS`

### Configuração do Stripe

1. Crie uma conta em https://stripe.com
2. Obtenha as chaves de API no dashboard
3. Configure o webhook endpoint: `http://your-domain.com/api/v1/payments/stripe/webhook`

### Configuração do Twilio

1. Crie uma conta em https://twilio.com
2. Configure o WhatsApp Business API
3. Obtenha as credenciais no console

## 🐳 Docker

### Comandos Úteis

```bash
# Ver containers em execução
docker ps

# Ver logs de um serviço específico
docker-compose logs -f backend

# Conectar ao container do backend
docker exec -it timeadmin-backend /bin/sh

# Rebuild completo
docker-compose down && docker-compose up --build

# Limpar volumes (reset completo)
docker-compose down -v
```

### Estrutura dos Containers

- **mongodb**: Base de dados MongoDB
- **backend**: API NestJS
- **frontend**: Aplicação Angular servida via Nginx

## 📊 Funcionalidades Detalhadas

### Sistema de Notificações

- **Automáticas**: Cron job diário às 9:00
- **15 dias antes**: Aviso de expiração
- **No dia**: Lembrete final
- **Após expiração**: Notificação de desativação
- **Canais**: Email + WhatsApp

### Gestão de Pagamentos

- **Stripe**: Pagamentos online automáticos
- **Manual**: Upload de comprovativo
- **Estados**: Pendente, Processando, Completo, Falhado
- **Aprovação**: Sistema de aprovação administrativa

### Períodos de Subscrição

- **1 Mês**: €29.99
- **3 Meses**: €79.99 (desconto de 11%)
- **6 Meses**: €149.99 (desconto de 17%)
- **1 Ano**: €279.99 (desconto de 22%)

## 🔒 Segurança

- **JWT**: Tokens seguros com expiração
- **HTTPS**: Forçado em produção
- **Rate Limiting**: Proteção contra ataques
- **Validação**: Validação rigorosa de inputs
- **CORS**: Configuração adequada
- **Helmet**: Headers de segurança

## 🚀 Deploy em Produção

### Usando Docker

1. **Configure as variáveis de ambiente**
2. **Execute o build**
```bash
docker-compose up --build -d
```

### Usando Serviços Cloud

- **Frontend**: Vercel, Netlify
- **Backend**: Heroku, DigitalOcean
- **Base de Dados**: MongoDB Atlas

## 🧪 Testes

```bash
# Backend
cd backend
npm run test
npm run test:e2e

# Frontend
cd frontend
npm run test
npm run e2e
```

## 📈 Monitorização

- **Logs**: Winston com rotação automática
- **Health Checks**: Endpoints de saúde
- **Métricas**: Integração com Prometheus (opcional)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: suporte@timeadministrator.com
- **GitHub Issues**: Para reportar bugs
- **Documentação**: Wiki do projeto

---

**TimeAdministrator** - Gestão de subscrições simplificada e eficiente! 🚀