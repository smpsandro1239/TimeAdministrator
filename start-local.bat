@echo off
echo ========================================
echo    TimeAdministrator - Local Mode
echo ========================================
echo.

echo This script will start both frontend and backend locally.
echo Make sure you have Node.js and MongoDB installed.
echo.

echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking MongoDB...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: MongoDB not found. Make sure MongoDB is running.
    echo You can install MongoDB from https://www.mongodb.com/
    echo.
)

echo Starting MongoDB (if not already running)...
start "MongoDB" mongod --dbpath "C:\data\db" --logpath "C:\data\log\mongod.log"

timeout /t 3 /nobreak >nul

echo.
echo Starting backend server...
start "Backend" cmd /k "cd backend && npm install && npm run start:dev"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo Starting frontend server...
start "Frontend" cmd /k "cd frontend && npm install && ng serve --host 0.0.0.0 --port 4200"

echo.
echo ========================================
echo Services starting up...
echo ========================================
echo.
echo Frontend: http://localhost:4200
echo Backend:  http://localhost:3000
echo MongoDB:  localhost:27017
echo.
echo Press any key to close this window...
echo (Services will continue running in background)
echo.

pause >nul
