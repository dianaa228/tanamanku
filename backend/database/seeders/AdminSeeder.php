<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@tanamanku.id'],
            [
                'name' => 'Admin Tanamanku',
                'password' => 'password',
                // 'role' dan 'is_active' tidak di $fillable — diatur di bawah
            ],
        );

        // Set role dan is_active secara eksplisit
        $user->role = UserRole::Admin;
        $user->is_active = true;
        $user->save();
    }
}
