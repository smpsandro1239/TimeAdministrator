@echo off
echo ========================================
echo   CONFIGURAR BASE DE DADOS
echo ========================================
echo.

echo OPCOES DISPONIVEIS:
echo.
echo 1. Instalar MongoDB Community (Recomendado)
echo 2. Usar MongoDB Atlas (Cloud)
echo 3. Continuar sem base de dados
echo.

set /p choice="Escolha (1-3): "

if "%choice%"=="1" (
    echo.
    echo ========================================
    echo   MONGODB COMMUNITY - INSTALACAO
    echo ========================================
    echo.
    echo 1. Baixar MongoDB Community Server:
    echo    https://www.mongodb.com/try/download/community
    echo.
    echo 2. Instalar com configuracoes padrao
    echo.
    echo 3. Iniciar servico MongoDB:
    echo    - Windows: Servico inicia automaticamente
    echo    - Ou executar: mongod
    echo.
    echo 4. Testar conexao:
    echo    - Abrir novo terminal
    echo    - Executar: mongosh
    echo.
    echo ✅ Backend/.env ja esta configurado para localhost
    echo.
    pause
    
    echo.
    echo Deseja executar o seed agora? (s/n)
    set /p seed_choice=""
    
    if /i "%seed_choice%"=="s" (
        echo.
        echo Executando seed...
        cd backend
        npm run seed
        cd ..
    )
)

if "%choice%"=="2" (
    echo.
    echo ========================================
    echo   MONGODB ATLAS - CONFIGURACAO
    echo ========================================
    echo.
    echo 1. Criar conta gratuita: https://mongodb.com/atlas
    echo 2. Criar cluster gratuito
    echo 3. Criar usuario da base de dados
    echo 4. Obter connection string
    echo 5. Editar backend/.env:
    echo.
    echo    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/timeadministrator
    echo.
    echo 6. Executar: npm run seed
    echo.
    pause
)

if "%choice%"=="3" (
    echo.
    echo ⚠️  Aplicacao funcionara sem base de dados
    echo    Login nao funcionara ate configurar BD
    echo.
    pause
)

echo.
echo ========================================
echo   CONFIGURACAO CONCLUIDA
echo ========================================
echo.
echo Para iniciar a aplicacao:
echo   INICIAR_AGORA.bat
echo.
pause