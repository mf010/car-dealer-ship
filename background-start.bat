@echo off
cd /d "%~dp0"

if not exist "logs" mkdir logs
set LOG_FILE=logs\debug_start.log
echo [%date% %time%] Script started > "%LOG_FILE%"

REM Check PHP
echo [%date% %time%] Checking PHP... >> "%LOG_FILE%"
php -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [%date% %time%] PHP not found >> "%LOG_FILE%"
    mshta javascript:alert("Error: PHP is not installed or not in PATH.");close();
    exit /b 1
)

REM Check MySQL
echo [%date% %time%] Checking MySQL... >> "%LOG_FILE%"
netstat -an | find "3306" | find "LISTENING" >nul
if %errorlevel% neq 0 (
    echo [%date% %time%] MySQL not running >> "%LOG_FILE%"
    mshta javascript:alert("Error: MySQL is not running. Please start XAMPP.");close();
    exit /b 1
)
echo [%date% %time%] MySQL is running >> "%LOG_FILE%"

REM Start Browser
echo [%date% %time%] Opening browser... >> "%LOG_FILE%"
start http://localhost:8000

REM Start Server
echo [%date% %time%] Starting Laravel... >> "%LOG_FILE%"
cd Backend
php artisan serve > "..\logs\laravel.log" 2>&1

if %errorlevel% neq 0 (
    echo [%date% %time%] Laravel exited with error %errorlevel% >> "..\%LOG_FILE%"
)