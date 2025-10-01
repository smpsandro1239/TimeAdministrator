@echo off
echo Parando processos Node.js...

REM Matar todos os processos node.exe
taskkill /F /IM node.exe 2>nul

REM Matar processos ng serve se existirem
taskkill /F /IM ng.exe 2>nul

REM Matar processos npm se existirem
taskkill /F /IM npm.exe 2>nul

echo Processos Node.js parados com sucesso!
pause