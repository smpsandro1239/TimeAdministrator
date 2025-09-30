# 🚀 Instruções para Lançar o TimeAdministrator

## ⚠️ **IMPORTANTE: Docker Desktop Necessário**

**Antes de começar, certifique-se que o Docker Desktop está instalado e em execução!**

## 📋 **Pré-requisitos**

1. ✅ **Docker Desktop** - OBRIGATÓRIO
2. ✅ **Node.js 18+** - Para desenvolvimento
3. ✅ **Git** - Para clonar o repositório

## 🚀 **Passos para Lançar**

### **1. Clonar o Repositório**
```bash
git clone https://github.com/smpsandro1239/TimeAdministrator.git
cd TimeAdministrator
git checkout feature/implementar-funcionalidades-completas
```

### **2. Iniciar Docker Desktop**
- Abrir Docker Desktop
- Aguardar até estar completamente carregado
- Verificar se está rodando (ícone verde)

### **3. Iniciar MongoDB**
```bash
# Iniciar apenas o MongoDB
docker-compose -f docker-compose.final.yml up mongodb -d

# Verificar se está rodando
docker ps
```

### **4. Terminal 1 - Backend**
```bash
cd backend
npm install --legacy-peer-deps
npm run start:dev
```

**✅ Backend deve estar rodando em:** http://localhost:3000

### **5. Terminal 2 - Frontend**
```bash
cd frontend
npm install --legacy-peer-deps
ng serve
```

**✅ Frontend deve estar rodando em:** http://localhost:4200

## 🔑 **Credenciais de Teste**

### **Administrador**
- **Email:** admin@timeadministrator.com
- **Password:** admin123

### **Cliente**
- **Email:** cliente@teste.com
- **Password:** cliente123

## 📱 **Testar Funcionalidades Móveis**

1. **Abrir DevTools** no browser (F12)
2. **Ativar modo móvel** (Ctrl+Shift+M)
3. **Selecionar dispositivo** (iPhone, Android, etc.)
4. **Testar navegação** e ações móveis

## 🧪 **Funcionalidades para Testar**

### **Como Admin:**
- ✅ Dashboard com métricas
- ✅ Gestão de clientes (CRUD)
- ✅ Menu de ações móvel
- ✅ Sistema de notificações
- ✅ Navegação móvel

### **Como Cliente:**
- ✅ Dashboard personalizado
- ✅ Perfil e subscrição
- ✅ Histórico de pagamentos
- ✅ Interface móvel otimizada

## 🔧 **Resolução de Problemas**

### **Erro: "Docker não encontrado"**
```bash
# Verificar se Docker está rodando
docker --version
docker ps
```

### **Erro: "Porta já em uso"**
```bash
# Verificar processos nas portas
netstat -ano | findstr :3000
netstat -ano | findstr :4200

# Parar processos se necessário
taskkill /PID <PID> /F
```

### **Erro: "npm install falha"**
```bash
# Limpar cache e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### **MongoDB não conecta**
```bash
# Parar e reiniciar MongoDB
docker-compose -f docker-compose.final.yml down
docker-compose -f docker-compose.final.yml up mongodb -d

# Verificar logs
docker logs timeadmin-mongodb
```

## 📊 **Verificar se Tudo Está Funcionando**

### **✅ Checklist de Verificação:**

1. **MongoDB rodando:** `docker ps` deve mostrar container mongo
2. **Backend ativo:** http://localhost:3000/api/v1 deve responder
3. **Frontend carregado:** http://localhost:4200 deve mostrar login
4. **Login funciona:** Usar credenciais de teste
5. **Dashboard carrega:** Métricas devem aparecer
6. **Navegação móvel:** Testar em modo móvel do browser

## 🎯 **Próximos Passos**

Após lançar com sucesso:

1. **Explorar funcionalidades** implementadas
2. **Testar em dispositivos móveis** reais
3. **Configurar integrações** (email, WhatsApp, Stripe)
4. **Implementar funcionalidades** sugeridas
5. **Deploy em produção** quando pronto

## 📞 **Suporte**

Se encontrar problemas:
1. Verificar se Docker Desktop está rodando
2. Consultar logs dos containers: `docker logs <container-name>`
3. Verificar se todas as portas estão livres
4. Reinstalar dependências se necessário

---

**🎉 Projeto pronto para uso e desenvolvimento!**