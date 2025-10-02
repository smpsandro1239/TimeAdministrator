@echo off
echo ========================================
echo   TimeAdministrator - Logs
echo ========================================
echo.

echo Escolha o serviço para ver logs:
echo 1. Todos os serviços
echo 2. Backend apenas
echo 3. Frontend apenas
echo 4. MongoDB apenas
echo.

set /p choice="Escolha (1-4): "

if "%choice%"=="1" (
    docker-compose logs -f
) else if "%choice%"=="2" (
    docker-compose logs -f backend
) else if "%choice%"=="3" (
    docker-compose logs -f frontend
) else if "%choice%"=="4" (
    docker-compose logs -f mongodb
) else (
    echo Opção inválida!
    pause
    exit /b 1
)