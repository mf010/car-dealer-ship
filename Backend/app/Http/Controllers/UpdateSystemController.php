<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class UpdateSystemController extends Controller
{
    /**
     * عرض صفحة التحديث
     */
    public function index()
    {
        $currentVersion = $this->getCurrentVersion();
        $updateLogs = $this->getRecentLogs(10);
        $lastBackup = $this->getLastBackup();
        
        return view('admin.update-system', compact('currentVersion', 'updateLogs', 'lastBackup'));
    }

    /**
     * تشغيل عملية التحديث
     */
    public function runUpdate(Request $request)
    {
        try {
            set_time_limit(300); // 5 دقائق

            $logFile = $this->createLogFile();
            // Initialize progress file
            $progressFile = base_path('../logs/update_progress.txt');
            \Illuminate\Support\Facades\File::put($progressFile, "0\n");
            
            // تسجيل بداية التحديث
            $this->logMessage($logFile, "Starting update process...");
            
            // 1. النسخ الاحتياطي
            $this->logMessage($logFile, "Step 1: Creating database backup...");
            $backupResult = $this->createBackup();
            $this->logMessage($logFile, $backupResult);

            // 2. تشغيل ملف update.bat
            $this->logMessage($logFile, "Step 2: Running update.bat...");
            $updateScriptPath = base_path('../update.bat');
            
            if (File::exists($updateScriptPath)) {
                // تشغيل الملف في الخلفية
                if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                    // Start update script; it will update the progress file
                    pclose(popen("start /B \"\" \"$updateScriptPath\"", "r"));
                    $message = "Update script started successfully. The system will update in the background.";
                } else {
                    exec("bash $updateScriptPath > /dev/null 2>&1 &");
                    $message = "Update script started successfully.";
                }
                
                $this->logMessage($logFile, $message);
                
                return response()->json([
                    'success' => true,
                    'message' => 'تم بدء عملية التحديث بنجاح! سيتم تحديث النظام خلال دقائق.',
                    'log_file' => basename($logFile),
                    'progress' => 0
                ]);
            } else {
                throw new \Exception("Update script not found at: $updateScriptPath");
            }

        } catch (\Exception $e) {
            Log::error('Update failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'فشل التحديث: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * الحصول على نسبة تقدم التحديث
     */
    public function getUpdateProgress()
    {
        $progressFile = base_path('../logs/update_progress.txt');
        $percent = 0;
        if (File::exists($progressFile)) {
            $content = trim(File::get($progressFile));
            if (is_numeric($content)) {
                $percent = (int) $content;
            }
        }

        // Provide a simple step label based on percent
        $step = match (true) {
            $percent < 1 => 'Starting',
            $percent < 25 => 'Backing up',
            $percent < 50 => 'Downloading updates',
            $percent < 75 => 'Updating database',
            $percent < 100 => 'Updating packages',
            default => 'Completed',
        };

        return response()->json([
            'success' => true,
            'percent' => $percent,
            'step' => $step,
        ]);
    }

    /**
     * إنشاء نسخة احتياطية يدوية
     */
    public function createManualBackup()
    {
        try {
            $result = $this->createBackup();
            
            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء النسخة الاحتياطية بنجاح',
                'details' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل إنشاء النسخة الاحتياطية: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * الحصول على معلومات الإصدار الحالي
     */
    public function getVersionInfo()
    {
        $version = $this->getCurrentVersion();
        
        return response()->json([
            'success' => true,
            'version' => $version
        ]);
    }

    /**
     * الحصول على سجلات التحديث
     */
    public function getLogs(Request $request)
    {
        $limit = $request->input('limit', 20);
        $logs = $this->getRecentLogs($limit);
        
        return response()->json([
            'success' => true,
            'logs' => $logs
        ]);
    }

    /**
     * Helper: إنشاء نسخة احتياطية
     */
    private function createBackup()
    {
        $backupDir = base_path('../backups');
        if (!File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }

        $filename = $backupDir . '/db_backup_' . date('Y-m-d_H-i-s') . '.sql';
        
        Artisan::call('db:backup', ['--file' => $filename]);
        
        if (File::exists($filename)) {
            $size = File::size($filename);
            return "Backup created: $filename (Size: " . round($size / 1024, 2) . " KB)";
        }
        
        throw new \Exception("Backup file was not created");
    }

    /**
     * Helper: الحصول على الإصدار الحالي
     */
    private function getCurrentVersion()
    {
        $versionFile = base_path('../version.json');
        
        if (File::exists($versionFile)) {
            $content = File::get($versionFile);
            return json_decode($content, true);
        }
        
        return [
            'version' => 'unknown',
            'updated_at' => 'N/A',
            'last_commit' => 'N/A'
        ];
    }

    /**
     * Helper: الحصول على آخر سجلات التحديث
     */
    private function getRecentLogs($limit = 10)
    {
        $logsDir = base_path('../logs');
        
        if (!File::exists($logsDir)) {
            return [];
        }

        $files = File::files($logsDir);
        $logs = [];

        // ترتيب الملفات حسب التاريخ
        usort($files, function($a, $b) {
            return File::lastModified($b) - File::lastModified($a);
        });

        foreach (array_slice($files, 0, $limit) as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'log') {
                $logs[] = [
                    'filename' => basename($file),
                    'date' => date('Y-m-d H:i:s', File::lastModified($file)),
                    'size' => round(File::size($file) / 1024, 2) . ' KB',
                    'path' => $file
                ];
            }
        }

        return $logs;
    }

    /**
     * Helper: الحصول على آخر نسخة احتياطية
     */
    private function getLastBackup()
    {
        $backupDir = base_path('../backups');
        
        if (!File::exists($backupDir)) {
            return null;
        }

        $files = File::files($backupDir);
        
        if (empty($files)) {
            return null;
        }

        // ترتيب الملفات حسب التاريخ
        usort($files, function($a, $b) {
            return File::lastModified($b) - File::lastModified($a);
        });

        $latestBackup = $files[0];

        return [
            'filename' => basename($latestBackup),
            'date' => date('Y-m-d H:i:s', File::lastModified($latestBackup)),
            'size' => round(File::size($latestBackup) / 1024, 2) . ' KB'
        ];
    }

    /**
     * Helper: إنشاء ملف لوج جديد
     */
    private function createLogFile()
    {
        $logsDir = base_path('../logs');
        
        if (!File::exists($logsDir)) {
            File::makeDirectory($logsDir, 0755, true);
        }

        return $logsDir . '/update_' . date('Ymd_His') . '.log';
    }

    /**
     * Helper: كتابة رسالة في اللوج
     */
    private function logMessage($logFile, $message)
    {
        $timestamp = date('Y-m-d H:i:s');
        File::append($logFile, "[$timestamp] $message\n");
    }
}
