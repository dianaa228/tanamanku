<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlantListingFactory extends Factory
{
    public function definition(): array
    {
        $titles = ['Monstera Deliciosa', 'Sirih Gading Golden', 'Aglonema Red', 'Lidah Mertua 40cm', 'Kaktus Mini'];

        return [
            'user_id' => User::factory(),
            'title' => fake()->randomElement($titles),
            'description' => fake()->paragraph(1),
            'price' => fake()->numberBetween(25000, 200000),
            'type' => fake()->randomElement(['sell', 'exchange']),
            'status' => 'active',
        ];
    }
}
