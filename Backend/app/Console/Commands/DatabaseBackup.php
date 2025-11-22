<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class DatabaseBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:backup {--file= : Custom backup file path}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backup the database to SQL file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $database = Config::get('database.connections.mysql.database');
        $username = Config::get('database.connections.mysql.username');
        $password = Config::get('database.connections.mysql.password');
        $host = Config::get('database.connections.mysql.host');
        $port = Config::get('database.connections.mysql.port', 3306);

        // تحديد مسار الملف
        $filename = $this->option('file');
        if (!$filename) {
            $filename = storage_path('backups/backup_' . date('Y-m-d_H-i-s') . '.sql');
        }

        // إنشاء المجلد إذا لم يكن موجود
        $directory = dirname($filename);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $this->info("Starting database backup...");
        $this->info("Database: {$database}");
        $this->info("Output file: {$filename}");

        try {
            // محاولة استخدام mysqldump إذا كان متاحاً
            $mysqldumpPath = $this->findMysqldump();
            
            if ($mysqldumpPath) {
                $command = sprintf(
                    '"%s" --user=%s --password=%s --host=%s --port=%d %s > "%s" 2>&1',
                    $mysqldumpPath,
                    escapeshellarg($username),
                    escapeshellarg($password),
                    escapeshellarg($host),
                    $port,
                    escapeshellarg($database),
                    $filename
                );

                exec($command, $output, $returnVar);

                if ($returnVar === 0 && file_exists($filename)) {
                    $size = filesize($filename);
                    $this->info("✅ Backup completed successfully!");
                    $this->info("File size: " . round($size / 1024, 2) . " KB");
                    return Command::SUCCESS;
                }
            }

            // Fallback: استخدام طريقة بديلة عبر PHP
            $this->warn("mysqldump not found, using PHP fallback method...");
            $this->backupWithPHP($filename);
            
            $this->info("✅ Backup completed successfully using PHP method!");
            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error("❌ Backup failed: " . $e->getMessage());
            return Command::FAILURE;
        }
    }

    /**
     * البحث عن mysqldump في المسارات الشائعة
     */
    private function findMysqldump()
    {
        $paths = [
            'C:\\xampp\\mysql\\bin\\mysqldump.exe',
            'C:\\wamp64\\bin\\mysql\\mysql8.0.27\\bin\\mysqldump.exe',
            'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe',
            'mysqldump', // في حالة وجوده في PATH
        ];

        foreach ($paths as $path) {
            if (file_exists($path) || $this->commandExists($path)) {
                return $path;
            }
        }

        return null;
    }

    /**
     * التحقق من وجود أمر في النظام
     */
    private function commandExists($command)
    {
        $return = shell_exec(sprintf("where %s 2>nul", escapeshellarg($command)));
        return !empty($return);
    }

    /**
     * عمل نسخة احتياطية باستخدام PHP
     */
    private function backupWithPHP($filename)
    {
        $tables = DB::select('SHOW TABLES');
        $database = Config::get('database.connections.mysql.database');
        
        $sql = "-- Database Backup\n";
        $sql .= "-- Generated: " . date('Y-m-d H:i:s') . "\n";
        $sql .= "-- Database: {$database}\n\n";
        $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

        foreach ($tables as $table) {
            $tableName = array_values((array)$table)[0];
            
            // الحصول على بنية الجدول
            $createTable = DB::select("SHOW CREATE TABLE `{$tableName}`");
            $sql .= "-- Table: {$tableName}\n";
            $sql .= "DROP TABLE IF EXISTS `{$tableName}`;\n";
            $sql .= $createTable[0]->{'Create Table'} . ";\n\n";

            // الحصول على البيانات
            $rows = DB::table($tableName)->get();
            
            if ($rows->count() > 0) {
                foreach ($rows as $row) {
                    $values = array_map(function($value) {
                        return $value === null ? 'NULL' : "'" . addslashes($value) . "'";
                    }, (array)$row);
                    
                    $sql .= "INSERT INTO `{$tableName}` VALUES (" . implode(', ', $values) . ");\n";
                }
                $sql .= "\n";
            }
        }

        $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";

        file_put_contents($filename, $sql);
    }
}
