@echo off
echo ========================================
echo   TimeAdministrator - INICIAR AGORA
echo ========================================
echo.

echo ✅ Frontend: Compilando sem erros
echo ⚠️  Backend: Precisa de base de dados
echo.

echo OPCOES DE BASE DE DADOS:
echo 1. MongoDB Atlas (Cloud - Recomendado)
echo 2. Instalar MongoDB Local
echo 3. Continuar sem base de dados (só frontend)
echo.

set /p choice="Escolha (1-3): "

if "%choice%"=="1" (
    echo.
    echo 📋 MONGODB ATLAS - PASSOS:
    echo 1. Ir a https://mongodb.com/atlas
    echo 2. Criar conta gratuita
    echo 3. Criar cluster gratuito
    echo 4. Obter connection string
    echo 5. Editar backend/.env e substituir MONGODB_URI
    echo.
    echo Exemplo:
    echo MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/timeadministrator
    echo.
    pause
)

if "%choice%"=="2" (
    echo.
    echo 📋 MONGODB LOCAL - PASSOS:
    echo 1. Baixar MongoDB Community: https://www.mongodb.com/try/download/community
    echo 2. Instalar e iniciar serviço
    echo 3. Backend/.env já está configurado para localhost
    echo.
    pause
)

echo.
echo ========================================
echo   INICIANDO APLICACAO
echo ========================================

echo.
echo 🚀 Iniciando Frontend (http://localhost:4200)...
start cmd /k "cd frontend && ng serve"

timeout /t 3 /nobreak >nul

echo.
echo 🚀 Iniciando Backend (http://localhost:3000)...
start cmd /k "cd backend && npm run start:dev"

echo.
echo ========================================
echo   APLICACAO INICIADA!
echo ========================================
echo.
echo 📱 Frontend: http://localhost:4200
echo 🔧 Backend:  http://localhost:3000/api/v1
echo.
echo 👤 Login padrão:
echo    Email: admin@timeadministrator.com
echo    Password: admin123
echo.
echo ⚠️  Se backend não conectar à base de dados,
echo    configure MongoDB conforme opção escolhida.
echo.
pause