@echo off
echo Iniciando Frontend Angular...
echo.

REM Tentar com npx primeiro
echo Tentando com npx...
npx @angular/cli@18.2.21 serve --port 4200

REM Se falhar, tentar instalação global
if errorlevel 1 (
    echo.
    echo Instalando Angular CLI globalmente...
    npm install -g @angular/cli@18.2.21
    echo.
    echo Tentando novamente...
    ng serve --port 4200
)

pause