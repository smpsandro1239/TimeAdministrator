@echo off
echo ========================================
echo   TimeAdministrator - Parar Serviços
echo ========================================
echo.

echo Parando containers Docker...
docker-compose down --remove-orphans

echo.
echo Matando processos Node.js...
taskkill /f /im node.exe 2>nul
taskkill /f /im ng.exe 2>nul

echo.
echo ✅ Todos os serviços foram parados!
echo.
pause