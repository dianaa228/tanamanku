<?php

namespace Database\Factories;

use App\Models\PlantSpecies;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserPlantFactory extends Factory
{
    public function definition(): array
    {
        $nicknames = ['Monstera Ku', 'Sirih Gading', 'Aglonema Cantik', 'Lidah Mertua', 'Pakcoy Hidroponik'];

        return [
            'user_id' => User::factory(),
            'plant_species_id' => PlantSpecies::factory(),
            'nickname' => fake()->randomElement($nicknames),
            'planted_at' => fake()->dateTimeBetween('-6 months', 'now'),
            'location' => fake()->randomElement(['Ruang Tamu', 'Kamar', 'Balkon', 'Teras', 'Dapur']),
            'pot' => fake()->randomElement(['Putih Keramik', 'Hitam Plastik', 'Terracotta', 'Gantung Rotan']),
            'status' => fake()->randomElement(['sehat', 'perlu-air', 'perhatian']),
            'height_cm' => fake()->numberBetween(10, 80),
        ];
    }
}
