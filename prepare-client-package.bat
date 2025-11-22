@echo off
chcp 65001 > nul
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║         تجهيز الحزمة للزبون - Prepare Client Package     ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

REM إنشاء مجلد مؤقت للحزمة
set "TEMP_DIR=%TEMP%\car-dealer-ship-client"
set "ZIP_NAME=car-dealer-ship-v1.0-client.zip"

echo [1/5] 📁 إنشاء مجلد مؤقت...
if exist "%TEMP_DIR%" rmdir /s /q "%TEMP_DIR%"
mkdir "%TEMP_DIR%"
echo    ✅ تم إنشاء المجلد المؤقت
echo.

echo [2/5] 📋 نسخ الملفات الأساسية...
echo    جارِ النسخ... يرجى الانتظار
xcopy /E /I /Y /Q "%PROJECT_DIR%Backend" "%TEMP_DIR%\Backend" > nul
xcopy /E /I /Y /Q "%PROJECT_DIR%frontend" "%TEMP_DIR%\frontend" > nul
xcopy /E /I /Y /Q "%PROJECT_DIR%git" "%TEMP_DIR%\git" > nul

REM نسخ الملفات الفردية
copy /Y "%PROJECT_DIR%update.bat" "%TEMP_DIR%\" > nul
copy /Y "%PROJECT_DIR%INSTALL.bat" "%TEMP_DIR%\" > nul
copy /Y "%PROJECT_DIR%START_HERE.bat" "%TEMP_DIR%\" > nul
copy /Y "%PROJECT_DIR%version.json" "%TEMP_DIR%\" > nul
copy /Y "%PROJECT_DIR%.gitignore" "%TEMP_DIR%\" > nul

REM نسخ التوثيق
copy /Y "%PROJECT_DIR%README.md" "%TEMP_DIR%\" > nul
copy /Y "%PROJECT_DIR%CLIENT_GUIDE.md" "%TEMP_DIR%\" > nul
copy /Y "%PROJECT_DIR%QUICK_START.md" "%TEMP_DIR%\" > nul
copy /Y "%PROJECT_DIR%CHANGELOG.md" "%TEMP_DIR%\" > nul

echo    ✅ تم نسخ الملفات الأساسية
echo.

echo [3/5] 🗑️  حذف الملفات غير الضرورية...
REM حذف node_modules
if exist "%TEMP_DIR%\frontend\node_modules" (
    echo    حذف frontend\node_modules...
    rmdir /s /q "%TEMP_DIR%\frontend\node_modules"
)

REM حذف vendor
if exist "%TEMP_DIR%\Backend\vendor" (
    echo    حذف Backend\vendor...
    rmdir /s /q "%TEMP_DIR%\Backend\vendor"
)

REM حذف ملفات غير مهمة
if exist "%TEMP_DIR%\Backend\storage\logs\*.*" del /q "%TEMP_DIR%\Backend\storage\logs\*.*" > nul 2>&1
if exist "%TEMP_DIR%\Backend\.env" del /q "%TEMP_DIR%\Backend\.env" > nul 2>&1

echo    ✅ تم تنظيف الملفات
echo.

echo [4/5] 📝 إنشاء ملف تعليمات للزبون...
(
echo ═══════════════════════════════════════════════════════════
echo      تعليمات التثبيت - Installation Instructions
echo ═══════════════════════════════════════════════════════════
echo.
echo 1. فك ضغط هذا الملف إلى المكان المطلوب
echo.
echo 2. شغّل ملف: INSTALL.bat
echo    - سيقوم بفحص المتطلبات
echo    - سيثبت مكتبات PHP
echo    - سيطلب منك إعداد قاعدة البيانات
echo.
echo 3. عدّل ملف: Backend\.env
echo    - DB_DATABASE=اسم_قاعدة_البيانات
echo    - DB_USERNAME=المستخدم
echo    - DB_PASSWORD=كلمة_المرور
echo.
echo 4. شغّل الخادم:
echo    cd Backend
echo    php artisan serve
echo.
echo 5. افتح المتصفح:
echo    http://localhost:8000
echo.
echo ═══════════════════════════════════════════════════════════
echo      للتحديثات المستقبلية - For Future Updates
echo ═══════════════════════════════════════════════════════════
echo.
echo فقط اضغط دبل كليك على: update.bat
echo Just double click on: update.bat
echo.
echo للمزيد من المعلومات، اقرأ: CLIENT_GUIDE.md
echo For more information, read: CLIENT_GUIDE.md
echo.
) > "%TEMP_DIR%\اقرأني_أولاً.txt"

echo    ✅ تم إنشاء ملف التعليمات
echo.

echo [5/5] 📦 ضغط الحزمة...
echo    جارِ الضغط... قد يستغرق دقيقة

REM استخدام PowerShell للضغط
powershell -Command "Compress-Archive -Path '%TEMP_DIR%\*' -DestinationPath '%PROJECT_DIR%\%ZIP_NAME%' -Force" 2>nul

if exist "%PROJECT_DIR%\%ZIP_NAME%" (
    echo    ✅ تم إنشاء الملف المضغوط
    echo.
    echo ╔═══════════════════════════════════════════════════════════╗
    echo ║              ✅ اكتمل التجهيز بنجاح!                     ║
    echo ╚═══════════════════════════════════════════════════════════╝
    echo.
    echo 📦 ملف الحزمة: %ZIP_NAME%
    echo 📁 الموقع: %PROJECT_DIR%
    echo 📊 الحجم: 
    for %%A in ("%PROJECT_DIR%\%ZIP_NAME%") do echo    %%~zA bytes
    echo.
    echo 📤 الآن يمكنك إرسال هذا الملف للزبون
    echo.
    echo 📋 ملاحظة: الزبون يحتاج فقط:
    echo    - PHP ^>= 8.1
    echo    - Composer
    echo    - MySQL/MariaDB
    echo    ❌ لا يحتاج Node.js أو Git!
    echo.
) else (
    echo    ❌ فشل إنشاء الملف المضغوط
    echo    يرجى ضغط المجلد يدوياً: %TEMP_DIR%
)

REM تنظيف المجلد المؤقت
echo تنظيف الملفات المؤقتة...
rmdir /s /q "%TEMP_DIR%" 2>nul

echo.
pause
