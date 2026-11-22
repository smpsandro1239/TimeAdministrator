@echo off
echo ========================================
echo   TimeAdministrator - Local Setup
echo ========================================
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo Instale Node.js 20+ em: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.

echo Instalando dependências...
call npm run install:all

echo.
echo Iniciando MongoDB (Docker)...
docker-compose -f docker-compose.dev.yml up -d

echo.
echo Aguardando MongoDB...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   INICIANDO APLICACAO
echo ========================================
echo.

echo 🚀 Iniciando Backend...
start "TimeAdmin Backend" cmd /k "cd backend && npm run start:dev"

timeout /t 3 /nobreak >nul

echo 🚀 Iniciando Frontend...
start "TimeAdmin Frontend" cmd /k "cd frontend && ng serve"

echo.
echo ========================================
echo   APLICACAO INICIADA!
echo ========================================
echo.
echo 📱 Frontend: http://localhost:4200
echo 🔧 Backend:  http://localhost:3000/api/v1
echo 🗄️  MongoDB:  localhost:27017
echo.
pause