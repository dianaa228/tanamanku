<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'content' => fake()->randomElement([
                'Hasil panen cabai pertama di balkon! 🌶️',
                'Momo akhirnya tumbuh daun baru! 🌿',
                'Tips: kalau daun aglonema menguning, cek akarnya. Kemungkinan overwatering!',
                'Taman kering versi mini di teras. 🌵',
                'Sirih gadingku rimbun setelah 3 bulan. Plant Finder Tanamanku emang jitu!',
            ]),
            'likes_count' => fake()->numberBetween(0, 120),
            'comments_count' => fake()->numberBetween(0, 30),
        ];
    }
}
