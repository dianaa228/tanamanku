<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Role & permission didefinisikan di config/roles.php (docs/03-user-roles.json).
     * Seeder ini membuat contoh user per role untuk pengembangan.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Demo Seller',
            'email' => 'seller@tanamanku.id',
            'role' => UserRole::Seller,
        ]);

        User::factory()->create([
            'name' => 'Demo Customer',
            'email' => 'customer@tanamanku.id',
            'role' => UserRole::Customer,
        ]);
    }
}
