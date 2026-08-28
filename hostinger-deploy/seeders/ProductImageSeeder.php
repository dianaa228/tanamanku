<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductImageSeeder extends Seeder
{
    // Warna placeholder per kategori
    private array $colors = [
        'tanaman-hias'   => ['bg' => '2d6a4f', 'emoji' => '🪴', 'label' => 'Tanaman Hias'],
        'sayuran-herbal' => ['bg' => '588157', 'emoji' => '🥬', 'label' => 'Sayuran'],
        'buah'           => ['bg' => 'e63946', 'emoji' => '🍅', 'label' => 'Buah'],
        'media-tanam'    => ['bg' => '6b705c', 'emoji' => '🪨', 'label' => 'Media Tanam'],
        'pupuk-nutrisi'  => ['bg' => 'bc6c25', 'emoji' => '🧪', 'label' => 'Pupuk'],
        'peralatan'      => ['bg' => '457b9d', 'emoji' => '🛠️', 'label' => 'Peralatan'],
        'pot-dekorasi'   => ['bg' => 'd4a373', 'emoji' => '🏺', 'label' => 'Pot'],
    ];

    public function run(): void
    {
        $products = Product::with('category')->get();

        foreach ($products as $i => $product) {
            $cat = $product->category;
            if (!$cat) continue;

            $color = $this->colors[$cat->slug] ?? ['bg' => '6c757d', 'emoji' => '🌱', 'label' => 'Produk'];

            // Generate placeholder URL via placehold.co
            $encodedName = urlencode($product->name);
            $url = "https://placehold.co/600x600/{$color['bg']}/ffffff?text={$encodedName}";

            ProductImage::firstOrCreate(
                ['product_id' => $product->id, 'sort_order' => 0],
                [
                    'path' => $url,
                    'is_primary' => true,
                ]
            );
        }
    }
}
