<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $stores = Store::all();
        if ($stores->isEmpty()) return;

        $categories = Category::all()->keyBy('slug');

        $products = [
            // ── Green Leaf Nursery (Tanaman Hias) ──
            [
                'store_slug' => 'green-leaf-nursery',
                'category_slug' => 'tanaman-hias',
                'items' => [
                    ['name' => 'Monstera Deliciosa 30cm', 'price' => 85000, 'stock' => 45, 'care_level' => 'mudah', 'description' => 'Monstera Deliciosa sehat dengan daun fenestrasi sempurna. Tinggi ±30cm, cocok untuk dekorasi ruangan.'],
                    ['name' => 'Monstera Variegata 25cm', 'price' => 250000, 'stock' => 12, 'care_level' => 'sedang', 'description' => 'Monstera variegata langka dengan pola daun unik. Tinggi ±25cm, sangat dicari kolektor.'],
                    ['name' => 'Aglonema Red Sumatra', 'price' => 120000, 'stock' => 30, 'care_level' => 'mudah', 'description' => 'Aglonema Red Sumatra dengan warna merah menyala. Cocok untuk indoor, perawatan mudah.'],
                    ['name' => 'Sirih Gading Golden', 'price' => 35000, 'stock' => 60, 'care_level' => 'mudah', 'description' => 'Sirih gading golden, tumbuh rambat. Cocok untuk ditaruh di rak atau digantung.'],
                    ['name' => 'Philodendron Birkin', 'price' => 95000, 'stock' => 20, 'care_level' => 'sedang', 'description' => 'Philodendron Birkin dengan garis-garis putih elegan. Ukuran 20cm, sehat dan subur.'],
                    ['name' => 'Pothos N\'Joy', 'price' => 45000, 'stock' => 35, 'care_level' => 'mudah', 'description' => 'Pothos N\'Joy dengan varian daun hijau-putih. Mudah dirawat, cocok untuk pemula.'],
                ],
            ],
            // ── Urban Farm Jakarta (Sayuran & Herbal) ──
            [
                'store_slug' => 'urban-farm-jakarta',
                'category_slug' => 'sayuran-herbal',
                'items' => [
                    ['name' => 'Bibit Tomat Cherry 50 Biji', 'price' => 15000, 'stock' => 100, 'care_level' => 'sedang', 'description' => 'Bibit tomat cherry unggul, daya kecambah 90%+. Cocok untuk pot atau lahan.'],
                    ['name' => 'Bibit Cabai Rawit 30 Biji', 'price' => 12000, 'stock' => 120, 'care_level' => 'sedang', 'description' => 'Bibit cabai rawit varietas lokal. Pedas dan produktif.'],
                    ['name' => 'Bibit Kemangi 100 Biji', 'price' => 8000, 'stock' => 150, 'care_level' => 'mudah', 'description' => 'Bibit kemangi siap tanam. Tumbuh cepat, panen dalam 20 hari.'],
                    ['name' => 'Bibit Selada Keriting 50 Biji', 'price' => 10000, 'stock' => 80, 'care_level' => 'mudah', 'description' => 'Bibit selada keriting hidroponik. Cocok untuk lahan sempit.'],
                    ['name' => 'Bibit Bayam Merah 100 Biji', 'price' => 8000, 'stock' => 90, 'care_level' => 'mudah', 'description' => 'Bibit bayam merah organik. Cocok untuk hidroponik dan tanah.'],
                ],
            ],
            [
                'store_slug' => 'urban-farm-jakarta',
                'category_slug' => 'media-tanam',
                'items' => [
                    ['name' => 'Media Tanam Premium 10L', 'price' => 25000, 'stock' => 200, 'care_level' => 'mudah', 'description' => 'Campuran cocopeat, perlit, dan sekam. Cocok untuk semua jenis tanaman.'],
                    ['name' => 'Sekam Bakar 5L', 'price' => 15000, 'stock' => 150, 'care_level' => 'mudah', 'description' => 'Sekam bakar steril untuk pencampur media tanam. Mengunci kelembapan.'],
                    ['name' => 'Cocopeat Brick', 'price' => 20000, 'stock' => 100, 'care_level' => 'mudah', 'description' => 'Cocopeat compressed brick, expand hingga 8L saat direndam air.'],
                ],
            ],
            // ── Pot & Dekorasi Bali ──
            [
                'store_slug' => 'pot-dekorasi-bali',
                'category_slug' => 'pot-dekorasi',
                'items' => [
                    ['name' => 'Pot Keramik Putih 15cm', 'price' => 45000, 'stock' => 50, 'care_level' => 'mudah', 'description' => 'Pot keramik handmade Bali warna putih. Diameter 15cm, ada lubang drainase.'],
                    ['name' => 'Pot Terrazzo 20cm', 'price' => 75000, 'stock' => 30, 'care_level' => 'mudah', 'description' => 'Pot terrazzo modern, diameter 20cm. Cocok untuk Monstera dan Philodendron.'],
                    ['name' => 'Pot Gantung Rattan', 'price' => 65000, 'stock' => 25, 'care_level' => 'mudah', 'description' => 'Pot gantung dari rotan asli Bali. Cocok untuk Sirih Gading atau Pothos.'],
                    ['name' => 'Pot Susun 3 Tier', 'price' => 120000, 'stock' => 15, 'care_level' => 'mudah', 'description' => 'Pot susun 3 tingkat dari keramik. Ideals untuk herb garden.'],
                ],
            ],
            // ── Pupuk Nusantara ──
            [
                'store_slug' => 'pupuk-nusantara',
                'category_slug' => 'pupuk-nutrisi',
                'items' => [
                    ['name' => 'Pupuk Organik Granul 1kg', 'price' => 30000, 'stock' => 100, 'care_level' => 'mudah', 'description' => 'Pupuk organik granul NPK 15-15-15. Cocok untuk semua tanaman.'],
                    ['name' => 'Pupuk Kandang Ayam 5kg', 'price' => 35000, 'stock' => 80, 'care_level' => 'mudah', 'description' => 'Pupuk kandang ayam fermentasi. Kaya unsur hara, aman untuk sayuran.'],
                    ['name' => 'Nutrisi Hidroponik AB Mix', 'price' => 45000, 'stock' => 60, 'care_level' => 'sedang', 'description' => 'Nutrisi hidroponik AB Mix untuk sayuran. Larutan 1L, tinggal encerkan.'],
                    ['name' => 'ZPT Pengatur Tumbuh 100ml', 'price' => 28000, 'stock' => 40, 'care_level' => 'sedang', 'description' => 'Zat pengatur tumbuh organik. Memicu pertumbuhan akar dan daun.'],
                ],
            ],
            // ── Taman Seroja (Peralatan) ──
            [
                'store_slug' => 'taman-seroja',
                'category_slug' => 'peralatan',
                'items' => [
                    ['name' => 'Sekop Mini Stainless', 'price' => 25000, 'stock' => 70, 'care_level' => 'mudah', 'description' => 'Sekop mini stainless steel untuk tanaman pot. Ringan dan tahan karat.'],
                    ['name' => 'Sprayer Manual 1L', 'price' => 35000, 'stock' => 50, 'care_level' => 'mudah', 'description' => 'Sprayer manual kapasitas 1L. Cocok untuk menyiram dan aplikasi pupuk cair.'],
                    ['name' => 'Gunting Tanaman Profesional', 'price' => 55000, 'stock' => 40, 'care_level' => 'mudah', 'description' => 'Gunting tanaman stainless steel. Tajam, ergonomis, cocok untuk pruning.'],
                    ['name' => 'Sarung Tangan Berkebun', 'price' => 20000, 'stock' => 80, 'care_level' => 'mudah', 'description' => 'Sarung tangan berkebun dengan grip karet. Nyaman dan melindungi tangan.'],
                    ['name' => 'Ph Meter Tanah Digital', 'price' => 125000, 'stock' => 20, 'care_level' => 'mudah', 'description' => 'Ph meter digital portable. Ukur pH tanah & air dengan akurat.'],
                ],
            ],
        ];

        foreach ($products as $group) {
            $store = $stores->firstWhere('slug', $group['store_slug']);
            if (!$store) continue;

            $category = $categories->get($group['category_slug']);
            if (!$category) continue;

            foreach ($group['items'] as $item) {
                $product = Product::firstOrCreate(
                    ['slug' => Str::slug($item['name'])],
                    [
                        'store_id' => $store->id,
                        'category_id' => $category->id,
                        'name' => $item['name'],
                        'description' => $item['description'],
                        'price' => $item['price'],
                        'stock' => $item['stock'],
                        'care_level' => $item['care_level'],
                        'is_active' => true,
                    ]
                );

                // Create inventory
                Inventory::firstOrCreate(
                    ['product_id' => $product->id],
                    ['quantity' => $item['stock'], 'reserved_quantity' => 0]
                );
            }
        }
    }
}
