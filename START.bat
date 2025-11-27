@echo off
title Car Dealership System - Server
cls

echo.
echo ========================================================
echo        Starting Car Dealership System
echo ========================================================
echo.

cd /d "%~dp0"

REM Check if MySQL is running
echo [1/3] Checking MySQL...
netstat -an | find "3306" | find "LISTENING" >nul
if %errorlevel% neq 0 (
    echo    [!] MySQL not running
    echo    Please start MySQL from XAMPP Control Panel
    echo.
    echo    Then run this file again
    echo.
    pause
    exit /b 1
)
echo    [OK] MySQL is running
echo.

REM Check if Apache is running (optional)
echo [2/3] Checking Apache...
netstat -an | find "80" | find "LISTENING" >nul
if %errorlevel% neq 0 (
    echo    [!] Apache not running (optional)
) else (
    echo    [OK] Apache is running
)
echo.

echo [3/3] Starting Laravel server...
echo.

REM Check if database is setup
cd Backend
php artisan migrate:status >nul 2>&1
if %errorlevel% neq 0 (
    echo    [!] Database not setup
    echo.
    set /p run_migrate="    Setup database now? (Y/N): "
    if /i "!run_migrate!"=="Y" (
        echo    Running migrations...
        php artisan migrate --force
        if %errorlevel% equ 0 (
            echo    [OK] Database setup complete
        ) else (
            echo    [X] Migration failed
            echo    Check Backend\.env settings
            echo.
            pause
            exit /b 1
        )
    ) else (
        echo    [!] Warning: Database not setup, system may not work
    )
    echo.
)

echo    Server will start on: http://localhost:8000
echo    Press Ctrl+C to stop the server
echo.
echo ========================================================
echo.

start http://localhost:8000
php artisan serve

pause
