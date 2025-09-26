@echo off
echo ========================================
echo  TimeAdministrator - Teste Completo
echo ========================================
echo.

echo Verificando serviços...
echo.

echo 1. Testando MongoDB...
docker ps | findstr mongodb >nul
if %errorlevel% equ 0 (
    echo ✅ MongoDB: FUNCIONANDO
) else (
    echo ❌ MongoDB: NÃO ESTÁ RODANDO
)

echo.
echo 2. Testando Backend (porta 3000)...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ✅ Backend: FUNCIONANDO na porta 3000
) else (
    echo ❌ Backend: NÃO ESTÁ RODANDO
)

echo.
echo 3. Testando Frontend (porta 4200)...
netstat -ano | findstr :4200 >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend: FUNCIONANDO na porta 4200
) else (
    echo ❌ Frontend: NÃO ESTÁ RODANDO
)

echo.
echo 4. Testando API Backend...
powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:3000/api/v1/auth/profile' -Method GET } catch { if ($_.Exception.Response.StatusCode -eq 'Unauthorized') { Write-Host '✅ API: FUNCIONANDO (Unauthorized esperado)' } else { Write-Host '❌ API: ERRO -' $_.Exception.Message } }" 2>nul

echo.
echo ========================================
echo  RESUMO DO TESTE
echo ========================================
echo.
echo Se todos os serviços estão funcionando:
echo - Aceda a: http://localhost:4200
echo - Login: admin@timeadministrator.com
echo - Password: admin123
echo.
echo Para parar os serviços:
echo - Feche as janelas do PowerShell
echo - Execute: docker stop timeadmin-mongodb
echo.
pause