<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@tanamanku.id'],
            [
                'name' => 'Admin Tanamanku',
                'password' => 'password',
                'role' => UserRole::Admin,
                'is_active' => true,
            ],
        );
    }
}
