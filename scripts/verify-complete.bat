@echo off
echo ========================================
echo  TimeAdministrator - Verificação Final
echo ========================================
echo.

echo 🔍 Testando todos os endpoints da API...
echo.

echo 1. Testando endpoint raiz da API...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/v1' -Method GET; Write-Host '✅ API Root:' $response.name 'v'$response.version } catch { Write-Host '❌ API Root: ERRO' }"

echo.
echo 2. Testando endpoint de saúde...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/v1/health' -Method GET; Write-Host '✅ Health Check:' $response.status } catch { Write-Host '❌ Health Check: ERRO' }"

echo.
echo 3. Testando endpoint de autenticação (deve retornar 401)...
powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:3000/api/v1/auth/profile' -Method GET } catch { if ($_.Exception.Response.StatusCode -eq 'Unauthorized') { Write-Host '✅ Auth Endpoint: Funcionando (401 esperado)' } else { Write-Host '❌ Auth Endpoint: ERRO' } }"

echo.
echo 4. Testando login com credenciais válidas...
powershell -Command "try { $body = @{ email='admin@timeadministrator.com'; password='admin123' } | ConvertTo-Json; $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/v1/auth/login' -Method POST -Body $body -ContentType 'application/json'; Write-Host '✅ Login Admin: Sucesso -' $response.user.name } catch { Write-Host '❌ Login Admin: ERRO -' $_.Exception.Message }"

echo.
echo 5. Verificando se o frontend está acessível...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:4200' -Method GET -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host '✅ Frontend: Acessível (Status 200)' } else { Write-Host '❌ Frontend: Status' $response.StatusCode } } catch { Write-Host '❌ Frontend: Não acessível' }"

echo.
echo ========================================
echo  RESULTADO FINAL
echo ========================================
echo.
echo Se todos os testes passaram:
echo ✅ Backend API funcionando corretamente
echo ✅ Autenticação configurada
echo ✅ Base de dados conectada
echo ✅ Frontend acessível
echo.
echo 🌐 Aceda à aplicação: http://localhost:4200
echo 👤 Login Admin: admin@timeadministrator.com / admin123
echo 👤 Login Cliente: cliente@teste.com / cliente123
echo.
pause