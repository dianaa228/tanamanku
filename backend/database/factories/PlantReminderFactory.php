<?php

namespace Database\Factories;

use App\Models\UserPlant;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlantReminderFactory extends Factory
{
    public function definition(): array
    {
        $types = ['siram', 'pupuk', 'repot', 'cek-hama', 'pangkas'];

        return [
            'user_plant_id' => UserPlant::factory(),
            'type' => fake()->randomElement($types),
            'frequency_days' => fake()->randomElement([1, 3, 7, 14, 30]),
            'next_due_at' => now()->addDays(fake()->numberBetween(1, 7)),
            'last_done_at' => null,
            'is_active' => true,
        ];
    }
}
