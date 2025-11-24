@echo off
chcp 65001 > nul 2>&1
setlocal enabledelayedexpansion

REM ===========================================================
REM  Initial Project Setup
REM  Car Dealership System - First Time Installation
REM ===========================================================

echo.
echo ========================================================
echo        Initial Installation
echo          Car Dealership System Setup
echo ========================================================
echo.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

REM ===========================================================
REM Check Requirements
REM ===========================================================
echo [1/7] Checking Requirements...
echo.

REM Check PHP
php --version >nul 2>&1
if errorlevel 1 (
    echo    [X] PHP is not installed
    echo    Please install XAMPP or PHP first
    echo.
    pause
    goto :error
) else (
    echo    [OK] PHP found
)

REM Check Composer
composer --version >nul 2>&1
if errorlevel 1 (
    echo    [X] Composer is not installed
    echo    Please install Composer from: https://getcomposer.org/
    echo.
    pause
    goto :error
) else (
    echo    [OK] Composer found
)

REM Check Git Portable
if exist "git\bin\git.exe" (
    echo    [OK] Git Portable found
) else (
    echo    [!] Git Portable not found
    echo    For future updates, you may need Git
)

echo.
echo    [OK] All basic requirements are met
echo.

REM ===========================================================
REM Install Backend Dependencies
REM ===========================================================
echo [2/7] Installing PHP Dependencies...
echo.

cd Backend

if not exist "vendor\" (
    echo    Installing packages... Please wait (may take a few minutes)
    echo.
    composer install --no-dev --optimize-autoloader
    
    if errorlevel 1 (
        echo    [X] Failed to install packages
        echo.
        pause
        cd ..
        goto :error
    ) else (
        echo    [OK] Packages installed successfully
    )
) else (
    echo    [i] Packages already installed
)

cd ..
echo.

REM ===========================================================
REM Setup Environment File
REM ===========================================================
echo [3/7] Setting up Environment...
echo.

cd Backend

if not exist ".env" (
    if exist ".env.example" (
        echo    Copying .env.example to .env
        copy ".env.example" ".env" >nul
        echo    [OK] .env file created
        echo.
        echo    [!] Important: Please edit Backend\.env file
        echo.
        echo    You need to set:
        echo    - DB_DATABASE=your_database_name
        echo    - DB_USERNAME=your_username
        echo    - DB_PASSWORD=your_password
        echo.
    ) else (
        echo    [X] .env.example not found
        echo.
        pause
        cd ..
        goto :error
    )
) else (
    echo    [i] .env file already exists
)

cd ..
echo.

REM ===========================================================
REM Generate Application Key
REM ===========================================================
echo [4/7] Generating App Key...
echo.

cd Backend
php artisan key:generate

if errorlevel 1 (
    echo    [!] Warning: Key generation failed
) else (
    echo    [OK] App key generated successfully
)

cd ..
echo.

REM ===========================================================
REM Create Required Directories
REM ===========================================================
echo [5/7] Creating Directories...
echo.

if not exist "logs" mkdir logs
if not exist "backups" mkdir backups

echo    [OK] Required directories created
echo.

REM ===========================================================
REM Setup Database
REM ===========================================================
echo [6/7] Setting up Database...
echo.
echo    Do you want to run migrations now? (Y/N)
echo.
set /p run_migrate="    Type Y to continue or N to skip: "

if /i "%run_migrate%"=="Y" (
    cd Backend
    php artisan migrate --force
    
    if errorlevel 1 (
        echo    [!] Warning: Migration failed
        echo    Make sure database is configured in .env
        cd ..
    ) else (
        echo    [OK] Migrations completed successfully
        cd ..
        
        echo.
        echo    Do you want to run seeders (sample data)? (Y/N)
        set /p run_seed="    Type Y or N: "
        
        if /i "!run_seed!"=="Y" (
            cd Backend
            php artisan db:seed
            
            if errorlevel 1 (
                echo    [!] Warning: Seeders failed
                cd ..
            ) else (
                echo    [OK] Seeders completed successfully
                cd ..
            )
        )
    )
) else (
    echo    [i] Migrations skipped
    echo    You can run it later with:
    echo    cd Backend ^&^& php artisan migrate
)

echo.

REM ===========================================================
REM Complete
REM ===========================================================
echo [7/7] Installation Complete!
echo.

:success
echo.
echo ========================================================
echo          Installation Completed Successfully!
echo ========================================================
echo.
echo Next Steps:
echo.
echo    1. Make sure database is configured in Backend\.env
echo.
echo    2. Run the server:
echo       cd Backend
echo       php artisan serve
echo.
echo    3. Open browser at:
echo       http://localhost:8000
echo       (Full system Frontend + Backend works now)
echo.
echo    4. For future updates:
echo       Use "System Update" button in Settings
echo       Or use update.bat
echo.
echo ========================================================
echo.

pause
exit /b 0

REM ===========================================================
REM Error Handler
REM ===========================================================
:error
echo.
echo ========================================================
echo              Setup Failed
echo ========================================================
echo.
echo Please review the errors above and try again
echo.
pause
exit /b 1
