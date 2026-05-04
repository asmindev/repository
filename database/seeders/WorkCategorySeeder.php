<?php

namespace Database\Seeders;

use App\Models\WorkCategory;
use Illuminate\Database\Seeder;

class WorkCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Skripsi',
                'slug' => 'skripsi',
                'description' => 'Karya tulis akhir untuk program sarjana',
            ],
            [
                'name' => 'Tesis',
                'slug' => 'tesis',
                'description' => 'Karya tulis akhir untuk program pascasarjana master',
            ],
            [
                'name' => 'Disertasi',
                'slug' => 'disertasi',
                'description' => 'Karya tulis akhir untuk program doktor',
            ],
            [
                'name' => 'KTI (Karya Tulis Ilmiah)',
                'slug' => 'kti',
                'description' => 'Karya tulis ilmiah selain skripsi/tesis/disertasi',
            ],
            [
                'name' => 'Jurnal',
                'slug' => 'jurnal',
                'description' => 'Artikel yang dipublikasikan di jurnal ilmiah',
            ],
            [
                'name' => 'Makalah Konferensi',
                'slug' => 'makalah-konferensi',
                'description' => 'Makalah yang dipresentasikan di konferensi ilmiah',
            ],
        ];

        foreach ($categories as $category) {
            WorkCategory::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
