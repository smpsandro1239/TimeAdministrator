@echo off
echo ========================================
echo    TimeAdministrator - Frontend Only
echo ========================================
echo.

cd frontend

echo Installing dependencies...
call npm install

echo.
echo Starting Angular development server...
echo Frontend will be available at: http://localhost:4200
echo.

call ng serve --host 0.0.0.0 --port 4200

pause
