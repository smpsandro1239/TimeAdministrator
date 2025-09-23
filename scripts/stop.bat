@echo off
echo ========================================
echo  TimeAdministrator - Parando Aplicação
echo ========================================
echo.

echo Parando containers...
docker-compose down

echo.
echo Aplicação parada com sucesso!
echo.
pause