@echo off
echo ========================================
echo      TimeAdministrator v2.0
echo   Sistema de Gestão de Subscrições
echo ========================================
echo.

echo Escolha o modo de execução:
echo.
echo 1. 🐳 Docker (Recomendado - Produção)
echo 2. 💻 Local (Desenvolvimento)
echo 3. 📦 Instalar Dependências
echo 4. 🔄 Reset Completo
echo 5. 📋 Ver Logs
echo 6. ⏹️  Parar Serviços
echo.

set /p choice="Escolha uma opção (1-6): "

if "%choice%"=="1" (
    call scripts\start-docker.bat
) else if "%choice%"=="2" (
    call scripts\start-local.bat
) else if "%choice%"=="3" (
    call scripts\install.bat
) else if "%choice%"=="4" (
    call scripts\reset.bat
) else if "%choice%"=="5" (
    call scripts\logs.bat
) else if "%choice%"=="6" (
    call scripts\stop.bat
) else (
    echo Opção inválida!
    pause
    exit /b 1
)