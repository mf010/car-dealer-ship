@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

REM ===========================================================
REM  نظام التحديث التلقائي - Car Dealership System
REM  Auto Update System for Client without Internet/Git/Node
REM ===========================================================

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║        Car Dealership - نظام التحديث التلقائي        ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM تحديد مسار المشروع
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

REM إنشاء مجلد اللوجات إذا لم يكن موجود
if not exist "logs" mkdir logs

REM ملف اللوج بالتاريخ والوقت
set LOG_FILE=logs\update_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.log
set LOG_FILE=%LOG_FILE: =0%

echo [%date% %time%] بدء عملية التحديث... > "%LOG_FILE%"
echo [%date% %time%] Starting update process... >> "%LOG_FILE%"
echo.

REM ===========================================================
REM 1. النسخ الاحتياطي لقاعدة البيانات
REM ===========================================================
echo [1/6] ⏳ جارِ عمل نسخة احتياطية لقاعدة البيانات...
echo [%date% %time%] Step 1: Database Backup >> "%LOG_FILE%"

if not exist "backups" mkdir backups
set BACKUP_FILE=backups\db_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql
set BACKUP_FILE=%BACKUP_FILE: =0%

cd Backend
php artisan db:backup --file="..\%BACKUP_FILE%" >> "..\%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo    ❌ فشل النسخ الاحتياطي - سيتم الاستمرار...
    echo [%date% %time%] WARNING: Backup failed, continuing... >> "..\%LOG_FILE%"
) else (
    echo    ✅ تم حفظ النسخة الاحتياطية بنجاح
    echo [%date% %time%] SUCCESS: Database backup completed >> "..\%LOG_FILE%"
)
cd ..
echo.

REM ===========================================================
REM 2. تحديث الإصدار السابق
REM ===========================================================
echo [2/6] 📋 قراءة معلومات الإصدار الحالي...
echo [%date% %time%] Step 2: Version Check >> "%LOG_FILE%"

if exist "version.json" (
    for /f "tokens=*" %%i in (version.json) do echo %%i >> "%LOG_FILE%"
    echo    ✅ تم تسجيل الإصدار السابق
) else (
    echo    ℹ️  لا يوجد إصدار سابق مسجل
)
echo.

REM ===========================================================
REM 3. تشغيل Git Portable وسحب التحديثات
REM ===========================================================
echo [3/6] 🔄 جارِ تحميل التحديثات من GitHub...
echo [%date% %time%] Step 3: Git Pull >> "%LOG_FILE%"

REM التحقق من وجود Git Portable
if exist "git\bin\git.exe" (
    set "GIT_EXE=%PROJECT_DIR%git\bin\git.exe"
    echo    ✅ تم العثور على Git Portable
) else if exist "git\cmd\git.exe" (
    set "GIT_EXE=%PROJECT_DIR%git\cmd\git.exe"
    echo    ✅ تم العثور على Git Portable
) else (
    echo    ❌ خطأ: Git Portable غير موجود في المجلد git\
    echo    ❌ ERROR: Git Portable not found in git\ folder
    echo [%date% %time%] ERROR: Git Portable not found >> "%LOG_FILE%"
    goto :error
)

REM تعيين متغيرات Git
set "GIT_HOME=%PROJECT_DIR%git"
set "PATH=%GIT_HOME%\bin;%GIT_HOME%\cmd;%PATH%"

REM سحب التحديثات
echo    🌐 Pulling updates from remote...
"%GIT_EXE%" pull origin main >> "%LOG_FILE%" 2>&1

if errorlevel 1 (
    echo    ❌ فشل تحميل التحديثات من GitHub
    echo [%date% %time%] ERROR: Git pull failed >> "%LOG_FILE%"
    goto :error
) else (
    echo    ✅ تم تحميل التحديثات بنجاح
    echo [%date% %time%] SUCCESS: Git pull completed >> "%LOG_FILE%"
)
echo.

REM ===========================================================
REM 4. تحديث Composer Dependencies
REM ===========================================================
echo [4/6] 📦 جارِ تحديث مكتبات PHP (Composer)...
echo [%date% %time%] Step 4: Composer Install >> "%LOG_FILE%"

cd Backend
composer install --no-dev --optimize-autoloader >> "..\%LOG_FILE%" 2>&1

if errorlevel 1 (
    echo    ❌ فشل تحديث مكتبات Composer
    echo [%date% %time%] ERROR: Composer install failed >> "..\%LOG_FILE%"
    cd ..
    goto :error
) else (
    echo    ✅ تم تحديث مكتبات PHP بنجاح
    echo [%date% %time%] SUCCESS: Composer install completed >> "..\%LOG_FILE%"
)
cd ..
echo.

REM ===========================================================
REM 5. تشغيل Database Migrations
REM ===========================================================
echo [5/6] 🗄️  جارِ تحديث قاعدة البيانات (Migrations)...
echo [%date% %time%] Step 5: Database Migrations >> "%LOG_FILE%"

cd Backend
php artisan migrate --force >> "..\%LOG_FILE%" 2>&1

if errorlevel 1 (
    echo    ❌ فشل تحديث قاعدة البيانات
    echo    ⚠️  يمكنك استرجاع النسخة الاحتياطية من مجلد backups
    echo [%date% %time%] ERROR: Database migration failed >> "..\%LOG_FILE%"
    cd ..
    goto :error
) else (
    echo    ✅ تم تحديث قاعدة البيانات بنجاح
    echo [%date% %time%] SUCCESS: Database migrations completed >> "..\%LOG_FILE%"
)
cd ..
echo.

REM ===========================================================
REM 6. تحديث معلومات الإصدار
REM ===========================================================
echo [6/6] 📝 تحديث معلومات الإصدار...
echo [%date% %time%] Step 6: Update Version Info >> "%LOG_FILE%"

REM قراءة الإصدار الجديد من Git
for /f "tokens=*" %%i in ('"%GIT_EXE%" rev-parse --short HEAD') do set NEW_VERSION=%%i
for /f "tokens=*" %%i in ('"%GIT_EXE%" log -1 --pretty^=%%s') do set LAST_COMMIT=%%i

echo {> version.json
echo   "version": "%NEW_VERSION%",>> version.json
echo   "updated_at": "%date% %time%",>> version.json
echo   "last_commit": "%LAST_COMMIT%">> version.json
echo }>> version.json

echo    ✅ تم تحديث معلومات الإصدار
echo [%date% %time%] New Version: %NEW_VERSION% >> "%LOG_FILE%"
echo.

REM ===========================================================
REM النجاح - اكتمل التحديث
REM ===========================================================
:success
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║              ✅ اكتمل التحديث بنجاح!                 ║
echo ║            Update Completed Successfully!             ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 📌 الإصدار الجديد: %NEW_VERSION%
echo 📅 تاريخ التحديث: %date% %time%
echo 📁 ملف اللوج: %LOG_FILE%
echo.
echo [%date% %time%] ========= UPDATE COMPLETED SUCCESSFULLY ========= >> "%LOG_FILE%"

timeout /t 10
exit /b 0

REM ===========================================================
REM الخطأ - فشل التحديث
REM ===========================================================
:error
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║              ❌ فشل التحديث - حدث خطأ                ║
echo ║              Update Failed - Error Occurred            ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo ⚠️  يرجى التحقق من:
echo    1. اتصال الإنترنت
echo    2. ملف اللوج: %LOG_FILE%
echo    3. النسخة الاحتياطية في مجلد backups\
echo.
echo 📞 للدعم الفني، يرجى إرسال ملف اللوج
echo.
echo [%date% %time%] ========= UPDATE FAILED ========= >> "%LOG_FILE%"

pause
exit /b 1
