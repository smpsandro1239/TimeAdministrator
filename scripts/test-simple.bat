@echo off
echo ========================================
echo  TimeAdministrator - Teste Simples
echo ========================================
echo.

echo Parando containers existentes...
docker-compose down
docker-compose -f docker-compose.simple.yml down

echo.
echo Iniciando apenas MongoDB...
docker-compose -f docker-compose.simple.yml up mongodb -d

echo.
echo Aguardando MongoDB...
timeout /t 10 /nobreak >nul

echo.
echo MongoDB iniciado com sucesso!
echo Pode conectar em: mongodb://admin:password123@localhost:27017/timeadministrator
echo.
echo Para parar: docker-compose -f docker-compose.simple.yml down
echo.
pause