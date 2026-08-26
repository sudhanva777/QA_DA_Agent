@echo off
setlocal enabledelayedexpansion
title QA Data Analysis Agent - Launcher
cd /d "%~dp0"

echo ============================================================
echo           QA Data Analysis Agent - Auto Launcher
echo ============================================================
echo.

:: 1. Verify Python Installation
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python was not found on your system PATH.
    echo Please install Python 3.10+ and add it to your PATH.
    goto :fail
)

:: 2. Detect / Activate Virtual Environment
if exist ".venv\Scripts\activate.bat" (
    set "ACTIVATE_CMD=.venv\Scripts\activate.bat"
) else if exist "venv\Scripts\activate.bat" (
    set "ACTIVATE_CMD=venv\Scripts\activate.bat"
) else (
    echo [INFO] Creating Python virtual environment in .venv\...
    python -m venv .venv
    if errorlevel 1 goto :fail
    set "ACTIVATE_CMD=.venv\Scripts\activate.bat"
)

call "%ACTIVATE_CMD%"
if errorlevel 1 (
    echo [ERROR] Failed to activate virtual environment.
    goto :fail
)

:: 3. Check .env configuration
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo [INFO] Created .env configuration from .env.example.
    )
)

:: 4. Verify Node / npm Installation
where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js / npm was not found on your system PATH.
    echo Please install Node.js (https://nodejs.org) to run the frontend.
    goto :fail
)

:: 5. Install frontend dependencies if missing
if not exist "frontend\node_modules\" (
    echo [INFO] Installing frontend npm packages...
    cd frontend
    call npm install
    if errorlevel 1 (
        cd ..
        goto :fail
    )
    cd ..
)

echo.
echo [1/3] Starting FastAPI Backend on http://localhost:8000 ...
start "QA Agent - Backend (FastAPI)" cmd /k "cd /d "%~dp0" && call "%ACTIVATE_CMD%" && uvicorn api:app --host 127.0.0.1 --port 8000 --reload"

echo [2/3] Starting React Frontend on http://localhost:5173 ...
start "QA Agent - Frontend (Vite)" cmd /k "cd /d "%~dp0\frontend" && npm run dev"

echo [3/3] Opening web browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ============================================================
echo  [SUCCESS] QA Data Analysis Agent is running!
echo ============================================================
echo.
echo  - Frontend Web UI : http://localhost:5173
echo  - Backend API Docs: http://localhost:8000/docs
echo  - Backend Health  : http://localhost:8000/api/health
echo.
echo  Keep the opened terminal windows running while using the app.
echo  To stop the application, close the backend and frontend windows.
echo ============================================================
echo.
pause
goto :done

:fail
echo.
echo [LAUNCHER ERROR] Could not complete launch. Please review errors above.
echo.
pause

:done
endlocal
