# TimeAdministrator - Sistema Completo de Gestão de Subscrições

## 📋 Descrição

Sistema profissional de gestão de subscrições de clientes com interface moderna e responsiva, desenvolvido com Angular 18+, NestJS, MongoDB e Docker. Solução completa para empresas que necessitam de gerir clientes, subscrições, pagamentos e notificações automáticas.

## 🎯 Funcionalidades Principais

### 👨‍💼 Painel Administrativo

- 👥 **Gestão Completa de Clientes**: CRUD avançado com preferências de notificação individuais e campo de notas personalizado
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

```text
TimeAdministrator/
├── frontend/                    # Aplicação Angular 18+
├── backend/                     # API NestJS
│   └── src/database/seed.ts   # Script de seed
├── screenshots/                 # Capturas de ecrã
├── scripts/                     # Scripts de automação
├── docker-compose.yml           # Produção
├── docker-compose.dev.yml       # Desenvolvimento
├── INSTALACAO.md                # Guia de instalação
└── README.md                    # Documentação principal
```

## ⚡ Instalação e Configuração

### Pré-requisitos

- **Docker Desktop** (recomendado para produção)
- **Node.js 20+** (obrigatório para desenvolvimento)
- **Git** para clonar o repositório

### 🚀 Início Rápido com Docker (Recomendado)

```bash
git clone https://github.com/smpsandro1239/TimeAdministrator.git
cd TimeAdministrator
scripts\start-docker.bat
```

### 📱 Acesso Local

- **Frontend**: <http://localhost:4200>
- **Backend API**: <http://localhost:3000/api/v1>
- **MongoDB**: localhost:27017

### 🔐 Conta administrativa inicial

Não existem credenciais padrão no repositório. Define `ADMIN_EMAIL` e `ADMIN_PASSWORD` no ambiente local e executa o processo de provisionamento. Usa uma password única com pelo menos 12 caracteres.

## 🚀 Deploy e Seed no Heroku (Resumo Rápido)

Se já tens o backend no Heroku e queres **apenas adicionar os utilizadores de teste**, segue estes **3 passos rápidos**:

### 1. Garantir que o script `seed` está no `backend/package.json`

```json
"seed": "ts-node src/database/seed.ts"
```

### 2. Fazer deploy (se ainda não estiver atualizado)

```bash
git add .
git commit -m "Atualiza backend com seed"
git push heroku main
```

### 3. Rodar o seed no Heroku

```bash
heroku run "cd backend && node dist/database/seed.js" --app timeadmin-backend
```

### ✅ Resultado esperado

```text
Seed concluído. As contas existentes não são apagadas nem têm passwords substituídas.
```

### 📌 Nota

- Este comando **não duplica utilizadores** — é seguro para rodar após cada deploy.
- Se quiseres **automatizar**, adiciona ao `Procfile` (raiz do repo):

```procfile
release: cd backend && node dist/database/seed.js
```

## 🔧 Desenvolvimento

### 💻 Modo Desenvolvimento (Hot-Reload)

1. **Backend**:

   ```bash
   cd backend
   npm run start:mock
   ```

2. **Frontend** (nova janela):

   ```bash
   cd frontend
   ng serve --port 4200
   ```

3. **Aceder**: [http://localhost:4200](http://localhost:4200)

### 📋 Scripts Úteis

| Script | Descrição |
|--------|-----------|
| `start-docker.bat` | Inicia com Docker (produção) |
| `start-local.bat` | Desenvolvimento local |
| `stop-system.bat` | Para todos os serviços |
| `reset-system.bat` | Reset completo |

## ⚙️ Configuração

### Variáveis de Ambiente

Copie `backend/.env.example` para `backend/.env`, substitua todos os valores de exemplo e configure os segredos fora do controlo de versões:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/timeadministrator
JWT_SECRET=REPLACE_WITH_A_RANDOM_SECRET_OF_AT_LEAST_32_CHARACTERS
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🐳 Docker

```bash
docker-compose up --build -d
docker-compose logs -f backend
docker exec -it timeadmin-backend /bin/sh
```

## 📸 Galeria visual

A pasta `screenshots/` contém atualmente apenas o guia de organização e a checklist de captura (`screenshots/README.md`). As imagens finais ainda não estão versionadas; por isso, esta documentação não apresenta capturas fictícias nem ligações para ficheiros inexistentes.

### Capturas prioritárias a publicar

| Área | Captura recomendada | Estado |
|---|---|---|
| Dashboard | `screenshots/dashboard/dashboard-main.png` | Pendente |
| Clientes | `screenshots/clients/clients-list.png` | Pendente |
| Subscrições | `screenshots/subscriptions/subscriptions-list.png` | Pendente |
| Pagamentos | `screenshots/payments/payments-overview.png` | Pendente |
| Relatórios | `screenshots/reports/reports-overview.png` | Pendente |
| Mobile | `screenshots/mobile/mobile-dashboard.png` | Pendente |

As capturas devem ser feitas com dados demonstrativos, sem informação pessoal ou credenciais reais. Consultar [`screenshots/README.md`](screenshots/README.md) para resoluções, nomenclatura e checklist.

## 🧪 Testes

```bash
cd backend && npm run test
cd frontend && npm run test
```

## 📝 Licença

MIT — ver [LICENSE](LICENSE)

## 📞 Suporte

- **Email**: [suporte@timeadministrator.com](mailto:suporte@timeadministrator.com)
- **GitHub Issues**: para reportar bugs

---

**TimeAdministrator** – Gestão de subscrições simplificada e eficiente! 🚀

*Desenvolvido com ❤️ por [Sandro Pereira](https://github.com/smpsandro1239)*
