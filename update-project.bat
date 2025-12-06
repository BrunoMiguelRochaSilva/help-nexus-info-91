@echo off
echo ========================================
echo   Atualizando Help Nexus Info
echo ========================================
echo.

echo [1/5] Verificando atualizacoes do GitHub...
git fetch origin
echo.

echo [2/5] Verificando diferencas...
git status
echo.

set /p confirm="Deseja fazer pull das atualizacoes? (S/N): "
if /i "%confirm%" NEQ "S" (
    echo Atualizacao cancelada.
    pause
    exit /b
)

echo.
echo [3/5] Fazendo pull das atualizacoes...
git pull origin main
if %errorlevel% neq 0 (
    echo ERRO: Falha ao fazer pull. Pode haver conflitos.
    echo Resolve os conflitos manualmente e tenta novamente.
    pause
    exit /b 1
)
echo.

echo [4/5] Instalando dependencias do proxy...
cd proxy
call npm install
if %errorlevel% neq 0 (
    echo AVISO: Falha ao instalar dependencias.
)
echo.

echo [5/5] Compilando TypeScript...
call npm run build
if %errorlevel% neq 0 (
    echo AVISO: Falha ao compilar TypeScript.
)
cd ..
echo.

echo ========================================
echo   Atualizacao concluida!
echo ========================================
echo.
echo Podes agora reiniciar o servidor com:
echo   cd proxy
echo   npm start
echo.
pause
