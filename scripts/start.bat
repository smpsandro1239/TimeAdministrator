@echo off
echo ========================================
echo  TimeAdministrator - Inicialização
echo ========================================
echo.

echo Verificando se o Docker está em execução...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Docker não está instalado ou não está em execução.
    echo Por favor, instale o Docker Desktop e certifique-se de que está em execução.
    pause
    exit /b 1
)

echo Docker encontrado! Iniciando aplicação...
echo.

echo Parando containers existentes...
docker-compose down

echo.
echo Construindo e iniciando containers...
docker-compose up --build -d

echo.
echo Aguardando serviços ficarem prontos...
timeout /t 30 /nobreak >nul

echo.
echo ========================================
echo  Aplicação iniciada com sucesso!
echo ========================================
echo.
echo Frontend: http://localhost:4200
echo Backend API: http://localhost:3000/api/v1
echo MongoDB: localhost:27017
echo.
echo Credenciais padrão:
echo Email: admin@timeadministrator.com
echo Password: admin123
echo.
echo Para parar a aplicação, execute: scripts\stop.bat
echo Para ver logs, execute: scripts\logs.bat
echo.
pause