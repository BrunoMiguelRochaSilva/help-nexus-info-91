@echo off
echo ======================================
echo Starting Help Nexus Info
echo ======================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Website (Vite)...
start "Help Nexus - Website" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Chatbot Proxy...
start "Help Nexus - Chatbot Proxy" cmd /k "cd proxy && npm start"

echo.
echo ======================================
echo All servers started!
echo ======================================
echo.
echo Website will be available at:
echo http://localhost:8080 or http://localhost:8081
echo.
echo Chatbot Proxy running at:
echo http://localhost:3001
echo.
echo Close this window or press any key...
pause >nul
