@echo off
title GDG NECN - Admin Data Portal Launcher
echo ===================================================
echo   GDG ON CAMPUS NECN - ADMIN DATA PORTAL
echo   Google Cloud Learn with Communities 2026
echo ===================================================
echo.
echo Launching standalone Admin Portal on port 5174...
echo.

cd /d "%~dp0..\Frontend"
start "" "http://localhost:5174/admin.html"
npx vite --port 5174 --open /admin.html
pause
