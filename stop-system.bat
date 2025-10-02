@echo off
title TimeAdministrator - Parar Sistema
color 0C

echo ========================================
echo      Parando TimeAdministrator
echo ========================================
echo.

echo Parando containers...
docker-compose down

echo.
echo Limpando processos nas portas...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4200') do taskkill /PID %%a /F >nul 2>&1

echo.
echo ✅ Sistema parado com sucesso!
pause