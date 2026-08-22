<?php

namespace Database\Factories;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => '08' . fake()->numerify('#########'),
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            // 'role' dan 'is_active' tidak di $fillable — diatur via configure()
        ];
    }

    /**
     * Konfigurasi user setelah creation karena role/is_active tidak di $fillable.
     */
    public function configure(): static
    {
        return $this->afterMaking(function (User $user) {
            // Default values jika belum diset via state
            if (! $user->role) {
                $user->role = UserRole::Customer;
            }
            if (is_null($user->is_active)) {
                $user->is_active = true;
            }
        });
    }

    public function seller(): static
    {
        return $this->state(fn () => ['role' => UserRole::Seller]);
    }

    public function admin(): static
    {
        return $this->state(fn () => ['role' => UserRole::Admin]);
    }
}
