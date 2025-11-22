# 🚗 نظام إدارة معرض السيارات
# Car Dealership Management System

نظام متكامل لإدارة معارض السيارات مبني على **Laravel** (Backend) و **React** (Frontend)، مع نظام تحديث تلقائي يعمل بدون الحاجة لـ Node.js أو Git على جهاز العميل.

---

## ✨ المميزات الرئيسية

### 🎯 إدارة شاملة
- ✅ إدارة السيارات (إضافة، تعديل، بيع)
- ✅ إدارة العملاء
- ✅ إدارة الفواتير والمدفوعات
- ✅ إدارة المصروفات (مصروفات السيارات ومصروفات المعرض)
- ✅ إدارة الحسابات والسحوبات
- ✅ تقارير مفصلة

### 🔄 نظام التحديث التلقائي
- ✅ تحديث بضغطة زر واحدة (update.bat)
- ✅ لا يحتاج Node.js أو npm على جهاز العميل
- ✅ Git Portable مدمج في المشروع
- ✅ نسخ احتياطي تلقائي قبل كل تحديث
- ✅ تسجيل كامل لجميع العمليات
- ✅ إدارة الإصدارات التلقائية

### 🛡️ الأمان والحماية
- ✅ نسخ احتياطية تلقائية لقاعدة البيانات
- ✅ تسجيل شامل للعمليات (Logging)
- ✅ إمكانية الاسترجاع الكامل
- ✅ حماية البيانات الحساسة

---

## 🚀 البدء السريع

### للعميل (أول مرة):

```bash
# 1. فك ضغط المشروع
# 2. شغّل ملف التثبيت
INSTALL.bat

# 3. اتبع التعليمات
# 4. شغّل الخادم
cd Backend
php artisan serve

# 5. افتح المتصفح
http://localhost:8000
```

### للمطور:

```bash
# 1. استنساخ المشروع
git clone https://github.com/username/car-dealer-ship.git

# 2. تثبيت Backend
cd Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate

# 3. تثبيت Frontend
cd ../frontend
npm install
npm run dev

# 4. بناء للإنتاج
npm run build
```

---

## 📁 هيكل المشروع

```
car-dealer-ship/
├── 🔄 update.bat                  # ملف التحديث الرئيسي
├── 📦 INSTALL.bat                 # ملف التثبيت الأولي
├── 📄 START_HERE.bat              # معلومات سريعة
├── 📊 version.json                # معلومات الإصدار
├── 📁 git/                        # Git Portable (مدمج)
├── 📁 logs/                       # سجلات التحديث
├── 📁 backups/                    # نسخ احتياطية
├── 📁 Backend/                    # Laravel Backend
│   ├── app/
│   │   ├── Console/Commands/
│   │   │   └── DatabaseBackup.php
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── CarController.php
│   │   │   ├── InvoiceController.php
│   │   │   ├── UpdateSystemController.php
│   │   │   └── ...
│   │   └── Models/
│   │       ├── Car.php
│   │       ├── Client.php
│   │       ├── Invoice.php
│   │       └── ...
│   ├── routes/
│   │   └── api.php
│   └── resources/views/admin/
│       └── update-system.blade.php
├── 📁 frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── Pages/
│   │   ├── services/
│   │   └── ...
│   └── dist/                      # ✅ مرفوع على GitHub
└── 📚 Documentation/
    ├── DEVELOPER_GUIDE.md         # دليل المطور
    ├── CLIENT_GUIDE.md            # دليل العميل
    ├── GIT_PORTABLE_SETUP.md      # إعداد Git
    ├── README_UPDATE_SYSTEM.md    # نظام التحديث
    ├── QUICK_START.md             # البدء السريع
    └── CHANGELOG.md               # سجل الإصدارات
```

---

## 🛠️ المتطلبات

### على جهاز المطور:
- PHP >= 8.1
- Composer
- Node.js & npm
- MySQL/MariaDB
- Git

### على جهاز العميل:
- PHP >= 8.1
- Composer
- MySQL/MariaDB
- ❌ **لا يحتاج** Node.js
- ❌ **لا يحتاج** Git مثبت
- ❌ **لا يحتاج** معرفة تقنية

---

## 📖 التوثيق

### للعميل:
1. **[CLIENT_GUIDE.md](CLIENT_GUIDE.md)** - دليل شامل للعميل
   - طريقة التحديث
   - حل المشاكل
   - الأسئلة الشائعة

2. **[QUICK_START.md](QUICK_START.md)** - دليل البدء السريع
   - خطوات سريعة للبدء
   - الملفات المهمة

### للمطور:
1. **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - دليل كامل للمطور
   - سير العمل اليومي
   - البناء والرفع
   - استكشاف الأخطاء

2. **[GIT_PORTABLE_SETUP.md](GIT_PORTABLE_SETUP.md)** - إعداد Git Portable
   - التحميل والتثبيت
   - إعداد GitHub
   - الاختبار

3. **[README_UPDATE_SYSTEM.md](README_UPDATE_SYSTEM.md)** - نظام التحديث
   - شرح شامل للنظام
   - المميزات والإمكانيات
   - API Endpoints

### للجميع:
1. **[CHANGELOG.md](CHANGELOG.md)** - سجل الإصدارات
   - التغييرات في كل إصدار
   - الميزات الجديدة
   - الإصلاحات

---

## 🔄 كيفية التحديث

### للعميل (بسيط جداً):

```
1. دبل كليك على: update.bat
2. انتظر 2-5 دقائق
3. ✅ انتهى!
```

**أو** من المتصفح:
```
http://localhost:8000/api/system/update
```

### للمطور (سير عمل يومي):

```bash
# 1. التطوير
cd frontend
npm run dev

# 2. البناء
npm run build

# 3. الرفع
cd ..
git add .
git commit -m "Update: وصف التحديث"
git push origin main

# ✅ العميل يمكنه الآن التحديث
```

---

## 🎯 الميزات التقنية

### Backend (Laravel):
- RESTful API
- JWT Authentication
- Eloquent ORM
- Database Migrations & Seeders
- Soft Deletes
- Custom Artisan Commands
- API Resources
- Form Requests Validation

### Frontend (React):
- React 18
- TypeScript
- Vite
- React Router
- Axios
- TailwindCSS
- i18next (دعم متعدد اللغات)

### نظام التحديث:
- Git Portable Integration
- Automatic Database Backup
- Comprehensive Logging
- Version Management
- Error Handling
- Rollback Support

---

## 🔌 API Endpoints

### المصادقة (Authentication):
```
POST   /api/login
POST   /api/register
POST   /api/logout
GET    /api/me
POST   /api/refresh
```

### إدارة البيانات:
```
CRUD   /api/cars
CRUD   /api/clients
CRUD   /api/invoices
CRUD   /api/payments
CRUD   /api/car-expenses
CRUD   /api/dealership-expenses
CRUD   /api/accounts
CRUD   /api/account-withdrawals
```

### نظام التحديث:
```
GET    /api/system/update
POST   /api/system/update/run
POST   /api/system/update/backup
GET    /api/system/update/version
GET    /api/system/update/logs
```

---

## 🗄️ قاعدة البيانات

### الجداول الرئيسية:
- `users` - المستخدمين
- `cars` - السيارات
- `car_models` - موديلات السيارات
- `makes` - الماركات
- `clients` - العملاء
- `invoices` - الفواتير
- `payments` - المدفوعات
- `car_expenses` - مصروفات السيارات
- `dealership_expenses` - مصروفات المعرض
- `accounts` - الحسابات
- `account_withdrawals` - السحوبات

---

## 🔐 الأمان

### حماية البيانات:
- ✅ نسخ احتياطية تلقائية قبل كل تحديث
- ✅ تخزين آمن لكلمات المرور (Hashing)
- ✅ JWT Tokens للمصادقة
- ✅ Validation شامل للمدخلات
- ✅ CORS Configuration

### السجلات:
- ✅ تسجيل جميع عمليات التحديث
- ✅ تتبع الأخطاء
- ✅ تاريخ العمليات

---

## 🚨 استكشاف الأخطاء

### المشكلة: "لا يعمل update.bat"
```
الحل:
1. تحقق من وجود git/bin/git.exe
2. راجع GIT_PORTABLE_SETUP.md
3. تحقق من الاتصال بالإنترنت
```

### المشكلة: "خطأ في قاعدة البيانات"
```
الحل:
1. راجع Backend/.env
2. تأكد من تشغيل MySQL
3. تحقق من بيانات الاتصال
```

### المشكلة: "الواجهة لا تظهر"
```
الحل:
1. تأكد من وجود frontend/dist
2. للمطور: قم بـ npm run build
3. تحقق من صلاحيات الملفات
```

للمزيد: راجع [CLIENT_GUIDE.md](CLIENT_GUIDE.md) أو [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)

---

## 📞 الدعم

### للأسئلة التقنية:
- راجع الأدلة في مجلد Documentation
- افتح Issue على GitHub
- اتصل بالدعم الفني

### للمساهمة:
```bash
1. Fork المشروع
2. إنشاء Branch (git checkout -b feature/amazing-feature)
3. Commit التغييرات (git commit -m 'Add amazing feature')
4. Push إلى Branch (git push origin feature/amazing-feature)
5. فتح Pull Request
```

---

## 📜 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE)

---

## 👥 الفريق

- **المطور الرئيسي:** [اسمك]
- **Backend:** Laravel
- **Frontend:** React + TypeScript
- **النظام:** Windows (XAMPP)

---

## 📊 الإصدار الحالي

```
Version: 1.0.0
Release Date: 2025-01-22
Last Update: نظام التحديث التلقائي - Initial Release
```

راجع [CHANGELOG.md](CHANGELOG.md) لتاريخ الإصدارات الكامل.

---

## 🎉 شكر خاص

- Laravel Framework
- React.js
- Git for Windows (Git Portable)
- جميع المساهمين والمستخدمين

---

## 🔗 روابط مهمة

- **المشروع على GitHub:** [github.com/username/car-dealer-ship](https://github.com/username/car-dealer-ship)
- **التوثيق الكامل:** راجع مجلد Documentation
- **تقرير مشكلة:** افتح Issue على GitHub

---

## ⚡ ملاحظات سريعة

### للعميل:
```
✅ فقط اضغط INSTALL.bat عند أول استخدام
✅ استخدم update.bat للتحديثات
✅ اقرأ CLIENT_GUIDE.md للتفاصيل
```

### للمطور:
```
✅ npm run build قبل كل git push
✅ لا تنسى رفع dist/
✅ اقرأ DEVELOPER_GUIDE.md للسير الصحيح
```

---

**🚗 نظام إدارة معارض السيارات - صُمم ليكون سهلاً وقوياً في نفس الوقت!**

<div align="center">
  
**[التوثيق](CLIENT_GUIDE.md)** • 
**[دليل المطور](DEVELOPER_GUIDE.md)** • 
**[البدء السريع](QUICK_START.md)** • 
**[الإصدارات](CHANGELOG.md)**

</div>
