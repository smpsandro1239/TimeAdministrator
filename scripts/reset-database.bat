@echo off
echo ========================================
echo  TimeAdministrator - Reset da Base de Dados
echo ========================================
echo.

echo AVISO: Esta operação irá apagar todos os dados!
set /p confirm="Tem certeza que deseja continuar? (s/N): "

if /i "%confirm%" neq "s" (
    echo Operação cancelada.
    pause
    exit /b 0
)

echo.
echo Parando containers...
docker-compose down

echo.
echo Removendo volumes da base de dados...
docker volume rm timeadministrator_mongodb_data 2>nul
docker volume rm timeadministrator_mongodb_dev_data 2>nul

echo.
echo Reiniciando aplicação...
docker-compose up -d

echo.
echo Base de dados resetada com sucesso!
echo Utilizador admin recriado: admin@timeadministrator.com / admin123
echo.
pause