@echo off
echo ======================================
echo Stopping Help Nexus Info
echo ======================================
echo.

echo Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul

echo.
echo ======================================
echo All servers stopped!
echo ======================================
echo.
echo You can now safely close your computer.
echo.
pause
