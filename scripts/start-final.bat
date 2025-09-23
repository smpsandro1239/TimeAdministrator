@echo off
echo ========================================
echo  TimeAdministrator - Versão Final
echo ========================================
echo.

echo Parando containers existentes...
docker-compose down --remove-orphans
docker-compose -f docker-compose.working.yml down
docker-compose -f docker-compose.final.yml down

echo.
echo Iniciando MongoDB...
docker-compose -f docker-compose.final.yml up mongodb -d

echo.
echo Aguardando MongoDB...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo  APLICAÇÃO PRONTA PARA TESTE!
echo ========================================
echo.
echo MongoDB está rodando em: localhost:27017
echo Credenciais: admin / password123
echo Base de dados: timeadministrator
echo.
echo Para testar a aplicação completa:
echo.
echo 1. Instale Node.js 18+ no seu sistema
echo 2. Abra duas janelas de terminal
echo.
echo Terminal 1 (Backend):
echo    cd backend
echo    npm install --legacy-peer-deps
echo    npm run start:dev
echo.
echo Terminal 2 (Frontend):
echo    cd frontend
echo    npm install --legacy-peer-deps
echo    ng serve
echo.
echo Depois aceda a:
echo - Frontend: http://localhost:4200
echo - Backend API: http://localhost:3000/api/v1
echo.
echo Credenciais de login:
echo - Email: admin@timeadministrator.com
echo - Password: admin123
echo.
echo Para parar MongoDB: docker stop timeadmin-mongodb
echo.
pause