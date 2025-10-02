@echo off
echo ========================================
echo   TimeAdministrator - Reset Completo
echo ========================================
echo.

echo ⚠️  ATENÇÃO: Isto irá eliminar todos os dados!
set /p confirm="Tem certeza? (s/N): "
if /i not "%confirm%"=="s" (
    echo Operação cancelada.
    pause
    exit /b 0
)

echo.
echo Parando todos os serviços...
docker-compose down --remove-orphans

echo.
echo Removendo volumes e dados...
docker-compose down -v
docker volume prune -f

echo.
echo Removendo imagens...
docker-compose down --rmi all

echo.
echo Limpando cache npm...
cd backend
npm cache clean --force
cd ..\frontend
npm cache clean --force
cd ..

echo.
echo ✅ Reset completo realizado!
echo.
echo Para reinstalar:
echo 1. scripts\install.bat
echo 2. scripts\start-docker.bat ou scripts\start-local.bat
echo.
pause