@echo off
title TimeAdministrator - Menu Principal
color 0B

echo ========================================
echo      TimeAdministrator v2.0
echo   Sistema de Gestao de Subscricoes
echo ========================================
echo.

echo Escolha uma opcao:
echo.
echo 1. 🚀 Iniciar Sistema Completo
echo 2. ⏹️  Parar Sistema
echo 3. 🔄 Reset Completo
echo 4. 📋 Ver Logs
echo 5. 🔧 Menu Avancado
echo.

set /p choice="Escolha uma opcao (1-5): "

if "%choice%"=="1" (
    call start-system.bat
) else if "%choice%"=="2" (
    call stop-system.bat
) else if "%choice%"=="3" (
    call reset-system.bat
) else if "%choice%"=="4" (
    docker-compose logs -f
) else if "%choice%"=="5" (
    call scripts\start-docker.bat
) else (
    echo Opcao invalida!
    pause
    exit /b 1
)