@echo off
echo ======================================
echo Moving files from help-nexus-info-main/ to root
echo ======================================
echo.

cd /d "%~dp0"

echo Step 1: Moving all files from subdirectory to root...
robocopy "help-nexus-info-main" "." /E /MOVE /XD .git node_modules /NFL /NDL /NJH /NJS

echo.
echo Step 2: Removing empty subdirectory...
if exist "help-nexus-info-main" rmdir /S /Q "help-nexus-info-main"

echo.
echo Step 3: Staging all changes for git...
git add -A

echo.
echo Step 4: Creating commit...
git commit -m "refactor: move all files from help-nexus-info-main/ to root directory

- Flatten project structure for Lovable compatibility
- Move src/, public/, and config files to root
- Remove nested directory structure
- No functional changes, only file reorganization"

echo.
echo ======================================
echo Done! Files moved successfully.
echo ======================================
echo.
echo Next step: Push to GitHub
echo Run: git push origin main
echo.
pause
