<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Create Faculties ───────────────────────────────────

        $engineering = Faculty::firstOrCreate([
            'slug' => 'teknik',
        ], [
            'name' => 'Fakultas Teknik',
            'description' => 'Fakultas yang fokus pada pendidikan teknologi dan teknik.',
        ]);

        $science = Faculty::firstOrCreate([
            'slug' => 'sains',
        ], [
            'name' => 'Fakultas Sains',
            'description' => 'Fakultas yang fokus pada pendidikan sains.',
        ]);

        $business = Faculty::firstOrCreate([
            'slug' => 'bisnis',
        ], [
            'name' => 'Fakultas Bisnis',
            'description' => 'Fakultas yang fokus pada pendidikan bisnis dan manajemen.',
        ]);

        // ─── Create Departments under Engineering ────────────────

        Department::firstOrCreate([
            'slug' => 'teknik-informatika',
        ], [
            'faculty_id' => $engineering->id,
            'name' => 'Program Studi Teknik Informatika',
            'description' => 'Program studi yang mengajarkan ilmu komputer dan pemrograman.',
        ]);

        Department::firstOrCreate([
            'slug' => 'teknik-elektro',
        ], [
            'faculty_id' => $engineering->id,
            'name' => 'Program Studi Teknik Elektro',
            'description' => 'Program studi yang mengajarkan kelistrikan dan elektronika.',
        ]);

        Department::firstOrCreate([
            'slug' => 'teknik-mesin',
        ], [
            'faculty_id' => $engineering->id,
            'name' => 'Program Studi Teknik Mesin',
            'description' => 'Program studi yang mengajarkan mekanika dan permesinan.',
        ]);

        // ─── Create Departments under Science ────────────────────

        Department::firstOrCreate([
            'slug' => 'matematika',
        ], [
            'faculty_id' => $science->id,
            'name' => 'Program Studi Matematika',
            'description' => 'Program studi yang mengajarkan matematika dan analisis numerik.',
        ]);

        Department::firstOrCreate([
            'slug' => 'fisika',
        ], [
            'faculty_id' => $science->id,
            'name' => 'Program Studi Fisika',
            'description' => 'Program studi yang mengajarkan fisika klasik dan modern.',
        ]);

        // ─── Create Departments under Business ───────────────────

        Department::firstOrCreate([
            'slug' => 'manajemen',
        ], [
            'faculty_id' => $business->id,
            'name' => 'Program Studi Manajemen',
            'description' => 'Program studi yang mengajarkan manajemen bisnis.',
        ]);

        Department::firstOrCreate([
            'slug' => 'akuntansi',
        ], [
            'faculty_id' => $business->id,
            'name' => 'Program Studi Akuntansi',
            'description' => 'Program studi yang mengajarkan akuntansi dan keuangan.',
        ]);
    }
}
