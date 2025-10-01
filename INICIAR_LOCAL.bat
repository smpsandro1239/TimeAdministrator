@echo off
echo ========================================
echo   INICIAR APLICACAO LOCAL
echo ========================================
echo.

echo 1. Verificando MongoDB...
docker ps | findstr timeadmin-mongodb-dev >nul
if %errorlevel% == 0 (
    echo ✅ MongoDB rodando
) else (
    echo 🚀 Iniciando MongoDB...
    docker-compose -f docker-compose.dev.yml up -d
    timeout /t 5 >nul
)

echo.
echo 2. Populando base de dados...
cd backend
npx ts-node src/database/seed-mock.ts
cd ..

echo.
echo 3. Iniciando backend mock...
start "Backend" cmd /k "cd backend && npm run start:mock"

echo.
echo 4. Aguardando backend...
timeout /t 3 >nul

echo.
echo 5. Iniciando frontend...
start "Frontend" cmd /k "cd frontend && ng serve"

echo.
echo ========================================
echo   APLICACAO INICIADA
echo ========================================
echo.
echo Frontend: http://localhost:4200
echo Backend:  http://localhost:3000
echo.
echo Credenciais:
echo Admin: admin@timeadministrator.com / admin123
echo Cliente: cliente@teste.com / cliente123
echo.
pause