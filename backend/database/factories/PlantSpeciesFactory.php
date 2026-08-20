<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PlantSpeciesFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Monstera Deliciosa', 'Sirih Gading', 'Aglonema', 'Lidah Mertua',
            'Cabai Rawit', 'Tomat Cherry', 'Kemangi', 'Lidah Buaya',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1, 999),
            'scientific_name' => fake()->words(2, true),
            'category' => fake()->randomElement(['hias', 'pangan']),
            'care_level' => fake()->randomElement(['mudah', 'sedang', 'sulit']),
            'light_requirement' => fake()->randomElement(['Cahaya terang tidak langsung', 'Matahari penuh', 'Cahaya rendah']),
            'water_requirement' => 'Siram saat tanah kering',
            'growth_duration' => '45–90 hari',
        ];
    }
}
