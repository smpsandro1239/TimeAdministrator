@echo off
cls
echo ========================================
echo   TimeAdministrator - Setup Desenvolvimento
echo ========================================

echo.
echo IMPORTANTE: Configuracao da Base de Dados
echo ========================================
echo.
echo Escolha uma opcao:
echo 1. MongoDB Atlas (Cloud - Recomendado)
echo 2. MongoDB Local (Docker)
echo 3. Pular configuracao (ja configurado)
echo.
set /p choice="Digite sua escolha (1-3): "

if "%choice%"=="1" goto atlas
if "%choice%"=="2" goto local
if "%choice%"=="3" goto skip
goto invalid

:atlas
echo.
echo ========================================
echo   Configurando MongoDB Atlas
echo ========================================
echo.
echo 1. Abra: https://mongodb.com/atlas
echo 2. Crie uma conta gratuita
echo 3. Crie um cluster gratuito (M0)
echo 4. Configure usuario: timeadmin / senha: timeadmin123
echo 5. Libere acesso IP: 0.0.0.0/0
echo 6. Copie a connection string
echo 7. Cole no arquivo backend/.env na linha MONGODB_URI
echo.
echo Pressione qualquer tecla quando terminar...
pause >nul
goto skip

:local
echo.
echo ========================================
echo   Configurando MongoDB Local
echo ========================================
echo.
echo Verificando Docker Desktop...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Docker Desktop nao encontrado!
    echo Instale Docker Desktop e tente novamente.
    pause
    exit /b 1
)

echo Docker encontrado! Iniciando MongoDB...
docker-compose -f docker-compose.dev-local.yml up -d

echo Configurando backend/.env para MongoDB local...
powershell -Command "(Get-Content backend\.env) -replace 'MONGODB_URI=.*', 'MONGODB_URI=mongodb://localhost:27017/timeadministrator' | Set-Content backend\.env"

echo MongoDB local configurado!
goto skip

:skip
echo.
echo ========================================
echo   Instalando Dependencias
echo ========================================

echo.
echo Instalando dependencias do Backend...
cd backend
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias do backend
    pause
    exit /b 1
)

echo.
echo Instalando dependencias do Frontend...
cd ..\frontend
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias do frontend
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo   Setup Concluido!
echo ========================================
echo.
echo Para iniciar o desenvolvimento:
echo 1. Execute: start-dev-local.bat
echo 2. Ou manualmente:
echo    - Backend: cd backend && npm run start:dev
echo    - Frontend: cd frontend && ng serve
echo.
echo URLs:
echo - Frontend: http://localhost:4200
echo - Backend: http://localhost:3000
echo.
echo Credenciais de teste:
echo - Admin: admin@timeadministrator.com / admin123
echo - Cliente: cliente@teste.com / cliente123
echo.
echo Pressione qualquer tecla para sair...
pause >nul
exit /b 0

:invalid
echo Opcao invalida! Tente novamente.
pause
goto start