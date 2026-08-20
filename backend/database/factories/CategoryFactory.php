<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Tanaman Hias', 'Sayuran & Herbal', 'Buah', 'Media Tanam',
            'Pupuk & Nutrisi', 'Peralatan Berkebun', 'Pot & Dekorasi',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'is_active' => true,
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
