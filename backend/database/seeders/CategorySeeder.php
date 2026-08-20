<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Tanaman Hias', 'slug' => 'tanaman-hias', 'icon' => '🪴'],
            ['name' => 'Sayuran & Herbal', 'slug' => 'sayuran-herbal', 'icon' => '🥬'],
            ['name' => 'Buah', 'slug' => 'buah', 'icon' => '🍅'],
            ['name' => 'Media Tanam', 'slug' => 'media-tanam', 'icon' => '🪨'],
            ['name' => 'Pupuk & Nutrisi', 'slug' => 'pupuk-nutrisi', 'icon' => '🧪'],
            ['name' => 'Peralatan Berkebun', 'slug' => 'peralatan', 'icon' => '🛠️'],
            ['name' => 'Pot & Dekorasi', 'slug' => 'pot-dekorasi', 'icon' => '🏺'],
        ];

        foreach ($categories as $i => $category) {
            Category::firstOrCreate(
                ['slug' => $category['slug']],
                array_merge($category, ['sort_order' => $i]),
            );
        }
    }
}
