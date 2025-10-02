@echo off
echo ========================================
echo   TimeAdministrator - Instalação
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

echo ✅ Node.js encontrado: 
node --version

echo.
echo Verificando npm...
npm --version

echo.
echo Instalando dependências do projeto raiz...
npm install

echo.
echo Instalando dependências do backend...
cd backend
npm install --legacy-peer-deps
cd ..

echo.
echo Instalando dependências do frontend...
cd frontend
npm install --legacy-peer-deps
cd ..

echo.
echo ========================================
echo   INSTALAÇÃO CONCLUÍDA!
echo ========================================
echo.
echo Para iniciar:
echo - Docker:     scripts\start-docker.bat
echo - Local:      scripts\start-local.bat
echo.
pause