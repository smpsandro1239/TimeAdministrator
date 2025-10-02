@echo off
echo ========================================
echo   TimeAdministrator - Docker Setup
echo ========================================
echo.

echo Parando containers existentes...
docker-compose down --remove-orphans 2>nul

echo.
echo Construindo e iniciando containers...
docker-compose up --build -d

echo.
echo Aguardando serviços...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo   APLICACAO INICIADA COM SUCESSO!
echo ========================================
echo.
echo 📱 Frontend: http://localhost:4200
echo 🔧 Backend:  http://localhost:3000/api/v1
echo 🗄️  MongoDB:  localhost:27017
echo.
echo 🔑 Credenciais de login:
echo    Email: admin@timeadministrator.com
echo    Password: admin123
echo.
echo Para ver logs: scripts\logs.bat
echo Para parar:    scripts\stop.bat
echo.
pause