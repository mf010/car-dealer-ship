@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

REM ===========================================================
REM  التثبيت الأولي للمشروع - Initial Project Setup
REM  Car Dealership System - First Time Installation
REM ===========================================================

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║        التثبيت الأولي - Initial Installation         ║
echo ║          Car Dealership System Setup                  ║
echo ╚════════════════════════════════════════════════════════╝
echo.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

REM ===========================================================
REM التحقق من المتطلبات - Check Requirements
REM ===========================================================
echo [1/7] 🔍 فحص المتطلبات - Checking Requirements...
echo.

REM التحقق من PHP
php --version >nul 2>&1
if errorlevel 1 (
    echo    ❌ PHP غير مثبت - PHP is not installed
    echo    يرجى تثبيت XAMPP أو PHP أولاً
    echo    Please install XAMPP or PHP first
    goto :error
) else (
    echo    ✅ PHP موجود - PHP found
)

REM التحقق من Composer
composer --version >nul 2>&1
if errorlevel 1 (
    echo    ❌ Composer غير مثبت - Composer is not installed
    echo    يرجى تثبيت Composer من: https://getcomposer.org/
    echo    Please install Composer from: https://getcomposer.org/
    goto :error
) else (
    echo    ✅ Composer موجود - Composer found
)

REM التحقق من Git Portable
if exist "git\bin\git.exe" (
    echo    ✅ Git Portable موجود - Git Portable found
) else (
    echo    ⚠️  Git Portable غير موجود - Git Portable not found
    echo    للتحديث المستقبلي، راجع: GIT_PORTABLE_SETUP.md
    echo    For future updates, see: GIT_PORTABLE_SETUP.md
)

echo.
echo    ✅ جميع المتطلبات الأساسية متوفرة
echo    ✅ All basic requirements are met
echo.

REM ===========================================================
REM تثبيت مكتبات Backend - Install Backend Dependencies
REM ===========================================================
echo [2/7] 📦 تثبيت مكتبات PHP - Installing PHP Dependencies...
echo.

cd Backend

if not exist "vendor\" (
    echo    جارِ تحميل المكتبات... يرجى الانتظار (قد يستغرق بضع دقائق)
    echo    Installing packages... Please wait (may take a few minutes)
    echo.
    composer install --no-dev --optimize-autoloader
    
    if errorlevel 1 (
        echo    ❌ فشل تثبيت المكتبات
        cd ..
        goto :error
    ) else (
        echo    ✅ تم تثبيت المكتبات بنجاح
    )
) else (
    echo    ℹ️  المكتبات مثبتة مسبقاً - Packages already installed
)

cd ..
echo.

REM ===========================================================
REM إعداد ملف البيئة - Setup Environment File
REM ===========================================================
echo [3/7] ⚙️  إعداد ملف البيئة - Setting up Environment...
echo.

cd Backend

if not exist ".env" (
    if exist ".env.example" (
        echo    نسخ ملف .env.example إلى .env
        copy ".env.example" ".env" >nul
        echo    ✅ تم إنشاء ملف .env
        echo.
        echo    ⚠️  مهم: يرجى تعديل ملف Backend\.env
        echo    ⚠️  Important: Please edit Backend\.env file
        echo.
        echo    تحتاج لتعديل:
        echo    You need to set:
        echo    - DB_DATABASE=your_database_name
        echo    - DB_USERNAME=your_username
        echo    - DB_PASSWORD=your_password
        echo.
    ) else (
        echo    ❌ ملف .env.example غير موجود
        cd ..
        goto :error
    )
) else (
    echo    ℹ️  ملف .env موجود مسبقاً - .env file already exists
)

cd ..
echo.

REM ===========================================================
REM توليد مفتاح التطبيق - Generate Application Key
REM ===========================================================
echo [4/7] 🔑 توليد مفتاح التطبيق - Generating App Key...
echo.

cd Backend
php artisan key:generate

if errorlevel 1 (
    echo    ⚠️  تحذير: فشل توليد المفتاح
    echo    Warning: Key generation failed
) else (
    echo    ✅ تم توليد مفتاح التطبيق بنجاح
)

cd ..
echo.

REM ===========================================================
REM إنشاء المجلدات المطلوبة - Create Required Directories
REM ===========================================================
echo [5/7] 📁 إنشاء المجلدات - Creating Directories...
echo.

if not exist "logs" mkdir logs
if not exist "backups" mkdir backups

echo    ✅ تم إنشاء المجلدات المطلوبة
echo    ✅ Required directories created
echo.

REM ===========================================================
REM إعداد قاعدة البيانات - Setup Database
REM ===========================================================
echo [6/7] 🗄️  إعداد قاعدة البيانات - Setting up Database...
echo.
echo    هل تريد تشغيل migrations الآن؟
echo    Do you want to run migrations now? (Y/N)
echo.
set /p run_migrate="    اكتب Y للمتابعة أو N للتخطي - Type Y to continue or N to skip: "

if /i "%run_migrate%"=="Y" (
    cd Backend
    php artisan migrate --force
    
    if errorlevel 1 (
        echo    ⚠️  تحذير: فشل تشغيل migrations
        echo    Warning: Migration failed
        echo    تأكد من إعداد قاعدة البيانات في .env
        echo    Make sure database is configured in .env
        cd ..
    ) else (
        echo    ✅ تم تشغيل migrations بنجاح
        cd ..
        
        echo.
        echo    هل تريد تشغيل seeders (بيانات تجريبية)؟
        echo    Do you want to run seeders (sample data)? (Y/N)
        set /p run_seed="    اكتب Y للمتابعة أو N للتخطي - Type Y or N: "
        
        if /i "!run_seed!"=="Y" (
            cd Backend
            php artisan db:seed
            
            if errorlevel 1 (
                echo    ⚠️  تحذير: فشل تشغيل seeders
                cd ..
            ) else (
                echo    ✅ تم تشغيل seeders بنجاح
                cd ..
            )
        )
    )
) else (
    echo    ℹ️  تم تخطي migrations
    echo    يمكنك تشغيلها لاحقاً بالأمر:
    echo    You can run it later with:
    echo    cd Backend ^&^& php artisan migrate
)

echo.

REM ===========================================================
REM الانتهاء - Complete
REM ===========================================================
echo [7/7] ✅ اكتمل التثبيت - Installation Complete!
echo.

:success
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║            ✅ اكتمل التثبيت بنجاح!                   ║
echo ║          Installation Completed Successfully!         ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 📋 الخطوات التالية - Next Steps:
echo.
echo    1️⃣  تأكد من إعداد قاعدة البيانات في Backend\.env
echo       Make sure database is configured in Backend\.env
echo.
echo    2️⃣  شغّل الخادم:
echo       Run the server:
echo       cd Backend
echo       php artisan serve
echo.
echo    3️⃣  افتح المتصفح على:
echo       Open browser at:
echo       http://localhost:8000
echo.
echo    4️⃣  للتحديثات المستقبلية:
echo       For future updates:
echo       استخدم update.bat
echo       Use update.bat
echo.
echo 📚 للمساعدة - For Help:
echo    - اقرأ CLIENT_GUIDE.md للتعليمات الكاملة
echo    - Read CLIENT_GUIDE.md for full instructions
echo    - شغّل START_HERE.bat لعرض جميع المعلومات
echo    - Run START_HERE.bat to view all information
echo.
echo ════════════════════════════════════════════════════════════
echo.

timeout /t 15
exit /b 0

REM ===========================================================
REM الخطأ - Error Handler
REM ===========================================================
:error
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║              ❌ فشل التثبيت - Setup Failed           ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo يرجى مراجعة الأخطاء أعلاه وإعادة المحاولة
echo Please review the errors above and try again
echo.
echo للمساعدة - For Help:
echo    راجع CLIENT_GUIDE.md
echo    Review CLIENT_GUIDE.md
echo.
pause
exit /b 1
