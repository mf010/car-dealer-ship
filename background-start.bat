@echo off
cd /d "%~dp0"

if not exist "logs" mkdir logs
echo [%date% %time%] Background script started > "logs\debug_start.log"

REM Check MySQL
netstat -an | find "3306" | find "LISTENING" >nul
if %errorlevel% neq 0 (
    echo [%date% %time%] MySQL not running > "logs\startup_error.log"
    mshta javascript:alert("Error: MySQL is not running. Please start XAMPP.");close();
    exit /b 1
)

REM Start Browser
start http://localhost:8000

REM Start Server
cd Backend
php artisan serve > "..\logs\laravel.log" 2>&1

if %errorlevel% neq 0 (
    echo [%date% %time%] Laravel failed to start >> "..\logs\startup_error.log"
    mshta javascript:alert("Error: System failed to start. Check logs folder.");close();
)