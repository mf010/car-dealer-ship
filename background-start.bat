@echo off
cd /d "%~dp0"

REM Check MySQL
netstat -an | find "3306" | find "LISTENING" >nul
if %errorlevel% neq 0 (
    mshta javascript:alert("Error: MySQL is not running. Please start XAMPP.");close();
    exit /b 1
)

REM Start Browser
start http://localhost:8000

REM Start Server
cd Backend
php artisan serve