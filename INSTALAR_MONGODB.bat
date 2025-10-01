@echo off
echo ========================================
echo   INSTALAR MONGODB - TimeAdministrator
echo ========================================
echo.

echo Baixando MongoDB Community Server...
echo.

echo 1. Abrir navegador para download
start https://www.mongodb.com/try/download/community

echo.
echo 2. Selecionar:
echo    - Version: 7.0.x (Current)
echo    - Platform: Windows
echo    - Package: msi
echo.

echo 3. Instalar com configuracoes padrao
echo    - Marcar "Install MongoDB as a Service"
echo    - Marcar "Run service as Network Service user"
echo.

echo 4. Aguardar instalacao completa
echo.

pause

echo.
echo ========================================
echo   TESTANDO INSTALACAO
echo ========================================
echo.

echo Testando conexao MongoDB...
mongod --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ MongoDB instalado com sucesso!
    echo.
    echo Executando seed...
    cd backend
    npx ts-node src/database/seed-simple.ts
    cd ..
) else (
    echo ❌ MongoDB nao encontrado
    echo.
    echo Verifique se:
    echo 1. Instalacao foi concluida
    echo 2. Servico MongoDB esta rodando
    echo 3. PATH foi atualizado (reiniciar terminal)
)

echo.
pause