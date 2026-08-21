<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServiceFactory extends Factory
{
    public function definition(): array
    {
        $categories = ['landscaping', 'maintenance', 'planting', 'pest-control', 'consultation', 'delivery'];
        $names = [
            'landscaping' => 'Desain Taman Premium',
            'maintenance' => 'Perawatan Taman Bulanan',
            'planting' => 'Penanaman Bibit & Tanaman',
            'pest-control' => 'Pengendalian Hama Organik',
            'consultation' => 'Konsultasi Desain Taman',
            'delivery' => 'Pengantaran Tanaman & Media Tanam',
        ];
        $cat = fake()->randomElement($categories);

        return [
            'provider_id' => User::factory()->seller(),
            'category' => $cat,
            'name' => $names[$cat],
            'description' => fake()->paragraph(2),
            'price_per_visit' => fake()->numberBetween(150000, 500000),
            'duration' => fake()->randomElement([60, 90, 120, 180]),
            'service_area' => 'Jakarta Selatan',
            'is_active' => true,
        ];
    }
}
