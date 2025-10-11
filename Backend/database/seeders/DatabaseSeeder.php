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
    
    \DB::table('logs')->truncate();  
    \DB::table('requests')->truncate();
    \DB::table('categories')->truncate();    
    \DB::table('types')->truncate();
    \DB::table('users')->truncate();
        // Add other truncates as needed
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    $this->call(TypeSeeder::class);   
    $this->call(CategorySeeder::class);
    $this->call(RequestSeeder::class);
    $this->call(LogSeeder::class);
    }
}
