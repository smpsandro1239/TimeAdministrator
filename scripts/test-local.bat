@echo off
echo ========================================
echo  TimeAdministrator - Teste Local
echo ========================================
echo.

echo Parando containers Docker...
docker-compose -f docker-compose.working.yml down

echo.
echo Iniciando apenas MongoDB...
docker-compose -f docker-compose.working.yml up mongodb -d

echo.
echo Aguardando MongoDB...
timeout /t 5 /nobreak >nul

echo.
echo MongoDB iniciado! Agora pode testar localmente:
echo.
echo 1. Backend (numa nova janela de terminal):
echo    cd backend
echo    npm install --legacy-peer-deps
echo    npm run start:dev
echo.
echo 2. Frontend (noutra janela de terminal):
echo    cd frontend  
echo    npm install --legacy-peer-deps
echo    ng serve
echo.
echo MongoDB: mongodb://admin:password123@localhost:27017/timeadministrator
echo Backend: http://localhost:3000/api/v1
echo Frontend: http://localhost:4200
echo.
echo Credenciais: admin@timeadministrator.com / admin123
echo.
pause