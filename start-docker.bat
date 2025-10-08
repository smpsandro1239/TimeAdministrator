@echo off
echo ========================================
echo    TimeAdministrator - Docker Mode
echo ========================================
echo.

echo Checking if Docker is running...
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running. Please start Docker Desktop first.
    echo.
    pause
    exit /b 1
)

echo Docker is running. Starting services...
echo.

echo Building and starting all services with Docker Compose...
echo This may take a few minutes on first run...
echo.

if exist docker-compose.dev.yml (
    echo Using development configuration...
    docker-compose -f docker-compose.dev.yml up --build
) else (
    echo Using production configuration...
    docker-compose up --build
)

echo.
echo Services should be available at:
echo - Frontend: http://localhost:4200
echo - Backend: http://localhost:3000
echo - MongoDB: localhost:27017
echo.

pause
