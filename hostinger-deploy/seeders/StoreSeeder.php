<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $stores = [
            [
                'owner' => ['name' => 'Green Leaf Nursery', 'email' => 'greenleaf@tanamanku.id', 'phone' => '081234560001'],
                'store' => ['name' => 'Green Leaf Nursery', 'description' => 'Toko tanaman hias premium sejak 2020. Spesialis Monstera, Aglaonema, dan tanaman langka lainnya.', 'status' => 'active'],
            ],
            [
                'owner' => ['name' => 'Urban Farm Jakarta', 'email' => 'urbanfarm@tanamanku.id', 'phone' => '081234560002'],
                'store' => ['name' => 'Urban Farm Jakarta', 'description' => 'Solusi berkebun di apartemen. Jual bibit sayuran, herb garden kit, dan media tanam organik.', 'status' => 'active'],
            ],
            [
                'owner' => ['name' => 'Pot & Dekorasi Bali', 'email' => 'potbali@tanamanku.id', 'phone' => '081234560003'],
                'store' => ['name' => 'Pot & Dekorasi Bali', 'description' => 'Pot keramik handmade dari Bali. Tersedia berbagai ukuran dan warna untuk tanaman indoor & outdoor.', 'status' => 'active'],
            ],
            [
                'owner' => ['name' => 'Pupuk Nusantara', 'email' => 'pupuknusantara@tanamanku.id', 'phone' => '081234560004'],
                'store' => ['name' => 'Pupuk Nusantara', 'description' => 'Pupuk organik & nutrisi tanaman terlengkap. Cocok untuk berkebun di lahan terbatas.', 'status' => 'active'],
            ],
            [
                'owner' => ['name' => 'Taman Seroja', 'email' => 'tamanseeroja@tanamanku.id', 'phone' => '081234560005'],
                'store' => ['name' => 'Taman Seroja', 'description' => 'Toko berkebun lengkap — tanaman hias, peralatan, hingga konsultasi perawatan tanaman.', 'status' => 'active'],
            ],
        ];

        foreach ($stores as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['owner']['email']],
                [
                    'name' => $data['owner']['name'],
                    'phone' => $data['owner']['phone'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'role' => UserRole::Seller,
                    'is_active' => true,
                ]
            );

            Store::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'name' => $data['store']['name'],
                    'slug' => Str::slug($data['store']['name']),
                    'description' => $data['store']['description'],
                    'status' => $data['store']['status'],
                ]
            );
        }
    }
}
