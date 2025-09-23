# TimeAdministrator - Guia de Resolução de Problemas

## Problemas Comuns e Soluções

### 1. Erro no Build do Docker

**Problema**: Falha ao construir containers com erros de dependências npm.

**Solução**:
```bash
# Parar todos os containers
docker-compose down --remove-orphans

# Limpar cache do Docker
docker system prune -f

# Tentar apenas o MongoDB primeiro
scripts\test-simple.bat
```

### 2. Dependências npm não encontradas

**Problema**: Pacotes como `karma-chrome-headless` não existem.

**Solução**: As dependências foram corrigidas nos arquivos package.json. Se ainda houver problemas:

```bash
# No diretório backend
cd backend
npm install

# No diretório frontend  
cd frontend
npm install --legacy-peer-deps
```

### 3. MongoDB não conecta

**Problema**: Backend não consegue conectar ao MongoDB.

**Solução**:
```bash
# Verificar se MongoDB está rodando
docker ps | grep mongo

# Ver logs do MongoDB
docker logs timeadmin-mongodb

# Testar conexão manual
docker exec -it timeadmin-mongodb mongosh -u admin -p password123
```

### 4. Portas já em uso

**Problema**: Erro "port already in use".

**Solução**:
```bash
# Verificar processos usando as portas
netstat -ano | findstr :3000
netstat -ano | findstr :4200
netstat -ano | findstr :27017

# Parar processos se necessário
taskkill /PID <PID_NUMBER> /F
```

### 5. Desenvolvimento Local (sem Docker)

Se o Docker não funcionar, pode executar localmente:

#### Backend:
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend:
```bash
cd frontend
npm install --legacy-peer-deps
ng serve
```

#### MongoDB:
- Instalar MongoDB Community Edition
- Ou usar MongoDB Atlas (cloud)

### 6. Variáveis de Ambiente

Certifique-se de que o arquivo `backend/.env` existe e está configurado:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://admin:password123@localhost:27017/timeadministrator?authSource=admin
JWT_SECRET=dev-jwt-secret-key
```

### 7. Logs e Debug

Para ver logs detalhados:

```bash
# Logs de todos os serviços
docker-compose logs -f

# Logs de um serviço específico
docker-compose logs -f backend

# Conectar ao container para debug
docker exec -it timeadmin-backend /bin/sh
```

### 8. Reset Completo

Se nada funcionar, reset completo:

```bash
# Parar tudo
docker-compose down -v --remove-orphans

# Remover imagens
docker rmi $(docker images -q timeadministrator*)

# Limpar sistema
docker system prune -a -f

# Reconstruir
docker-compose up --build
```

### 9. Alternativas de Deploy

#### Opção 1: Vercel + MongoDB Atlas
- Frontend no Vercel
- Backend no Railway/Render
- MongoDB Atlas (gratuito)

#### Opção 2: Heroku
- Backend no Heroku
- Frontend no Netlify
- MongoDB Atlas

#### Opção 3: VPS
- DigitalOcean/Linode
- Docker Compose em produção
- Nginx como proxy reverso

### 10. Contacto para Suporte

Se os problemas persistirem:
- Criar issue no GitHub
- Incluir logs completos
- Especificar sistema operativo
- Versão do Docker

## Scripts Úteis

- `scripts\start.bat` - Iniciar aplicação completa
- `scripts\test-simple.bat` - Testar apenas MongoDB
- `scripts\logs.bat` - Ver logs
- `scripts\reset-database.bat` - Reset da base de dados