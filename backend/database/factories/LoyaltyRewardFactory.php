<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class LoyaltyRewardFactory extends Factory
{
    public function definition(): array
    {
        $names = ['Voucher Rp25.000', 'Gratis Ongkir', 'Bonus 2x Poin', 'Merchandise Exclusive'];

        return [
            'name' => fake()->randomElement($names),
            'description' => fake()->sentence(2),
            'points_cost' => fake()->numberBetween(100, 2000),
            'type' => fake()->randomElement(['voucher', 'discount', 'merchandise', 'points_boost']),
            'icon' => '🎁',
            'stock' => fake()->numberBetween(10, 100),
            'max_per_user' => 3,
            'is_active' => true,
        ];
    }
}
