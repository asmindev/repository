<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Get departments
        $departments = \App\Models\Department::all();

        // ─── Create Admin User ───────────────────────────────────

        $admin = User::firstOrCreate(
            ['email' => 'admin@kti.local'],
            [
                'name' => 'Administrator',
                'password' => bcrypt('password'),
                'nidn' => '999999999',
                'is_active' => true,
            ]
        );
        $admin->assignRole('admin');

        // ─── Create Lecturer Users ───────────────────────────────

        $lecturers = [
            [
                'name' => 'Dr. Budi Santoso',
                'email' => 'budi.santoso@kti.local',
                'nidn' => '0012096101',
            ],
            [
                'name' => 'Prof. Dr. Siti Nurhaliza',
                'email' => 'siti.nurhaliza@kti.local',
                'nidn' => '0015017301',
            ],
            [
                'name' => 'Dr. Ahmad Wijaya',
                'email' => 'ahmad.wijaya@kti.local',
                'nidn' => '0020068302',
            ],
            [
                'name' => 'Dr. Ratna Kumala',
                'email' => 'ratna.kumala@kti.local',
                'nidn' => '0025106403',
            ],
        ];

        foreach ($lecturers as $lecturer) {
            $user = User::firstOrCreate(
                ['email' => $lecturer['email']],
                [
                    'name' => $lecturer['name'],
                    'password' => bcrypt('password'),
                    'nidn' => $lecturer['nidn'],
                    'department_id' => $departments->random()->id,
                    'is_active' => true,
                ]
            );
            $user->assignRole('lecturer');
        }

        // ─── Create Student Users ────────────────────────────────

        $students = [
            [
                'name' => 'Muhammad Rizki',
                'email' => 'Muhammad.rizki@student.kti.local',
                'nim' => '2021001',
            ],
            [
                'name' => 'Siti Aminah',
                'email' => 'siti.aminah@student.kti.local',
                'nim' => '2021002',
            ],
            [
                'name' => 'Bambang Suryanto',
                'email' => 'bambang.suryanto@student.kti.local',
                'nim' => '2021003',
            ],
            [
                'name' => 'Dewi Hartini',
                'email' => 'dewi.hartini@student.kti.local',
                'nim' => '2021004',
            ],
            [
                'name' => 'Hendra Kusuma',
                'email' => 'hendra.kusuma@student.kti.local',
                'nim' => '2021005',
            ],
            [
                'name' => 'Linda Saputri',
                'email' => 'linda.saputri@student.kti.local',
                'nim' => '2021006',
            ],
            [
                'name' => 'Rinto Harahap',
                'email' => 'rinto.harahap@student.kti.local',
                'nim' => '2021007',
            ],
            [
                'name' => 'Eka Putri',
                'email' => 'eka.putri@student.kti.local',
                'nim' => '2021008',
            ],
        ];

        foreach ($students as $student) {
            $user = User::firstOrCreate(
                ['email' => $student['email']],
                [
                    'name' => $student['name'],
                    'password' => bcrypt('password'),
                    'nim' => $student['nim'],
                    'department_id' => $departments->random()->id,
                    'is_active' => true,
                ]
            );
            $user->assignRole('student');
        }
    }
}
