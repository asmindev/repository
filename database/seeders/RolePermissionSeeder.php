<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ─── Create Permissions ─────────────────────────────────
        $permissions = [
            // User Management (Admin only)
            'user.view-any',
            'user.create',
            'user.update',
            'user.delete',

            // Work Management
            'work.view-any',    // Admin & Dosen: lihat semua karya
            'work.view-own',    // Mahasiswa: lihat karya sendiri
            'work.create',      // Mahasiswa & Admin
            'work.update-own',  // Mahasiswa: edit karya sendiri (draft)
            'work.delete-own',  // Mahasiswa & Admin: hapus draft
            'work.submit',      // Mahasiswa: submit ke review
            'work.review',      // Dosen & Admin: review karya
            'work.approve',     // Dosen & Admin: approve karya
            'work.reject',      // Dosen & Admin: reject karya
            'work.publish',     // Admin: publish karya
            'work.assign-reviewer', // Admin: assign dosen reviewer

            // Reports & Settings (Admin only)
            'report.export',
            'setting.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ─── Create Roles & Assign Permissions ──────────────────

        // Admin: ALL permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions(Permission::all());

        // Lecturer (Dosen): View & Review permissions
        $lecturerRole = Role::firstOrCreate(['name' => 'lecturer']);
        $lecturerRole->syncPermissions([
            'work.view-any',
            'work.view-own',
            'work.review',
            'work.approve',
            'work.reject',
        ]);

        // Student (Mahasiswa): Own work management
        $studentRole = Role::firstOrCreate(['name' => 'student']);
        $studentRole->syncPermissions([
            'work.view-own',
            'work.create',
            'work.update-own',
            'work.delete-own',
            'work.submit',
        ]);
    }
}
