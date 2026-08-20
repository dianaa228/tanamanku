<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Monstera Deliciosa', 'Sirih Gading Golden', 'Aglonema Lipstick',
            'Lidah Mertua 40cm', 'Pakcoy Hidroponik', 'Cabai Rawit Keriting',
            'Kemangi Aromatik', 'Tomat Cherry Sweet', 'Tanah Humus Subur 5L',
            'Cocopeat 3kg', 'Pupuk NPK Mutiara', 'Sprayer Tanaman 1L',
            'Pot Terakota 20cm', 'Pot Gantung Rotan',
        ]);

        return [
            'store_id' => Store::factory(),
            'category_id' => Category::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(2),
            'price' => fake()->numberBetween(15000, 250000),
            'stock' => fake()->numberBetween(0, 100),
            'care_level' => fake()->randomElement(['mudah', 'sedang', 'sulit']),
            'is_active' => true,
        ];
    }
}
