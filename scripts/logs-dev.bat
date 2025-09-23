@echo off
echo ========================================
echo  TimeAdministrator - Logs Desenvolvimento
echo ========================================
echo.

echo Mostrando logs de desenvolvimento...
echo Pressione Ctrl+C para sair
echo.

docker-compose -f docker-compose.dev.yml logs -f