# TimeAdministrator - Sistema Completo de Gestão de Subscrições

## 📋 Descrição
Sistema profissional de gestão de subscrições de clientes com interface moderna e responsiva, desenvolvido com Angular 18+, NestJS, MongoDB e Docker. Solução completa para empresas que necessitam de gerir clientes, subscrições, pagamentos e notificações automáticas.

## 🎯 Funcionalidades Principais

### 👨‍💼 Painel Administrativo
- 👥 **Gestão Completa de Clientes**: CRUD avançado com preferências de notificação individuais
- 📊 **Dashboard Executivo**: Métricas em tempo real, KPIs e análises avançadas
- 💳 **Gestão de Subscrições**: Controlo total sobre períodos, renovações e estados
- 💰 **Sistema de Pagamentos**: Stripe, MBWay e aprovação manual de pagamentos
- 📧 **Notificações Multi-Canal**: Email, WhatsApp e Telegram com templates personalizáveis
- ⚙️ **Gestão de Utilizadores**: Controlo de acessos, permissões e atividade
- 📈 **Relatórios Avançados**: Analytics detalhados, exportação e relatórios mensais automáticos
- 🔧 **Configurações do Sistema**: Integração com APIs externas e configurações avançadas

### 👤 Área do Cliente
- 🏠 **Dashboard Pessoal**: Visão geral da conta e subscrição ativa
- 👤 **Perfil Completo**: Gestão de dados pessoais e preferências
- 📋 **Estado da Subscrição**: Informações detalhadas e histórico completo
- 💳 **Histórico de Pagamentos**: Visualização de todas as transações
- 🛒 **Novas Subscrições**: Interface intuitiva para aquisição de planos
- 💰 **Pagamentos Seguros**: Integração com Stripe e MBWay

### 🔧 Funcionalidades Técnicas Avançadas
- 🔐 **Autenticação JWT**: Sistema seguro com refresh tokens
- 📱 **100% Responsivo**: Interface otimizada para mobile-first
- 🔔 **Notificações Inteligentes**: Sistema de cron jobs com templates dinâmicos
- 🐳 **Containerização Completa**: Deploy simplificado com Docker
- 🔄 **Hot Reload**: Desenvolvimento ágil com recarga automática
- 🌐 **Multi-Canal**: Suporte para Email, WhatsApp e Telegram
- 📊 **Analytics Avançados**: Métricas de negócio e relatórios automáticos

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

### Integrações Externas
- **Stripe** para pagamentos online seguros
- **MBWay** para pagamentos móveis via SMS
- **Nodemailer** para envio de emails profissionais
- **Twilio** para WhatsApp Business API
- **Telegram Bot API** para notificações instantâneas
- **Docker** para containerização e deploy
- **MongoDB Atlas** para base de dados na cloud

## 📁 Estrutura do Projeto
```
TimeAdministrator/
├── frontend/                    # Aplicação Angular 18+
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/       # Módulos por funcionalidade
│   │   │   ├── shared/         # Componentes partilhados
│   │   │   ├── services/       # Serviços da aplicação
│   │   │   ├── models/         # Interfaces e modelos
│   │   │   └── guards/         # Guards de rota
│   │   └── environments/       # Configurações de ambiente
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                     # API NestJS
│   ├── src/
│   │   ├── auth/              # Autenticação JWT
│   │   ├── users/             # Gestão de utilizadores
│   │   ├── clients/           # Gestão de clientes
│   │   ├── subscriptions/     # Gestão de subscrições
│   │   ├── payments/          # Sistema de pagamentos
│   │   ├── notifications/     # Notificações multi-canal
│   │   ├── reports/           # Relatórios e analytics
│   │   ├── dashboard/         # Métricas e KPIs
│   │   └── common/            # Utilitários partilhados
│   ├── Dockerfile
│   └── .env.example
├── screenshots/                # Capturas de ecrã
│   ├── dashboard/
│   ├── clients/
│   ├── payments/
│   ├── notifications/
│   ├── mobile/
│   └── README.md
├── scripts/                    # Scripts de automação
│   ├── start-docker.bat       # Iniciar com Docker
│   ├── start-local.bat        # Desenvolvimento local
│   ├── install.bat            # Instalar dependências
│   ├── stop.bat               # Parar serviços
│   ├── reset.bat              # Reset completo
│   └── logs.bat               # Ver logs
├── start.bat                   # Menu principal
├── docker-compose.yml          # Produção
├── docker-compose.dev.yml      # Desenvolvimento
├── INSTALACAO.md               # Guia de instalação
└── README.md                   # Documentação principal
```

## ⚡ Instalação e Configuração

### Pré-requisitos
- **Docker Desktop** (recomendado para produção)
- **Node.js 20+** (obrigatório para desenvolvimento)
- **Git** para clonar o repositório

### 🚀 Início Rápido

#### Opção 1: Docker (Recomendado)
```bash
# Clone o repositório
git clone https://github.com/smpsandro1239/TimeAdministrator.git
cd TimeAdministrator

# Inicie com Docker
scripts\start-docker.bat
```

#### Opção 2: Desenvolvimento Local
```bash
# Clone o repositório
git clone https://github.com/smpsandro1239/TimeAdministrator.git
cd TimeAdministrator

# Instale dependências e inicie
scripts\start-local.bat
```

### 📱 Acesso à Aplicação
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api/v1
- **MongoDB**: localhost:27017

### 🔑 Credenciais Padrão
- **Email**: admin@timeadministrator.com
- **Password**: admin123

### 🔧 Desenvolvimento

#### 🚀 Modo Produção (Docker)
Para usar o sistema completo em produção:
```bash
# Iniciar sistema completo
start-system.bat

# Parar sistema
stop-system.bat

# Reset completo
reset-system.bat
```

#### 💻 Modo Desenvolvimento (Hot-Reload)
Para desenvolvimento ativo com recarga automática:

**Opção 1: Script Automático (Recomendado)**
1. **Terminal 1** - Backend:
   ```bash
   cd backend
   npm run start:mock
   ```

2. **Terminal 2** - Frontend:
   ```bash
   start-dev.bat
   ```

**Opção 2: Manual**
1. **Parar Docker** (se estiver rodando):
   ```bash
   docker-compose down
   ```

2. **Iniciar Backend em modo mock**:
   ```bash
   cd backend
   npm run start:mock
   ```

3. **Iniciar Frontend** (nova janela de terminal):
   ```bash
   cd frontend
   ng serve --port 4200
   ```

4. **Aceder**: http://localhost:4200

#### 🔥 Vantagens do Modo Desenvolvimento:
- ✅ **Hot-reload**: Mudanças aparecem automaticamente
- ✅ **Desenvolvimento rápido**: Sem rebuild do Docker
- ✅ **Debug fácil**: Logs diretos no terminal
- ✅ **Edição em tempo real**: Ideal para desenvolvimento ativo

#### 🐳 Quando usar Docker:
- ✅ **Demonstrações**: Sistema completo funcionando
- ✅ **Testes**: Ambiente idêntico à produção
- ✅ **Deploy**: Pronto para produção

### 📋 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `start-docker.bat` | Inicia aplicação com Docker (produção) |
| `start-local.bat` | Inicia desenvolvimento local |
| `stop.bat` | Para todos os serviços |
| `logs.bat` | Mostra logs em tempo real |
| `reset.bat` | Reset completo (base de dados + containers) |
| `install.bat` | Instala todas as dependências |

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

## 📸 Capturas de Ecrã da Aplicação

### 🏠 Dashboard Administrativo
*Painel principal com métricas em tempo real, KPIs e visão geral do negócio*

![Dashboard Administrador](screenshots/dashboard/Dashboard%20Administrador.png)

---

### 👥 Gestão de Clientes
*Interface completa para gestão de clientes com preferências de notificação individuais*

![Gestão de Clientes](screenshots/clients/Gestão%20de%20Clientes.png)

#### 👥 Gestão de Utilizadores
*Sistema avançado de gestão de utilizadores com controlo de permissões*

![Gestão de Utilizadores](screenshots/clients/Gestão%20de%20Utilizadores.png)

---

### 💳 Gestão de Subscrições
*Controlo completo sobre subscrições, renovações e estados de pagamento*

![Gestão de Subscrições](screenshots/subscriptions/Gestão%20de%20Subscrições.png)

---

### 💰 Sistema de Pagamentos
*Gestão avançada de pagamentos com múltiplos métodos (Stripe, MBWay, Transferência)*

![Gestão de Pagamentos](screenshots/payments/Gestão%20de%20Pagamentos.png)

---

### 📧 Sistema de Notificações
*Gestão completa de notificações multi-canal (Email, WhatsApp, Telegram)*

![Sistema de Notificações](screenshots/notifications/Sistema%20de%20Notificações.png)

---

### 📈 Relatórios e Análises
*Relatórios avançados com métricas de negócio, KPIs e analytics detalhados*

![Relatórios e Análises Avançadas](screenshots/reports/Relatórios%20e%20Análises%20Avançadas.png)

---

### ⚙️ Configurações do Sistema
*Painel completo de configurações, integrações e parâmetros do sistema*

![Configurações do Sistema](screenshots/settings/Configurações%20do%20Sistema.png)

---

### 📱 Interface Móvel Responsiva
*Design 100% responsivo otimizado para dispositivos móveis com navegação touch-friendly*

![Dashboard Móvel](screenshots/mobile/Dashboard%20Administrador-TLM.png)

---

## 📊 Funcionalidades Detalhadas

### 📧 Sistema de Notificações Avançado

#### 🔄 Notificações Automáticas
- **Cron Job Diário**: Execução automática às 9:00
- **15 Dias Antes**: Aviso antecipado de expiração
- **7 Dias Antes**: Lembrete de renovação
- **No Dia**: Lembrete final de expiração
- **Após Expiração**: Notificação de desativação
- **Relatórios Mensais**: Envio automático de relatórios

#### 📱 Canais de Comunicação
- **Email**: Templates HTML personalizados
- **WhatsApp**: Mensagens via Twilio API
- **Telegram**: Bot integrado com notificações instantâneas
- **Preferências Individuais**: Cada cliente escolhe os canais preferenciais
- **Teste de Ligação**: Verificação automática de conectividade

### 💰 Sistema de Pagamentos Completo

#### 💳 Métodos de Pagamento
- **Stripe**: Pagamentos online automáticos com cartão
- **MBWay**: Pagamentos móveis via SMS
- **Transferência Bancária**: Upload de comprovativo manual
- **Multibanco**: Referência automática

#### 🔄 Estados de Pagamento
- **Pendente**: Aguarda processamento
- **Processando**: Em validação
- **Completo**: Pagamento confirmado
- **Falhado**: Erro no processamento
- **Cancelado**: Cancelado pelo utilizador

#### ⚙️ Aprovação Administrativa
- **Aprovação Manual**: Validação por administrador
- **Aprovação Automática**: Via webhooks do Stripe
- **Histórico Completo**: Registo de todas as ações

### 📈 Planos de Subscrição

| Período | Preço | Desconto | Valor Mensal |
|----------|------|----------|-------------|
| **1 Mês** | €29.99 | - | €29.99 |
| **3 Meses** | €79.99 | 11% | €26.66 |
| **6 Meses** | €149.99 | 17% | €25.00 |
| **1 Ano** | €279.99 | 22% | €23.33 |

### 📊 Métricas e KPIs

#### 📈 Métricas de Negócio
- **MRR (Monthly Recurring Revenue)**: Receita mensal recorrente
- **ARR (Annual Recurring Revenue)**: Receita anual recorrente
- **Taxa de Churn**: Percentagem de cancelamentos
- **LTV (Lifetime Value)**: Valor de vida do cliente
- **CAC (Customer Acquisition Cost)**: Custo de aquisição

#### 📊 Analytics Avançados
- **Análise de Coorte**: Comportamento por período
- **Comparação de Períodos**: Mês vs mês, ano vs ano
- **Previsões**: Projeções baseadas em dados históricos
- **Segmentação**: Análise por tipo de cliente e plano

## 🔒 Segurança e Conformidade

### 🔐 Autenticação e Autorização
- **JWT com Refresh Tokens**: Sistema seguro com renovação automática
- **Roles e Permissões**: Controlo granular de acessos
- **Sessões Seguras**: Gestão avançada de sessões
- **2FA (Opcional)**: Autenticação de dois fatores

### 🔒 Proteção de Dados
- **HTTPS Forçado**: Encriptação em todas as comunicações
- **Rate Limiting**: Proteção contra ataques DDoS
- **Validação Rigorosa**: Sanitização de todos os inputs
- **CORS Configurado**: Políticas de origem cruzada
- **Helmet.js**: Headers de segurança avançados
- **Audit Logs**: Registo de todas as ações críticas

### 📜 Conformidade RGPD
- **Consentimento**: Gestão de consentimentos
- **Direito ao Esquecimento**: Eliminação completa de dados
- **Portabilidade**: Exportação de dados pessoais
- **Minimização**: Recolha apenas de dados necessários

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

## 📱 Responsividade Mobile

### 🎯 Design Mobile-First
- **Interface 100% Responsiva**: Otimizada para todos os dispositivos
- **Touch-Friendly**: Botões e elementos adequados para touch
- **Performance Mobile**: Carregamento rápido em redes móveis
- **Navegação Intuitiva**: Menu adaptativo para mobile

### 📐 Breakpoints Implementados
- **Desktop**: > 1024px - Layout completo com sidebar
- **Tablet**: 768px - 1024px - Layout adaptado
- **Mobile**: < 768px - Layout mobile com navegação inferior
- **Mobile Small**: < 480px - Layout otimizado para ecrãs pequenos

### ✨ Funcionalidades Mobile
- **Diálogos Responsivos**: Adaptam-se automaticamente ao tamanho do ecrã
- **Tabelas Scrolláveis**: Navegação horizontal em tabelas grandes
- **Formulários Otimizados**: Campos e botões adequados para mobile
- **Notificações Mobile**: Push notifications nativas (futuro)

## 🔄 Atualizações Recentes

### ✅ Versão 2.0 - Funcionalidades Implementadas

#### 🆕 Novas Funcionalidades
- ✅ **Sistema de Notificações Multi-Canal** (Email, WhatsApp, Telegram)
- ✅ **Pagamentos MBWay** com SMS automático
- ✅ **Preferências de Notificação por Cliente**
- ✅ **Dashboard Avançado** com KPIs em tempo real
- ✅ **Relatórios Mensais Automáticos**
- ✅ **Interface Completamente Responsiva**
- ✅ **Diálogos Redesenhados** com UX/UI moderna
- ✅ **Sistema de Configurações Avançadas**

#### 🔧 Melhorias Técnicas
- ✅ **Responsividade Mobile Completa**
- ✅ **Correção de Barras de Rolagem Duplas**
- ✅ **Otimização de Performance**
- ✅ **Padronização Visual Completa**
- ✅ **Navegação Mobile Otimizada**
- ✅ **Formulários Touch-Friendly**

#### 📊 Analytics e Métricas
- ✅ **KPIs de Negócio** (MRR, ARR, Churn, LTV)
- ✅ **Análise de Coorte**
- ✅ **Comparação de Períodos**
- ✅ **Previsões Automáticas**
- ✅ **Exportação de Relatórios**

### 🔮 Próximas Funcionalidades (Roadmap)
- 🔄 **API REST Completa** para integrações externas
- 🔄 **App Mobile Nativa** (React Native)
- 🔄 **Integração com CRM** (Salesforce, HubSpot)
- 🔄 **Pagamentos Automáticos Recorrentes**
- 🔄 **Sistema de Cupões e Descontos**
- 🔄 **Multi-tenancy** para múltiplas empresas
- 🔄 **Integração com Contabilidade**
- 🔄 **Chatbot de Suporte**

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