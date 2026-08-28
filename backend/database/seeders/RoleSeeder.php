<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $createUser = function (
            string $name,
            string $email,
            string $phone,
            UserRole $role
        ): void {
            $user = User::firstOrNew(['email' => $email]);

            $user->forceFill([
                'name' => $name,
                'phone' => $phone,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => $role,
                'is_active' => true,
            ]);

            $user->save();
        };

        $createUser(
            'Demo Seller',
            'seller@tanamanku.id',
            '08964672904',
            UserRole::Seller
        );

        $createUser(
            'Demo Customer',
            'customer@tanamanku.id',
            '08964672905',
            UserRole::Customer
        );

         $createUser(
            'Demo Admin',
            'admin@tanamanku.id',
            '08964672906',
            UserRole::Admin
        );
    }
}