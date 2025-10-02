@echo off
title TimeAdministrator - Reset Completo
color 0E

echo ========================================
echo      Reset Completo do Sistema
echo ========================================
echo.
echo ⚠️  ATENCAO: Isto ira apagar todos os dados!
echo.
set /p confirm="Tem certeza? (S/N): "
if /i not "%confirm%"=="S" (
    echo Operacao cancelada.
    pause
    exit /b 0
)

echo.
echo Parando e removendo containers...
docker-compose down -v --rmi all

echo.
echo Limpando processos...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4200') do taskkill /PID %%a /F >nul 2>&1

echo.
echo Limpando cache Docker...
docker system prune -f

echo.
echo ✅ Reset completo realizado!
echo Execute start-system.bat para reiniciar.
pause