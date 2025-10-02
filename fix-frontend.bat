@echo off
title TimeAdministrator - Fix Frontend
color 0E

echo ========================================
echo   Corrigindo Frontend Angular
echo ========================================
echo.

cd frontend

echo [1/4] Limpando cache npm...
npm cache clean --force

echo.
echo [2/4] Removendo node_modules...
rmdir /s /q node_modules 2>nul

echo.
echo [3/4] Instalando dependencias com force...
npm install --force

echo.
echo [4/4] Iniciando frontend...
echo.
echo 📱 Frontend: http://localhost:4200
echo 🔑 Login: admin@timeadministrator.com / admin123
echo.

ng serve --port 4200