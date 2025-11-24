@echo off
chcp 65001 > nul 2>&1
setlocal enabledelayedexpansion

echo.
echo ========================================================
echo        Car Dealership System - Installation
echo ========================================================
echo.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo [1/5] Checking Requirements...
echo.

php --version >nul 2>&1
if errorlevel 1 (
    echo    [X] PHP not found. Please install XAMPP
    echo.
    pause
    exit /b 1
)
echo    [OK] PHP found

composer --version >nul 2>&1
if errorlevel 1 (
    echo    [X] Composer not found. Install from: https://getcomposer.org/
    echo.
    pause
    exit /b 1
)
echo    [OK] Composer found
echo.

echo [2/5] Installing PHP packages...
echo.
cd Backend
composer install --no-dev --optimize-autoloader
if errorlevel 1 (
    echo    [X] Installation failed
    pause
    exit /b 1
)
echo    [OK] Packages installed
cd ..
echo.

echo [3/5] Setting up environment...
echo.
cd Backend
if not exist ".env" (
    copy ".env.example" ".env" >nul
    echo    [OK] .env file created
    echo.
    echo    [!] Edit Backend\.env and set:
    echo        DB_DATABASE=your_database_name
    echo        DB_USERNAME=root
    echo        DB_PASSWORD=
    echo.
)
php artisan key:generate
cd ..
echo.

echo [4/5] Creating directories...
echo.
if not exist "logs" mkdir logs
if not exist "backups" mkdir backups
echo    [OK] Directories created
echo.

echo [5/5] Setting up database...
echo.
set /p run_migrate="    Run database setup now? (Y/N): "
if /i "%run_migrate%"=="Y" (
    cd Backend
    php artisan migrate --force
    if not errorlevel 1 (
        echo    [OK] Database setup complete
        set /p run_seed="    Add sample data? (Y/N): "
        if /i "!run_seed!"=="Y" (
            php artisan db:seed
        )
    )
    cd ..
)
echo.

echo ========================================================
echo          Installation Complete!
echo ========================================================
echo.
echo Next steps:
echo   1. Edit Backend\.env (database settings)
echo   2. Run: cd Backend ^&^& php artisan serve
echo   3. Open: http://localhost:8000
echo.
echo For updates: Use Settings ^> System Update button
echo ========================================================
echo.
pause
