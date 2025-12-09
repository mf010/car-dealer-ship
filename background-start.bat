@echo off
cd /d "%~dp0"

if not exist "logs" mkdir logs
set LOG_FILE=logs\debug_start.log
echo [%date% %time%] Script started > "%LOG_FILE%"

REM --- Find PHP ---
echo [%date% %time%] Finding PHP... >> "%LOG_FILE%"
set "PHP_CMD=php"

REM Try global PHP
%PHP_CMD% -v >nul 2>&1
if %errorlevel% equ 0 goto :FOUND_PHP

REM Try XAMPP default location
if exist "C:\xampp\php\php.exe" (
    set "PHP_CMD=C:\xampp\php\php.exe"
    goto :FOUND_PHP
)

REM Try relative path (assuming we are in htdocs/project)
if exist "..\..\php\php.exe" (
    set "PHP_CMD=..\..\php\php.exe"
    goto :FOUND_PHP
)

echo [%date% %time%] PHP not found in PATH or standard locations >> "%LOG_FILE%"
mshta javascript:alert("Error: PHP not found. Please ensure XAMPP is installed correctly.");close();
exit /b 1

:FOUND_PHP
echo [%date% %time%] Using PHP at: %PHP_CMD% >> "%LOG_FILE%"

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
"%PHP_CMD%" artisan serve > "..\logs\laravel.log" 2>&1

if %errorlevel% neq 0 (
    echo [%date% %time%] Laravel exited with error %errorlevel% >> "..\%LOG_FILE%"
)