@echo off
echo ========================================
echo    TimeAdministrator - Backend Only
echo ========================================
echo.

cd backend

echo Installing dependencies...
call npm install

echo.
echo Starting NestJS development server...
echo Backend will be available at: http://localhost:3000
echo API documentation at: http://localhost:3000/api
echo.

call npm run start:dev

pause
