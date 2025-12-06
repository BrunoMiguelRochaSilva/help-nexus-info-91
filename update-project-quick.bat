@echo off
echo ========================================
echo   Atualizacao Rapida - Help Nexus Info
echo ========================================
echo.

echo Fazendo pull do GitHub...
git pull origin main

echo.
echo Instalando dependencias...
cd proxy
call npm install

echo.
echo Compilando TypeScript...
call npm run build
cd ..

echo.
echo ========================================
echo   Concluido!
echo ========================================
pause
