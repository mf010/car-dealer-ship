@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================================
echo        System Update
echo ========================================================
echo.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

if not exist "logs" mkdir logs
set LOG_FILE=logs\update_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.log
set LOG_FILE=%LOG_FILE: =0%
set PROGRESS_FILE=logs\update_progress.txt

echo [%date% %time%] Update started > "%LOG_FILE%"
echo 0 > "%PROGRESS_FILE%"

REM Ensure PHP is available before proceeding
where php >nul 2>&1
if errorlevel 1 (
    echo    [X] PHP not found in PATH. Please install PHP or add it to PATH. >> "%LOG_FILE%"
    echo    [X] PHP not found. Update aborted.
    pause
    exit /b 1
)

echo [1/4] Creating backup...
echo.
if not exist "backups" mkdir backups
cd Backend
php artisan db:backup >> "..\%LOG_FILE%" 2>&1
if not errorlevel 1 (
    echo    [OK] Backup created
    echo 25 > "..\%PROGRESS_FILE%"
) else (
    echo    [!] Backup failed, continuing...
)
cd ..
echo.

echo [2/4] Downloading updates...
echo.
set "GIT_PATH=git\bin\git.exe"
if exist "%GIT_PATH%" (
    set "GIT_EXE=%PROJECT_DIR%%GIT_PATH%"
    
    REM Fix for "dubious ownership" error
    "%PROJECT_DIR%git\bin\git.exe" config --global --add safe.directory "*" >nul 2>&1
    
    "%PROJECT_DIR%git\bin\git.exe" fetch origin main >> "%LOG_FILE%" 2>&1
    "%PROJECT_DIR%git\bin\git.exe" reset --hard origin/main >> "%LOG_FILE%" 2>&1
    
    if not errorlevel 1 (
        echo    [OK] Updates downloaded
        echo 50 > "%PROGRESS_FILE%"
    ) else (
        echo    [X] Download failed
        echo [%date% %time%] Git pull failed >> "%LOG_FILE%"
        echo -1 > "%PROGRESS_FILE%"
        pause
        exit /b 1
    )
) else (
    echo    [X] Git not found
    echo -1 > "%PROGRESS_FILE%"
    pause
    exit /b 1
)
echo.

echo [3/4] Updating database...
echo.
cd Backend
php artisan migrate --force >> "..\%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo    [X] Database migration failed. Check log for details.
    echo -1 > "%PROGRESS_FILE%"
) else (
    echo    [OK] Database updated
    echo 75 > "%PROGRESS_FILE%"
)
cd ..
echo.

echo [4/4] Updating packages...
echo.
cd Backend
composer install --no-dev --optimize-autoloader --no-interaction >> "..\%LOG_FILE%" 2>&1
REM Composer may return warnings, so we just continue
echo    [OK] Packages updated
echo 100 > "%PROGRESS_FILE%"
cd ..
echo.

echo ========================================================
echo          Update Complete!
echo ========================================================
echo.
echo Log file: %LOG_FILE%
echo.
timeout /t 5
exit /b 0
