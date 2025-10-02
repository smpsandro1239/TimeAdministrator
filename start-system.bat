@echo off
title TimeAdministrator - Sistema Completo
color 0A

echo ========================================
echo      TimeAdministrator v2.0
echo   Sistema de Gestao de Subscricoes
echo ========================================
echo.

REM Verificar se Docker esta rodando
echo [1/5] Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker nao encontrado! Instale Docker Desktop.
    pause
    exit /b 1
)
echo ✅ Docker encontrado

REM Parar processos nas portas necessarias
echo.
echo [2/5] Liberando portas...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4200') do taskkill /PID %%a /F >nul 2>&1
echo ✅ Portas liberadas

REM Parar containers existentes
echo.
echo [3/5] Parando containers existentes...
docker-compose down >nul 2>&1
echo ✅ Containers parados

REM Iniciar sistema completo
echo.
echo [4/5] Iniciando sistema...
docker-compose up --build -d
if errorlevel 1 (
    echo ❌ Erro ao iniciar sistema!
    pause
    exit /b 1
)

REM Aguardar inicializacao
echo.
echo [5/5] Aguardando inicializacao...
timeout /t 15 /nobreak >nul

REM Verificar status
echo.
echo ========================================
echo   SISTEMA INICIADO COM SUCESSO!
echo ========================================
echo.
echo 📱 Frontend: http://localhost:4200
echo 🔧 Backend:  http://localhost:3000/api/v1
echo 🗄️  MongoDB:  localhost:27017
echo.
echo 🔑 Credenciais de login:
echo    Email: admin@timeadministrator.com
echo    Password: admin123
echo.

REM Abrir browser automaticamente
start http://localhost:4200

echo Pressione qualquer tecla para ver logs...
pause >nul
docker-compose logs -f