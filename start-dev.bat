@echo off
title TimeAdministrator - Desenvolvimento
color 0A

echo ========================================
echo   TimeAdministrator - Desenvolvimento
echo ========================================
echo.

echo 💡 MODO DESENVOLVIMENTO ATIVO
echo    - Hot-reload habilitado
echo    - Mudancas aparecem automaticamente
echo    - Ideal para desenvolvimento
echo.

REM Verificar se backend está rodando
echo [1/3] Verificando backend...
curl -s http://localhost:3000/api/v1/auth/login > nul 2>&1
if errorlevel 1 (
    echo ❌ Backend nao esta rodando!
    echo.
    echo Execute primeiro em outro terminal:
    echo   cd backend
    echo   npm run start:mock
    echo.
    pause
    exit /b 1
)
echo ✅ Backend rodando em http://localhost:3000

echo.
echo [2/3] Preparando frontend...
cd frontend

echo Limpando cache...
npm cache clean --force > nul 2>&1

echo Instalando dependencias...
npm install --force > nul 2>&1

echo.
echo [3/3] Iniciando frontend...
echo.
echo ========================================
echo   FRONTEND INICIADO!
echo ========================================
echo.
echo 📱 Frontend: http://localhost:4200
echo 🔧 Backend:  http://localhost:3000/api/v1
echo.
echo 💡 Mudancas no codigo aparecem automaticamente!
echo.

ng serve --port 4200 --open