@echo off
set "PATH=C:\Users\Peeru\AppData\Local\Programs\MinGit\cmd;C:\Program Files\nodejs;%PATH%"
echo ========================================================
echo   Starting HealthAI - Your Smart Healthcare Assistant
echo ========================================================
echo   Backend API:   http://localhost:5000
echo   Frontend Vite: http://localhost:5173
echo ========================================================
call npm.cmd run dev
pause
