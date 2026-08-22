<?php

namespace Database\Factories;

use App\Models\Nursery;
use Illuminate\Database\Eloquent\Factories\Factory;

class NurseryProductFactory extends Factory
{
    public function definition(): array
    {
        $names = ['Monstera Deliciosa', 'Sirih Gading', 'Aglonema Red', 'Media Tanam 5L', 'Pupuk Organik'];

        return [
            'nursery_id' => Nursery::factory(),
            'name' => fake()->randomElement($names),
            'price' => fake()->numberBetween(15000, 200000),
            'stock' => fake()->numberBetween(5, 50),
            'category' => fake()->randomElement(['tanaman-hias', 'media-tanam', 'pupuk', 'pot']),
            'image' => 'product_' . fake()->numberBetween(1, 5) . '.jpg',
            'is_active' => true,
        ];
    }
}
