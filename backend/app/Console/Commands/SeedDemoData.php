<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SeedDemoData extends Command
{
    protected $signature = 'tanamanku:seed-demo';

    protected $description = 'Isi data demo idempoten agar web Tanamanku terlihat lengkap.';

    public function handle(): int
    {
        $customer = User::where('email', 'customer@tanamanku.id')->first();
        $seller = User::where('email', 'seller@tanamanku.id')->first();
        $admin = User::where('email', 'admin@tanamanku.id')->first();
        $diana = User::where('email', 'rizkyaldysyahputraaldy@gmail.com')->first();

        if ($customer) {
            $this->seedLoyalty($customer);
            $this->seedAddresses($customer, 'Demo Customer');
            $this->seedGarden($customer);
        }

        if ($diana) {
            $this->seedLoyalty($diana);
            $this->seedAddresses($diana, 'Diana');
        }

        $personas = $this->seedPersonas();

        $this->seedRewards();
        $this->seedPlans($customer);
        $this->seedNurseries();
        $this->seedPosts($personas);
        $this->seedListings($personas);
        $this->seedServices([
            $seller,
            User::where('email', 'greenleaf@tanamanku.id')->first(),
            User::where('email', 'urbanfarm@tanamanku.id')->first(),
            User::where('email', 'potbali@tanamanku.id')->first(),
            User::where('email', 'pupuknusantara@tanamanku.id')->first(),
            User::where('email', 'tamanseeroja@tanamanku.id')->first(),
        ]);

        if ($customer && $diana) {
            $this->seedOrders($customer, $diana);
        }

        $this->seedServiceOrders($customer);
        $this->seedNotifications($customer);

        $this->info('Data demo siap.');

        return self::SUCCESS;
    }

    private function user(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    private function product(string $name): ?object
    {
        return DB::table('products')->where('name', $name)->first();
    }

    private function seedPersonas(): array
    {
        $rows = [
            ['Rina Kartika', 'rina@tanamanku.id', 'customer', '🧑‍🌾'],
            ['Budi Setiawan', 'budi@garden.id', 'seller', '👨‍🔧'],
            ['Sari Wulandari', 'sari@nursery.id', 'seller', '👩‍🌾'],
            ['Dewi Lestari', 'dewi@email.com', 'customer', '👩‍🎨'],
            ['Andi Pratama', 'andi@farm.id', 'customer', '👨‍💻'],
            ['Maya Anggraini', 'maya@tanamanku.id', 'customer', '👩‍🌾'],
            ['Roni Gunawan', 'roni@tanamanku.id', 'seller', '🧑‍🔧'],
            ['Putri Melati', 'putri@tanamanku.id', 'customer', '👩‍🎨'],
        ];

        $personas = [];
        foreach ($rows as [$name, $email, $role, $avatar]) {
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => Hash::make(env('DEMO_SEED_PASSWORD', 'Tanamanku2025!')),
                    'phone' => null,
                    'role' => $role,
                    'avatar' => $avatar,
                    'is_active' => true,
                ],
            );
            $personas[$email] = $user;
        }

        return $personas;
    }

    private function seedRewards(): void
    {
        $rewards = [
            ['name' => 'Voucher Rp10.000', 'description' => 'Voucher diskon untuk pembelian produk apa saja', 'points_cost' => 500, 'type' => 'voucher', 'icon' => '🎟️', 'stock' => 100, 'max_per_user' => 3],
            ['name' => 'Voucher Rp25.000', 'description' => 'Voucher diskon besar untuk pembelian produk', 'points_cost' => 1000, 'type' => 'voucher', 'icon' => '🎟️', 'stock' => 50, 'max_per_user' => 2],
            ['name' => 'Gratis Ongkir', 'description' => 'Voucher gratis ongkir untuk satu kali pengiriman', 'points_cost' => 300, 'type' => 'shipping', 'icon' => '🚚', 'stock' => 200, 'max_per_user' => 5],
            ['name' => 'Bonus 100 Poin', 'description' => 'Tambahan 100 poin langsung masuk ke akun', 'points_cost' => 200, 'type' => 'points', 'icon' => '✨', 'stock' => 500, 'max_per_user' => 10],
            ['name' => 'Tanaman Gratis', 'description' => 'Pilih satu tanaman hias dari katalog hadiah', 'points_cost' => 3000, 'type' => 'product', 'icon' => '🪴', 'stock' => 10, 'max_per_user' => 1],
            ['name' => 'Premium Plant Care Guide', 'description' => 'Akses panduan perawatan tanaman premium selama 1 bulan', 'points_cost' => 1500, 'type' => 'subscription', 'icon' => '📖', 'stock' => 999, 'max_per_user' => 1],
            ['name' => 'Custom Pot Exclusive', 'description' => 'Pot keramik handmade dengan nama custom', 'points_cost' => 5000, 'type' => 'product', 'icon' => '🏺', 'stock' => 5, 'max_per_user' => 1],
            ['name' => 'Konsultasi Tanaman 30 Menit', 'description' => 'Sesi konsultasi online dengan ahli tanaman', 'points_cost' => 2000, 'type' => 'service', 'icon' => '💬', 'stock' => 20, 'max_per_user' => 2],
        ];

        foreach ($rewards as $reward) {
            $exists = DB::table('loyalty_rewards')->where('name', $reward['name'])->exists();
            if (! $exists) {
                DB::table('loyalty_rewards')->insert($reward + [
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    private function seedLoyalty(User $user): void
    {
        $profile = DB::table('loyalty_profiles')->where('user_id', $user->id)->first();
        if ($profile) {
            return;
        }

        $isRina = $user->email === 'customer@tanamanku.id';
        DB::table('loyalty_profiles')->insert([
            'user_id' => $user->id,
            'points' => $isRina ? 2450 : 1200,
            'total_earned' => $isRina ? 5800 : 3000,
            'total_redeemed' => $isRina ? 3350 : 1800,
            'tier' => 'silver',
            'created_at' => now()->subMonths(3),
            'updated_at' => now(),
        ]);

        if ($isRina) {
            $history = [
                ['type' => 'earn', 'points' => 850, 'description' => 'Pembelian Order #ORD-2026-001', 'reference' => 'order', 'created_at' => now()->subDays(2)],
                ['type' => 'earn', 'points' => 50, 'description' => 'Review produk Monstera Deliciosa', 'reference' => 'review', 'created_at' => now()->subDays(3)],
                ['type' => 'redeem', 'points' => -500, 'description' => 'Tukar: Voucher Rp10.000', 'reference' => 'reward', 'created_at' => now()->subDays(4)],
                ['type' => 'earn', 'points' => 100, 'description' => 'Log perawatan tanaman (7 hari berturut)', 'reference' => 'garden', 'created_at' => now()->subDays(5)],
                ['type' => 'earn', 'points' => 350, 'description' => 'Pembelian Order #ORD-2026-002', 'reference' => 'order', 'created_at' => now()->subDays(6)],
                ['type' => 'redeem', 'points' => -300, 'description' => 'Tukar: Gratis Ongkir', 'reference' => 'reward', 'created_at' => now()->subDays(7)],
                ['type' => 'earn', 'points' => 25, 'description' => 'Post di komunitas', 'reference' => 'community', 'created_at' => now()->subDays(8)],
                ['type' => 'earn', 'points' => 200, 'description' => 'Bonus milestone: 50 transaksi', 'reference' => 'system', 'created_at' => now()->subDays(10)],
            ];

            foreach ($history as $row) {
                DB::table('loyalty_transactions')->insert($row + [
                    'user_id' => $user->id,
                    'reference_id' => null,
                    'created_at' => $row['created_at'],
                    'updated_at' => $row['created_at'],
                ]);
            }
        }
    }

    private function seedAddresses(User $user, string $recipient): void
    {
        $existing = DB::table('addresses')->where('user_id', $user->id)->exists();
        if ($existing) {
            return;
        }

        DB::table('addresses')->insert([
            'user_id' => $user->id,
            'label' => 'Rumah',
            'recipient' => $recipient,
            'phone' => '0812-3456-7890',
            'province' => 'DKI Jakarta',
            'city' => 'Jakarta Selatan',
            'district' => 'Kebayoran Baru',
            'street' => $user->email === 'customer@tanamanku.id' ? 'Jl. Senopati No. 12, RT 04/RW 02' : 'Jl. Melati No. 20, RT 05/RW 03',
            'postal_code' => '12190',
            'is_default' => true,
            'created_at' => now()->subMonths(2),
            'updated_at' => now()->subMonths(2),
        ]);

        DB::table('addresses')->insert([
            'user_id' => $user->id,
            'label' => 'Kantor',
            'recipient' => $recipient,
            'phone' => '0812-3456-7890',
            'province' => 'DKI Jakarta',
            'city' => 'Jakarta Pusat',
            'district' => 'Tanah Abang',
            'street' => 'Jl. Jend. Sudirman Kav. 52-53',
            'postal_code' => '12190',
            'is_default' => false,
            'created_at' => now()->subWeeks(6),
            'updated_at' => now()->subWeeks(6),
        ]);
    }

    private function seedPlans(?User $customer): void
    {
        $plans = [
            [
                'slug' => 'free',
                'name' => 'Tanamanku Free',
                'badge' => '🆓',
                'price' => 0,
                'period' => 'forever',
                'description' => 'Fitur dasar untuk memulai berkebun',
                'is_popular' => false,
                'features' => [
                    ['text' => 'My Garden (maks 5 tanaman)', 'included' => true],
                    ['text' => 'Plant Care Reminder (3 tanaman)', 'included' => true],
                    ['text' => 'Akses marketplace', 'included' => true],
                    ['text' => 'Community posting', 'included' => true],
                    ['text' => 'Konsultasi ahli tanaman', 'included' => false],
                    ['text' => 'Konten premium & panduan', 'included' => false],
                ],
            ],
            [
                'slug' => 'plant-care-pro',
                'name' => 'Plant Care Pro',
                'badge' => '🌱',
                'price' => 29000,
                'period' => 'month',
                'description' => 'Untuk penghobi tanaman yang serius',
                'is_popular' => true,
                'features' => [
                    ['text' => 'My Garden unlimited tanaman', 'included' => true],
                    ['text' => 'Plant Care Reminder unlimited', 'included' => true],
                    ['text' => 'Plant Diagnosis unlimited', 'included' => true],
                    ['text' => 'Konsultasi ahli (2x/bulan)', 'included' => true],
                    ['text' => 'Konten premium & panduan', 'included' => true],
                    ['text' => 'Badge "Plant Pro" profil', 'included' => true],
                    ['text' => 'Export data tanaman', 'included' => false],
                ],
            ],
            [
                'slug' => 'seller-pro',
                'name' => 'Seller Pro',
                'badge' => '🏪',
                'price' => 99000,
                'period' => 'month',
                'description' => 'Untuk seller yang ingin berkembang pesat',
                'is_popular' => false,
                'features' => [
                    ['text' => 'Semua fitur Plant Care Pro', 'included' => true],
                    ['text' => 'Analytics dashboard lanjutan', 'included' => true],
                    ['text' => 'Listing unggulan (boost)', 'included' => true],
                    ['text' => 'Badge "Verified Seller"', 'included' => true],
                    ['text' => 'Prioritas di hasil pencarian', 'included' => true],
                    ['text' => 'Akses API (beta)', 'included' => false],
                ],
            ],
        ];

        foreach ($plans as $plan) {
            $exists = DB::table('subscription_plans')->where('slug', $plan['slug'])->exists();
            if (! $exists) {
                DB::table('subscription_plans')->insert([
                    'slug' => $plan['slug'],
                    'name' => $plan['name'],
                    'badge' => $plan['badge'],
                    'price' => $plan['price'],
                    'period' => $plan['period'],
                    'description' => $plan['description'],
                    'is_popular' => $plan['is_popular'],
                    'features' => json_encode($plan['features']),
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        if ($customer) {
            $hasSub = DB::table('subscriptions')->where('user_id', $customer->id)->exists();
            if (! $hasSub) {
                $pro = DB::table('subscription_plans')->where('slug', 'plant-care-pro')->first();
                DB::table('subscriptions')->insert([
                    'user_id' => $customer->id,
                    'plan_id' => $pro->id,
                    'status' => 'active',
                    'started_at' => now()->subMonth(),
                    'expires_at' => now()->addDays(20),
                    'auto_renew' => true,
                    'payment_method' => 'QRIS',
                    'created_at' => now()->subMonth(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    private function owners(): array
    {
        $ids = [
            $this->user('greenleaf@tanamanku.id'),
            $this->user('urbanfarm@tanamanku.id'),
            $this->user('potbali@tanamanku.id'),
            $this->user('pupuknusantara@tanamanku.id'),
            $this->user('tamanseeroja@tanamanku.id'),
            $this->user('budi@garden.id'),
            $this->user('sari@nursery.id'),
            $this->user('roni@tanamanku.id'),
        ];

        return array_values(array_filter($ids));
    }

    private function seedNurseries(): void
    {
        if (DB::table('nurseries')->exists()) {
            return;
        }

        $owners = $this->owners();

        $nurseries = [
            ['Nursery Hijau Lestari', 'nursery-hijau-lestari', 'Toko tanaman hias terlengkap di Jakarta Selatan. Menyediakan berbagai macam tanaman hias, pot, media tanam, dan pupuk organik.', 'Jl. Ragunan No. 45, Pasar Minggu, Jakarta Selatan', 'Jakarta Selatan', 'DKI Jakarta', '081234567890', '08:00 - 17:00', true, 4.8, 245, 12, ['Tanaman Hias', 'Pot & Dekorasi', 'Pupuk & Nutrisi'], 2018],
            ['Green Thumb Store', 'green-thumb-store', 'Specialist tanaman sukulen dan kaktus. Koleksi lengkap dari lokal hingga impor. Konsultasi gratis untuk pemula.', 'Jl. Kemang Selatan XII No. 8, Kemang, Jakarta Selatan', 'Jakarta Selatan', 'DKI Jakarta', '081298765432', '09:00 - 18:00', true, 4.6, 189, 8, ['Sukulen', 'Kaktus', 'Tanaman Hias'], 2020],
            ['Urban Garden Shop', 'urban-garden-shop', 'Toko urban gardening untuk apartemen dan rumah minimalis. Vertical garden, tanaman indoor, dan perlengkapan hydroponik.', 'Jl. Fatmawati No. 123, Cilandak, Jakarta Selatan', 'Jakarta Selatan', 'DKI Jakarta', '085678901234', '10:00 - 20:00', true, 4.5, 132, 10, ['Tanaman Indoor', 'Vertical Garden', 'Hydroponik'], 2021],
            ['Toko Tanaman Depok', 'toko-tanaman-depok', 'Pusat tanaman hias termurah di Depok. Stok berlimpah, harga grosir untuk pembelian banyak.', 'Jl. Alternatif No. 56, Beji, Depok', 'Depok', 'Jawa Barat', '081345678901', '07:00 - 16:00', true, 4.4, 98, 10, ['Tanaman Hias', 'Benih & Bibit', 'Media Tanam'], 2015],
            ['Plant Paradise', 'plant-paradise', 'Boutique tanaman premium. Spesialis Philodendron, Monstera, dan tanaman hias langka.', 'Jl. Pondok Indah No. 88, Pondok Indah, Jakarta Selatan', 'Jakarta Selatan', 'DKI Jakarta', '082123456789', '10:00 - 19:00', false, 4.9, 87, 6, ['Tanaman Langka', 'Philodendron', 'Monstera'], 2022],
            ['Eco Garden Care', 'eco-garden-care', 'Solusi lengkap perawatan taman. Jual tanaman, media tanam, dan layanan konsultasi perawatan taman profesional.', 'Jl. Lebak Bulus I No. 12, Lebak Bulus, Jakarta Selatan', 'Jakarta Selatan', 'DKI Jakarta', '085789012345', '08:00 - 17:00', true, 4.3, 76, 8, ['Tanaman Hias', 'Pupuk & Nutrisi', 'Alat Berkebun'], 2019],
        ];

        $products = [
            [1, 'Monstera Deliciosa 60cm', 145000, 12, 'Tanaman Hias'],
            [1, 'Aglonema Lipstick', 89000, 8, 'Tanaman Hias'],
            [1, 'Pupuk NPK Mutiara 1kg', 30000, 65, 'Pupuk & Nutrisi'],
            [1, 'Pot Terakota 20cm', 42000, 55, 'Pot & Dekorasi'],
            [2, 'Echeveria Elegans', 35000, 24, 'Sukulen'],
            [2, 'Kaktus Golden Barrel', 75000, 8, 'Kaktus'],
            [2, 'Aloe Vera 30cm', 45000, 18, 'Sukulen'],
            [3, 'Pothos Golden Rambat', 35000, 30, 'Tanaman Indoor'],
            [3, 'Kit Vertical Garden Starter', 250000, 15, 'Vertical Garden'],
            [4, 'Sirih Gading Golden', 25000, 100, 'Tanaman Hias'],
            [4, 'Media Tanam Premium 10L', 35000, 80, 'Media Tanam'],
            [5, 'Philodendron Birkin', 185000, 5, 'Philodendron'],
            [5, 'Monstera Thai Constellation', 850000, 2, 'Monstera'],
            [6, 'Pupuk Organik Granul 1kg', 30000, 60, 'Pupuk & Nutrisi'],
            [6, 'Gunting Tanaman Profesional', 55000, 40, 'Alat Berkebun'],
        ];

        foreach ($nurseries as $idx => [$name, $slug, $desc, $address, $city, $prov, $phone, $hours, $open, $rating, $reviews, $productCount, $cats, $year]) {
            $nurseryId = DB::table('nurseries')->insertGetId([
                'owner_id' => $owners[$idx % count($owners)]->id,
                'name' => $name,
                'slug' => $slug,
                'description' => $desc,
                'address' => $address,
                'city' => $city,
                'province' => $prov,
                'phone' => $phone,
                'email' => Str::slug($name, '').'@nursery.id',
                'hours' => $hours,
                'is_open' => $open,
                'rating_avg' => $rating,
                'reviews_count' => $reviews,
                'products_count' => $productCount,
                'images' => json_encode([]),
                'categories' => json_encode($cats),
                'founded_year' => $year,
                'created_at' => now()->subMonths(8 + $idx),
                'updated_at' => now()->subMonths(2),
            ]);

            foreach ($products as [$nIdx, $pName, $price, $stock, $cat]) {
                if ($nIdx !== $idx + 1) {
                    continue;
                }
                DB::table('nursery_products')->insert([
                    'nursery_id' => $nurseryId,
                    'name' => $pName,
'price' => $price ?? 0,
                    'stock' => $stock,
                    'category' => $cat,
                    'image' => '',
                    'is_active' => true,
                    'created_at' => now()->subMonths(4),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    private function seedPosts(array $personas): void
    {
        $posts = [
            ['Rina Kartika', 'rina@tanamanku.id', 'Momo akhirnya tumbuh daun baru! 🌿 Dari 4 daun jadi 7 dalam sebulan. Rahasianya: cahaya terang tidak langsung + rutin membersihkan daun.', 26, now()->subHours(30), [
                ['budi@garden.id', 'Wah, bagus sekali! Daunnya mengkilap. Pakai pupuk apa, Kak?', now()->subHours(28)],
                ['sari@nursery.id', 'Tips membersihkan daunnya gimana? Pakai apa?', now()->subHours(26)],
            ]],
            ['Budi Setiawan', 'budi@garden.id', 'Hasil panen cabai pertama di balkon! 🌶️ 34 buah dari satu tanaman. Beli bibitnya di Tanamanku kemarin, tumbuh cepat banget.', 31, now()->subHours(40), [
                ['rina@tanamanku.id', 'Hebat! Cabainya montok semua. Di-siram tiap hari?', now()->subHours(38)],
            ]],
            ['Sari Wulandari', 'sari@nursery.id', 'Tips dari pengalaman: kalau daun aglonema menguning, cek dulu akarnya. Kemungkinan besar overwatering! 🪴 Jangan disiram dulu 1 minggu.', 44, now()->subHours(55), [
                ['andi@farm.id', 'Setuju! Aku hampir kehilangan aglonemaku karena itu.', now()->subHours(52)],
            ]],
            ['Andi Pratama', 'andi@farm.id', 'Coba fitur Plant Finder di Tanamanku — direkomendasikan Sirih Gading untuk apartemenku yang minim cahaya. 3 bulan kemudian... lihat hasilnya! 🍃', 52, now()->subDays(2), [
                ['rina@tanamanku.id', 'Rimbun banget! Rekomendasi Tanamanku emang jitu.', now()->subDays(2)->addHours(2)],
                ['dewi@email.com', 'Wah, langsung jadi. Mau coba juga!', now()->subDays(2)->addHours(3)],
            ]],
            ['Dewi Lestari', 'dewi@email.com', 'Taman kering (xeriscape) versi mini di teras! 🌵 Dengan lidah mertua, lidah buaya, dan kaktus. Perawatan super ringan, cocok yang sering dinas.', 38, now()->subDays(3), []],
        ];

        $allowedUsers = array_values(array_filter([
            $this->user('rina@tanamanku.id'),
            $this->user('budi@garden.id'),
            $this->user('sari@nursery.id'),
            $this->user('dewi@email.com'),
            $this->user('andi@farm.id'),
            $this->user('customer@tanamanku.id'),
            $this->user('seller@tanamanku.id'),
            $this->user('admin@tanamanku.id'),
            $this->user('rizkyaldysyahputraaldy@gmail.com'),
        ]));

        foreach ($posts as [$authorName, $authorEmail, $content, $likes, $time, $comments]) {
            $author = $personas[$authorEmail] ?? null;
            if (! $author) {
                continue;
            }

            $post = DB::table('posts')->where('content', $content)->first();
            if (! $post) {
                $postId = DB::table('posts')->insertGetId([
                    'user_id' => $author->id,
                    'content' => $content,
                    'likes_count' => $likes,
                    'comments_count' => 0,
                    'created_at' => $time,
                    'updated_at' => $time,
                ]);

                $likeUsers = collect($allowedUsers)
                    ->reject(fn (User $u) => $u->id === $author->id)
                    ->shuffle()
                    ->take(min($likes, 8));
                foreach ($likeUsers as $u) {
                    DB::table('post_likes')->insert(['post_id' => $postId, 'user_id' => $u->id]);
                }
            } else {
                $postId = $post->id;
            }

            foreach ($comments as [$cmtEmail, $cmtContent, $cmtTime]) {
                $commenter = $personas[$cmtEmail] ?? null;
                if (! $commenter) {
                    continue;
                }
                $exists = DB::table('comments')->where('post_id', $postId)->where('content', $cmtContent)->exists();
                if (! $exists) {
                    DB::table('comments')->insert([
                        'post_id' => $postId,
                        'user_id' => $commenter->id,
                        'content' => $cmtContent,
                        'created_at' => $cmtTime,
                        'updated_at' => $cmtTime,
                    ]);
                }
            }

            DB::table('posts')->where('id', $postId)->update([
                'comments_count' => DB::table('comments')->where('post_id', $postId)->count(),
            ]);
        }
    }

    private function seedListings(array $personas): void
    {
        $listingData = [
            ['rina@tanamanku.id', 'monstera-deliciosa', 'Monstera Deliciosa 3 Daun', 'Monstera sehat dengan 3 daun besar. Sudah akar kuat, siap pindah pot. Cocok untuk pemula. Mau ditukar dengan tanaman hias lain atau dijual.', 85000, 'sell', time()],
            ['budi@garden.id', 'aloe-vera', 'Aloe Vera Anakan Siap Pindah', 'Lidah buaya yang sudah besar-besar, bisa untuk obat atau kosmetik. Mau ditukar dengan tanaman sukulen lain.', 0, 'exchange', time() - 86400],
            ['sari@nursery.id', 'sirih-gading', 'Pothos Golden Rambat Panjang', 'Pothos golden yang sudah rambat panjang 1.5 meter. Cocok untuk vertical garden. Mau dijual.', 45000, 'sell', time() - 2 * 86400],
            ['andi@farm.id', 'cabai-rawit', 'Cabai Rawit Berbuah Lebat', 'Sudah mulai berbuah, tinggal panen. Mau ditukar dengan bibit sayur lain atau herbal.', 0, 'exchange', time() - 3 * 86400],
            ['maya@tanamanku.id', 'aglonema', 'Aglonema Lipstick Anakan', 'Anakan aglonema dengan semburat merah, sudah 4 daun. Harga ramah untuk kolektor pemula.', 75000, 'sell', time() - 4 * 86400],
            ['roni@tanamanku.id', 'lidah-mertua', 'Lidah Mertua Varigata', 'Sansevieria varigata tinggi 40cm. Kuat dan hemat perawatan. Bisa ditukar atau dijual.', 55000, 'sell', time() - 5 * 86400],
        ];

        foreach ($listingData as [$email, $speciesSlug, $title, $desc, $price, $type, $ts]) {
            if (DB::table('plant_listings')->where('title', $title)->exists()) {
                continue;
            }
            $species = DB::table('plant_species')->where('slug', $speciesSlug)->first();
            $user = $this->user($email);
            if (! $species || ! $user) {
                continue;
            }
            DB::table('plant_listings')->insertGetId([
                'user_id' => $user->id,
                'plant_species_id' => $species->id,
                'title' => $title,
                'description' => $desc,
                'price' => $price,
                'type' => $type,
                'images' => json_encode([]),
                'status' => 'active',
                'created_at' => Carbon::createFromTimestamp($ts),
                'updated_at' => Carbon::createFromTimestamp($ts),
            ]);
        }

        $offers = [
            ['Monstera Deliciosa 3 Daun', 'customer@tanamanku.id', 'Boleh tukar dengan pothos atau aglonema?', 'pending', null],
            ['Aloe Vera Anakan Siap Pindah', 'customer@tanamanku.id', 'Ada anakan aloe untuk ditukar dengan lidah mertua?', 'accepted', now()->subHours(20)],
            ['Cabai Rawit Berbuah Lebat', 'seller@tanamanku.id', 'Mau ditukar bibit cabai dengan kemangi? Ping saya kalau setuju.', 'pending', null],
            ['Aglonema Lipstick Anakan', 'customer@tanamanku.id', 'Masih ada? Saya tertarik untuk koleksi.', 'rejected', now()->subDays(1)],
        ];

        foreach ($offers as [$title, $offererEmail, $message, $status, $respondedAt]) {
            $listing = DB::table('plant_listings')->where('title', $title)->first();
            $offerer = $this->user($offererEmail);
            if (! $listing || ! $offerer) {
                continue;
            }
            $exists = DB::table('plant_exchanges')
                ->where('listing_id', $listing->id)
                ->where('offerer_id', $offerer->id)
                ->exists();
            if ($exists) {
                continue;
            }
            DB::table('plant_exchanges')->insert([
                'listing_id' => $listing->id,
                'offerer_id' => $offerer->id,
                'message' => $message,
                'status' => $status,
                'responded_at' => $respondedAt,
                'created_at' => now()->subHours(10),
                'updated_at' => $respondedAt ?: now()->subHours(10),
            ]);
        }
    }

    private function seedServices(array $providers): void
    {
        if (DB::table('services')->exists()) {
            return;
        }

        $services = [
            ['landscaping', 'Landscaping Taman Depan', 'Desain dan pembuatan taman depan rumah dengan konsep minimalis modern.', 2500000, 480, 'Jabodetabek'],
            ['maintenance', 'Perawatan Taman Bulanan', 'Paket perawatan taman rutin bulanan: pemotongan rumput, pemangkasan, pembersihan, dan penyiraman.', 350000, 180, 'Jakarta Selatan & Depok'],
            ['consultation', 'Konsultasi Desain Taman', 'Sesi konsultasi 1 jam dengan arsitek landscape profesional.', 500000, 60, 'Online / Jabodetabek'],
            ['pest-control', 'Pengendalian Hama Organik', 'Pengendalian hama tanaman dengan metode organik yang aman.', 450000, 120, 'Jabodetabek'],
            ['planting', 'Penanaman Vertical Garden', 'Pemasangan vertical garden di dinding rumah atau apartemen.', 1800000, 360, 'Jakarta & Tangerang'],
            ['maintenance', 'Pemangkasan Pohon Besar', 'Layanan pemangkasan pohon tinggi dengan peralatan profesional.', 800000, 240, 'Jabodetabek'],
            ['planting', 'Jasa Penyiraman Rutin', 'Penyiraman rutin saat Anda dinas atau liburan. Tanaman tetap segar.', 200000, 90, 'Jakarta Selatan'],
        ];

        foreach ($services as $idx => [$category, $name, $desc, $price, $duration, $area]) {
            if (DB::table('services')->where('name', $name)->exists()) {
                continue;
            }
            $provider = $providers[$idx % count($providers)];
            if (! $provider) {
                continue;
            }
            DB::table('services')->insert([
                'provider_id' => $provider->id,
                'category' => $category,
                'name' => $name,
                'description' => $desc,
                'price_per_visit' => $price,
                'duration' => $duration,
                'service_area' => $area,
                'is_active' => true,
                'created_at' => now()->subMonths(2 + $idx),
                'updated_at' => now(),
            ]);
        }
    }

    private function seedOrders(User $customer, User $diana): void
    {
        $orderNumber = fn ($time) => 'ORD-'.$time->format('Ymd-His');

        $scenarios = [
            [
                'user_email' => 'customer@tanamanku.id',
                'time' => now()->subHours(6),
                'status' => 'pending',
                'payment_status' => 'pending',
                'method' => 'E-Wallet (DANA)',
                'reference' => null,
                'items' => [['Monstera Deliciosa 30cm', 1], ['Aglonema Red Sumatra', 1]],
                'shipping_cost' => 15000,
                'courier' => 'reguler',
                'tracking' => null,
            ],
            [
                'user_email' => 'customer@tanamanku.id',
                'time' => now()->subDays(2),
                'status' => 'processing',
                'payment_status' => 'paid',
                'method' => 'QRIS',
                'reference' => 'QRIS-884211',
                'items' => [['Bibit Tomat Cherry 50 Biji', 2], ['Media Tanam Premium 10L', 1]],
                'shipping_cost' => 15000,
                'courier' => 'JNE Express',
                'tracking' => 'JNE8823114502',
            ],
            [
                'user_email' => 'customer@tanamanku.id',
                'time' => now()->subDays(5),
                'status' => 'shipped',
                'payment_status' => 'paid',
                'method' => 'Transfer Bank (BCA VA)',
                'reference' => 'VA-771220',
                'items' => [['Sirih Gading Golden', 2], ['Philodendron Birkin', 1]],
                'shipping_cost' => 15000,
                'courier' => 'SiCepat',
                'tracking' => 'SPX99018233',
            ],
            [
                'user_email' => 'customer@tanamanku.id',
                'time' => now()->subDays(9),
                'status' => 'delivered',
                'payment_status' => 'paid',
                'method' => 'E-Wallet (OVO)',
                'reference' => 'OVO-551022',
                'items' => [['Pupuk Organik Granul 1kg', 1], ['Nutrisi Hidroponik AB Mix', 1]],
                'shipping_cost' => 15000,
                'courier' => 'J&T Express',
                'tracking' => 'JT88230112',
            ],
            [
                'user_email' => 'customer@tanamanku.id',
                'time' => now()->subDays(14),
                'status' => 'completed',
                'payment_status' => 'paid',
                'method' => 'Transfer Bank (BCA VA)',
                'reference' => 'VA-339918',
                'items' => [['Pot Keramik Putih 15cm', 2], ['Pot Gantung Rattan', 1]],
                'shipping_cost' => 15000,
                'courier' => 'JNE Express',
                'tracking' => 'JNE550021',
            ],
            [
                'user_email' => 'rizkyaldysyahputraaldy@gmail.com',
                'time' => now()->subHours(3),
                'status' => 'pending',
                'payment_status' => 'pending',
                'method' => 'QRIS',
                'reference' => null,
                'items' => [['Monstera Deliciosa 30cm', 1]],
                'shipping_cost' => 15000,
                'courier' => 'reguler',
                'tracking' => null,
            ],
            [
                'user_email' => 'rizkyaldysyahputraaldy@gmail.com',
                'time' => now()->subDays(4),
                'status' => 'shipped',
                'payment_status' => 'paid',
                'method' => 'E-Wallet (OVO)',
                'reference' => 'OVO-772201',
                'items' => [['Sprayer Manual 1L', 1], ['Gunting Tanaman Profesional', 1]],
                'shipping_cost' => 15000,
                'courier' => 'SiCepat',
                'tracking' => 'SPX880143',
            ],
        ];

        $userById = [
            $customer->id => $customer,
            $diana->id => $diana,
        ];

        $userNeedsSeed = [];
        foreach ($scenarios as $s) {
            $user = $this->user($s['user_email']);
            if (! $user) {
                continue;
            }

            if (! array_key_exists($user->id, $userNeedsSeed)) {
                $userNeedsSeed[$user->id] = ! DB::table('orders')->where('user_id', $user->id)->exists();
            }
            if (! $userNeedsSeed[$user->id]) {
                continue;
            }

            $products = [];
            $subtotal = 0;
            foreach ($s['items'] as [$name, $qty]) {
                $product = $this->product($name);
                if (! $product) {
                    continue;
                }
                $products[] = ['product' => $product, 'qty' => $qty];
                $subtotal += $qty * (float) $product->price;
            }

            if (empty($products)) {
                continue;
            }

            $total = $subtotal + $s['shipping_cost'];

            $orderNum = $orderNumber($s['time']);
            if (DB::table('orders')->where('order_number', $orderNum)->exists()) {
                continue;
            }

            $orderId = DB::table('orders')->insertGetId([
                'user_id' => $user->id,
                'store_id' => $products[0]['product']->store_id,
                'order_number' => $orderNum,
                'status' => $s['status'],
                'subtotal' => $subtotal,
                'shipping_cost' => $s['shipping_cost'],
                'discount' => 0,
                'total' => $total,
                'payment_status' => $s['payment_status'],
                'note' => null,
                'created_at' => $s['time'],
                'updated_at' => $s['time'],
            ]);

            foreach ($products as $p) {
                DB::table('order_items')->insert([
                    'order_id' => $orderId,
                    'product_id' => $p['product']->id,
                    'variant_id' => null,
                    'quantity' => $p['qty'],
                    'unit_price' => $p['product']->price,
                    'subtotal' => $p['qty'] * (float) $p['product']->price,
                    'created_at' => $s['time'],
                    'updated_at' => $s['time'],
                ]);
            }

            DB::table('payments')->insert([
                'order_id' => $orderId,
                'method' => $s['method'],
                'reference' => $s['reference'],
                'amount' => $total,
                'status' => $s['payment_status'],
                'paid_at' => $s['payment_status'] === 'paid' ? $s['time'] : null,
                'created_at' => $s['time'],
                'updated_at' => $s['time'],
            ]);

            $address = DB::table('addresses')->where('user_id', $user->id)->first();
            DB::table('shipments')->insert([
                'order_id' => $orderId,
                'courier' => $s['courier'],
                'tracking_number' => $s['tracking'],
                'address_snapshot' => $address ? json_encode([
                    'label' => $address->label, 'recipient' => $address->recipient,
                    'phone' => $address->phone, 'province' => $address->province,
                    'city' => $address->city, 'district' => $address->district,
                    'street' => $address->street, 'postal_code' => $address->postal_code,
                ]) : '{}',
                'status' => in_array($s['status'], ['delivered', 'completed']) ? 'delivered' : ($s['status'] === 'shipped' ? 'shipped' : 'pending'),
                'shipped_at' => in_array($s['status'], ['shipped', 'delivered', 'completed']) ? $s['time']->subDay() : null,
                'delivered_at' => in_array($s['status'], ['delivered', 'completed']) ? $s['time'] : null,
                'created_at' => $s['time'],
                'updated_at' => $s['time'],
            ]);
        }

        $comments = [
            ['Pupuk Organik Granul 1kg', 5, 'Pupuknya bagus, hasil panen jadi lebih lebat.'],
            ['Nutrisi Hidroponik AB Mix', 5, 'Formula lengkap, sayur cepat besar.'],
            ['Pot Keramik Putih 15cm', 4, 'Kualitas oke, warna sesuai foto.'],
        ];

        foreach ($comments as [$productName, $rating, $comment]) {
            $product = $this->product($productName);
            if (! $product) {
                continue;
            }
            $item = DB::table('order_items')
                ->where('product_id', $product->id)
                ->join('orders', 'orders.id', '=', 'order_items.order_id')
                ->whereIn('orders.status', ['delivered', 'completed'])
                ->select('order_items.id')
                ->first();
            if (! $item) {
                continue;
            }
            $reviewExists = DB::table('reviews')->where('order_item_id', $item->id)->exists();
            if (! $reviewExists) {
                DB::table('reviews')->insert([
                    'order_item_id' => $item->id,
                    'user_id' => $customer->id,
                    'rating' => $rating,
                    'comment' => $comment,
                    'images' => json_encode([]),
                    'created_at' => now()->subDays(8),
                    'updated_at' => now()->subDays(8),
                ]);
            }
        }
    }

    private function seedServiceOrders(?User $customer): void
    {
        if (! $customer) {
            return;
        }

        $serviceByName = [];
        foreach (DB::table('services')->get() as $s) {
            $serviceByName[$s->name] = $s;
        }

        $scenarios = [
            ['Jasa Penyiraman Rutin', now()->subDays(6), 'confirmed', '335000', 'Perawatan mingguan taman depan selama wirausaha.'],
            ['Konsultasi Desain Taman', now()->subDays(3), 'completed', '500000', 'Diskusi desain taman belakang untuk area dapur.'],
            ['Pengendalian Hama Organik', now()->subDays(1), 'pending', '450000', 'Daun monstera berlubang, dicurigai kutu.'],
        ];

        foreach ($scenarios as [$svcName, $time, $status, $total, $note]) {
            $service = $serviceByName[$svcName] ?? null;
            if (! $service) {
                continue;
            }
            $exists = DB::table('service_orders')
                ->where('service_id', $service->id)
                ->where('customer_id', $customer->id)
                ->exists();
            if ($exists) {
                continue;
            }
            DB::table('service_orders')->insert([
                'service_id' => $service->id,
                'customer_id' => $customer->id,
                'schedule_at' => $time->addDays(3),
                'address_snapshot' => json_encode([
                    'label' => 'Rumah',
                    'recipient' => $customer->name,
                    'street' => 'Jl. Melati No. 12, Kel. Melati, Kec. Tebet',
                    'city' => 'Jakarta Selatan',
                    'province' => 'DKI Jakarta',
                    'phone' => $customer->phone ?? '081234567890',
                    'postal_code' => '12810',
                ]),
                'status' => $status,
                'total' => $total,
                'note' => $note,
                'created_at' => $time,
                'updated_at' => $time,
            ]);
        }
    }

    private function seedNotifications(?User $user): void
    {
        if (! $user) {
            return;
        }
        if (DB::table('notifications')->exists()) {
            return;
        }

        $notifications = [
            [now()->subHours(5), 'order', 'Pesanan kamu sudah kami proses. Cek status pengiriman di menu Pesanan.', 'Order',
                'icon' => 'package'],
            [now()->subDays(2), 'plant', 'Momo butuh siraman sekarang — status kesehatan tanaman menurun.', 'Watering reminder',
                'icon' => 'droplets'],
            [now()->subDays(4), 'community', 'Postingan kamu dapat 12 suka baru dan 3 komentar!', 'Community activity',
                'icon' => 'message-circle'],
            [now()->subDays(6), 'promo', 'Ada promo akhir bulan untuk pupuk organik. Gratis ongkir seluruh Jabodetabek!', 'Special offer',
                'icon' => 'tag'],
        ];

        foreach ($notifications as $n) {
            DB::table('notifications')->insert([
                'id' => (string) Str::uuid(),
                'type' => $n[1],
                'notifiable_type' => User::class,
                'notifiable_id' => $user->id,
                'data' => json_encode([
                    'title' => $n[3],
                    'message' => $n[2],
                    'icon' => $n['icon'] ?? 'bell',
                ]),
                'read_at' => $n[0]->lt(now()->subDays(3)) ? now()->subDays(3) : null,
                'created_at' => $n[0],
                'updated_at' => $n[0],
            ]);
        }
    }

    private function seedGarden(User $user): void
    {
        if (DB::table('user_plants')->where('user_id', $user->id)->exists()) {
            return;
        }

        $isRina = $user->email === 'customer@tanamanku.id';
        $plants = $isRina
            ? [
                ['monstera-deliciosa', 'Momo', 'Ruang Tamu', 'Terakota 25cm', '2026-03-14', 'perlu-air', 68],
                ['cabai-rawit', 'Cabe Kecil', 'Balkon', 'Pot Plastik 20cm', '2026-05-02', 'sehat', 42],
                ['sirih-gading', 'Gading', 'Dapur', 'Pot Gantung Rotan', '2026-02-20', 'sehat', 35],
                ['aloe-vera', 'Alo', 'Kamar Tidur', 'Pot Keramik 18cm', '2026-01-05', 'perhatian', 30],
            ]
            : [
                ['monstera-deliciosa', 'Momo', 'Ruang Tamu', 'Terakota 25cm', '2026-04-10', 'sehat', 60],
                ['lidah-mertua', 'Sansiv', 'Kantor', 'Pot Terakota 18cm', '2026-05-20', 'sehat', 45],
            ];

        foreach ($plants as [$slug, $nickname, $location, $pot, $planted, $status, $height]) {
            $species = DB::table('plant_species')->where('slug', $slug)->first();
            if (! $species) {
                continue;
            }
            $plantId = DB::table('user_plants')->insertGetId([
                'user_id' => $user->id,
                'plant_species_id' => $species->id,
                'nickname' => $nickname,
                'planted_at' => $planted,
                'location' => $location,
                'pot' => $pot,
                'photo' => null,
                'status' => $status,
                'height_cm' => $height,
                'created_at' => Carbon::parse($planted),
                'updated_at' => now()->subDays(2),
            ]);

            $heights = $isRina
                ? [62, 64, 65, 66, 68]
                : [54, 56, 58, 60];
            $baseHeight = ($height - ($heights[count($heights) - 1] ?? $height));
            foreach ($heights as $i => $h) {
                DB::table('plant_growth_logs')->insert([
                    'user_plant_id' => $plantId,
                    'height_cm' => $baseHeight + $h,
                    'leaves_count' => null,
                    'note' => null,
                    'logged_at' => now()->subDays((count($heights) - $i) * 3),
                    'created_at' => now()->subDays((count($heights) - $i) * 3),
                    'updated_at' => now()->subDays((count($heights) - $i) * 3),
                ]);
            }

            DB::table('plant_care_logs')->insert([
                'user_plant_id' => $plantId,
                'type' => 'siram',
                'note' => 'Penyiraman rutin',
                'done_at' => now()->subDays(1),
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ]);
            DB::table('plant_care_logs')->insert([
                'user_plant_id' => $plantId,
                'type' => 'pupuk',
                'note' => 'Pupuk NPK seimbang',
                'done_at' => now()->subDays(6),
                'created_at' => now()->subDays(6),
                'updated_at' => now()->subDays(6),
            ]);

            DB::table('plant_reminders')->insert([
                'user_plant_id' => $plantId,
                'type' => 'siram',
                'frequency_days' => $status === 'perhatian' ? 12 : ($nickname === 'Cabe Kecil' ? 2 : 6),
                'next_due_at' => now()->addDays(1),
                'last_done_at' => now()->subDays(1),
                'is_active' => true,
                'created_at' => Carbon::parse($planted),
                'updated_at' => now(),
            ]);
            DB::table('plant_reminders')->insert([
                'user_plant_id' => $plantId,
                'type' => 'pupuk',
                'frequency_days' => 14,
                'next_due_at' => now()->addDays(8),
                'last_done_at' => now()->subDays(6),
                'is_active' => true,
                'created_at' => Carbon::parse($planted),
                'updated_at' => now(),
            ]);
        }
    }
}