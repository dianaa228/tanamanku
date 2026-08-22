<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LoyaltyTransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['earn', 'redeem']),
            'points' => fake()->numberBetween(10, 500),
            'description' => fake()->sentence(2),
            'reference' => null,
            'reference_id' => null,
        ];
    }
}
