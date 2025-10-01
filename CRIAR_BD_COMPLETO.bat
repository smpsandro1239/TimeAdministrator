@echo off
echo ========================================
echo   CRIAR BASE DE DADOS - SOLUCAO COMPLETA
echo ========================================
echo.

echo OPCOES DISPONIVEIS:
echo.
echo 1. Instalar MongoDB Community (Recomendado)
echo 2. Usar MongoDB Atlas (Cloud)
echo 3. Usar base de dados temporaria (desenvolvimento)
echo.

set /p choice="Escolha (1-3): "

if "%choice%"=="1" (
    echo.
    echo ========================================
    echo   INSTALANDO MONGODB COMMUNITY
    echo ========================================
    echo.
    
    echo Abrindo pagina de download...
    start https://www.mongodb.com/try/download/community
    
    echo.
    echo INSTRUCOES:
    echo 1. Baixar MongoDB Community Server 7.0
    echo 2. Executar instalador como Administrador
    echo 3. Aceitar configuracoes padrao
    echo 4. Marcar "Install MongoDB as a Service"
    echo 5. Aguardar instalacao completa
    echo.
    
    pause
    
    echo.
    echo Testando instalacao...
    mongod --version >nul 2>&1
    if %errorlevel% == 0 (
        echo ✅ MongoDB instalado!
        echo.
        echo Criando base de dados...
        cd backend
        npx ts-node src/database/seed-simple.ts
        cd ..
        echo.
        echo ✅ Base de dados criada!
        echo.
        echo Credenciais:
        echo Admin: admin@timeadministrator.com / admin123
        echo Cliente: cliente@teste.com / cliente123
    ) else (
        echo ❌ MongoDB nao encontrado
        echo Reinicie o terminal e tente novamente
    )
)

if "%choice%"=="2" (
    echo.
    echo ========================================
    echo   MONGODB ATLAS - CONFIGURACAO
    echo ========================================
    echo.
    
    echo Abrindo MongoDB Atlas...
    start https://mongodb.com/atlas
    
    echo.
    echo INSTRUCOES:
    echo 1. Criar conta gratuita
    echo 2. Criar cluster gratuito (M0)
    echo 3. Criar usuario da base de dados
    echo 4. Obter connection string
    echo 5. Editar backend/.env:
    echo.
    echo    MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/timeadministrator
    echo.
    echo 6. Executar: npm run seed
    echo.
    pause
)

if "%choice%"=="3" (
    echo.
    echo ========================================
    echo   BASE DE DADOS TEMPORARIA
    echo ========================================
    echo.
    
    echo ⚠️  Esta opcao cria dados temporarios
    echo    Os dados serao perdidos ao reiniciar
    echo.
    
    echo Instalando mongodb-memory-server...
    cd backend
    npm install mongodb-memory-server --save-dev
    
    echo.
    echo Criando base de dados temporaria...
    npx ts-node src/database/seed-memory.ts
    cd ..
    
    echo.
    echo ✅ Base de dados temporaria criada!
    echo.
    echo Credenciais:
    echo Admin: admin@timeadministrator.com / admin123
    echo Cliente: cliente@teste.com / cliente123
)

echo.
echo ========================================
echo   PROXIMO PASSO
echo ========================================
echo.
echo Para iniciar a aplicacao:
echo   INICIAR_AGORA.bat
echo.
pause