<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Type;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    
        // تفريغ جدول المستخدمين فقط
        \DB::table('users')->truncate();
        
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        // إنشاء مستخدم افتراضي
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'), // كلمة المرور: password123
        ]);
        
        // $this->call(TypeSeeder::class);   
        // $this->call(CategorySeeder::class);
        // $this->call(RequestSeeder::class);
        // $this->call(LogSeeder::class);
    }
}
