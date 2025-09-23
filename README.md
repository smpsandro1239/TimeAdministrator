# TimeAdministrator - Sistema de Gestão de Subscrições de Clientes

## Descrição
Sistema completo de gestão de tempo de clientes com subscrições, desenvolvido com Angular, NestJS, MongoDB e Docker.

## Funcionalidades
- 👥 Gestão de perfis (Administrador e Clientes)
- 💳 Sistema de subscrições (1, 3, 6 meses e 1 ano)
- 📧 Notificações automáticas por email e WhatsApp
- 💰 Integração com Stripe para pagamentos
- 🔐 Autenticação JWT
- 📱 Interface responsiva

## Stack Tecnológico
- **Frontend**: Angular 18+ com Angular Material
- **Backend**: NestJS com TypeScript
- **Base de Dados**: MongoDB
- **Containerização**: Docker & Docker Compose
- **Notificações**: Nodemailer + Twilio
- **Pagamentos**: Stripe

## Estrutura do Projeto
```
TimeAdministrator/
├── frontend/          # Aplicação Angular
├── backend/           # API NestJS
├── docker/           # Configurações Docker
├── scripts/          # Scripts de automação
└── docs/            # Documentação
```

## Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Docker Desktop
- Git

### Configuração Rápida
Execute o script de inicialização:
```bash
./scripts/start.bat
```

### Configuração Manual
1. Clone o repositório
2. Configure as variáveis de ambiente
3. Execute `docker-compose up`

## Desenvolvimento
Para desenvolvimento com hot-reload:
```bash
./scripts/dev.bat
```

## Variáveis de Ambiente
Copie `.env.example` para `.env` e configure:
- MongoDB URI
- JWT Secret
- Stripe Keys
- Twilio Credentials
- Email Configuration

## Contribuição
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença
MIT License