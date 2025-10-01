@echo off
echo ========================================
echo   TimeAdministrator - Desenvolvimento Local
echo ========================================

echo.
echo 1. Verificando MongoDB...
docker ps | findstr timeadmin-mongodb-dev >nul
if %errorlevel% neq 0 (
    echo MongoDB nao esta rodando. Iniciando...
    docker-compose -f docker-compose.dev-local.yml up -d
    timeout /t 5 >nul
) else (
    echo MongoDB ja esta rodando!
)

echo.
echo 2. Iniciando Backend...
start "TimeAdmin Backend" cmd /k "cd backend && npm run start:dev"

echo.
echo 3. Aguardando backend inicializar...
timeout /t 10 >nul

echo.
echo 4. Iniciando Frontend...
start "TimeAdmin Frontend" cmd /k "cd frontend && ng serve"

echo.
echo ========================================
echo   Aplicacao iniciada!
echo ========================================
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:4200
echo.
echo Credenciais de teste:
echo Admin: admin@timeadministrator.com / admin123
echo Cliente: cliente@teste.com / cliente123
echo.
echo Pressione qualquer tecla para sair...
pause >nul