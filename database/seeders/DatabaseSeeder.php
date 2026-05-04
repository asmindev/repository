<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run seeders in order
        $this->call([
            RolePermissionSeeder::class,
            DepartmentSeeder::class,
            WorkCategorySeeder::class,
            UserSeeder::class,
        ]);
    }
}
