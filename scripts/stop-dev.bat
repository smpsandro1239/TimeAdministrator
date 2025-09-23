@echo off
echo ========================================
echo  TimeAdministrator - Parando Desenvolvimento
echo ========================================
echo.

echo Parando containers de desenvolvimento...
docker-compose -f docker-compose.dev.yml down

echo.
echo Aplicação de desenvolvimento parada com sucesso!
echo.
pause