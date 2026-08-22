<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportFactory extends Factory
{
    public function definition(): array
    {
        return [
            'reportable_type' => Post::class,
            'reportable_id' => Post::factory(),
            'reporter_id' => User::factory(),
            'reason' => fake()->sentence(3),
            'status' => 'open',
        ];
    }
}
