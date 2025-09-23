@echo off
echo ========================================
echo  TimeAdministrator - Modo Desenvolvimento
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

echo Docker encontrado! Iniciando aplicação em modo desenvolvimento...
echo.

echo Parando containers existentes...
docker-compose -f docker-compose.dev.yml down

echo.
echo Construindo e iniciando containers de desenvolvimento...
docker-compose -f docker-compose.dev.yml up --build -d

echo.
echo Aguardando serviços ficarem prontos...
timeout /t 30 /nobreak >nul

echo.
echo ========================================
echo  Aplicação iniciada em modo desenvolvimento!
echo ========================================
echo.
echo Frontend: http://localhost:4200
echo Backend API: http://localhost:3000/api/v1
echo MongoDB: localhost:27017
echo Debug Backend: localhost:9229
echo.
echo Credenciais padrão:
echo Email: admin@timeadministrator.com
echo Password: admin123
echo.
echo Hot-reload ativo para desenvolvimento!
echo Para parar, execute: scripts\stop-dev.bat
echo Para ver logs, execute: scripts\logs-dev.bat
echo.
pause