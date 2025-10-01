# ⚡ Lançamento Rápido - TimeAdministrator

## 🚀 **Método Mais Rápido (Sem Docker)**

### **1. Pré-requisitos**
- ✅ Node.js 20+ instalado
- ✅ MongoDB local ou cloud (MongoDB Atlas)

### **2. Configurar MongoDB**

#### **Opção A: MongoDB Atlas (Cloud - Recomendado)**
1. Criar conta em https://mongodb.com/atlas
2. Criar cluster gratuito
3. Obter connection string
4. Atualizar `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/timeadministrator
```

#### **Opção B: MongoDB Local**
1. Instalar MongoDB Community
2. Iniciar serviço MongoDB
3. Usar: `MONGODB_URI=mongodb://localhost:27017/timeadministrator`

### **3. Lançar Backend**
```bash
cd backend
npm install --legacy-peer-deps
npm run start:dev
```
✅ **Backend rodando em:** http://localhost:3000

### **4. Lançar Frontend**
```bash
cd frontend
npm install --legacy-peer-deps
ng serve
```
✅ **Frontend rodando em:** http://localhost:4200

### **5. Credenciais de Teste**
- **Admin:** admin@timeadministrator.com / admin123
- **Cliente:** cliente@teste.com / cliente123

---

## 🐳 **Método com Docker (Se Preferir)**

### **1. Iniciar Docker Desktop**
- Abrir Docker Desktop
- Aguardar carregar completamente

### **2. Executar Comando**
```bash
docker-compose up --build
```

### **3. Aguardar Build**
- Backend: ~2-3 minutos
- Frontend: ~3-5 minutos
- MongoDB: ~30 segundos

---

## 🔧 **Resolução Rápida de Problemas**

### **Erro: "npm install falha"**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### **Erro: "MongoDB não conecta"**
1. Verificar se MongoDB está rodando
2. Verificar connection string no `.env`
3. Verificar firewall/rede

### **Erro: "Porta já em uso"**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## 📱 **Testar Funcionalidades Móveis**

1. **Abrir DevTools** (F12)
2. **Modo Móvel** (Ctrl+Shift+M)
3. **Selecionar Dispositivo** (iPhone, Android)
4. **Testar Navegação** bottom tab
5. **Testar Menu Ações** nos clientes

---

## ✅ **Checklist de Verificação**

- [ ] Backend responde em http://localhost:3000/api/v1
- [ ] Frontend carrega em http://localhost:4200
- [ ] Login funciona com credenciais de teste
- [ ] Dashboard carrega com métricas
- [ ] Navegação móvel aparece em modo móvel
- [ ] Menu de ações funciona nos clientes

---

## 🎯 **Próximos Passos**

1. **Explorar todas as funcionalidades**
2. **Testar em dispositivos móveis reais**
3. **Configurar integrações** (email, Stripe, WhatsApp)
4. **Implementar funcionalidades sugeridas**
5. **Deploy em produção**

---

**⚡ Tempo estimado de setup: 5-10 minutos**
**🎉 Projeto pronto para uso e desenvolvimento!**