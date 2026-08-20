<?php

namespace Database\Seeders;

use App\Models\PlantSpecies;
use Illuminate\Database\Seeder;

class PlantSpeciesSeeder extends Seeder
{
    public function run(): void
    {
        $species = [
            [
                'name' => 'Monstera Deliciosa', 'slug' => 'monstera-deliciosa',
                'scientific_name' => 'Monstera deliciosa', 'category' => 'hias', 'care_level' => 'mudah',
                'light_requirement' => 'Cahaya terang tidak langsung',
                'water_requirement' => 'Siram saat 50% tanah kering (tiap 5–7 hari)',
                'humidity' => 'Sedang–tinggi (50–70%)', 'temperature' => '18–29°C',
                'growth_duration' => '60–90 hari',
            ],
            [
                'name' => 'Sirih Gading', 'slug' => 'sirih-gading',
                'scientific_name' => 'Epipremnum aureum', 'category' => 'hias', 'care_level' => 'mudah',
                'light_requirement' => 'Cahaya rendah hingga sedang',
                'water_requirement' => 'Siram saat tanah kering (tiap 7–10 hari)',
                'humidity' => 'Sedang (40–60%)', 'temperature' => '18–30°C',
                'growth_duration' => '30–60 hari',
            ],
            [
                'name' => 'Aglonema', 'slug' => 'aglonema',
                'scientific_name' => 'Aglaonema commutatum', 'category' => 'hias', 'care_level' => 'sedang',
                'light_requirement' => 'Cahaya tidak langsung',
                'water_requirement' => 'Jaga tanah lembap, jangan becek (tiap 5–7 hari)',
                'humidity' => 'Tinggi (60%+)', 'temperature' => '20–28°C',
                'growth_duration' => '45–75 hari',
            ],
            [
                'name' => 'Lidah Mertua', 'slug' => 'lidah-mertua',
                'scientific_name' => 'Dracaena trifasciata', 'category' => 'hias', 'care_level' => 'mudah',
                'light_requirement' => 'Cahaya rendah hingga terang',
                'water_requirement' => 'Siram hemat (tiap 14–21 hari)',
                'humidity' => 'Rendah–sedang', 'temperature' => '16–29°C',
                'growth_duration' => '30–50 hari',
            ],
            [
                'name' => 'Cabai Rawit', 'slug' => 'cabai-rawit',
                'scientific_name' => 'Capsicum frutescens', 'category' => 'pangan', 'care_level' => 'sedang',
                'light_requirement' => 'Matahari penuh (6+ jam)',
                'water_requirement' => 'Siram rutin tiap 1–2 hari',
                'humidity' => 'Sedang', 'temperature' => '21–32°C',
                'growth_duration' => '70–90 hari',
            ],
            [
                'name' => 'Tomat Cherry', 'slug' => 'tomat-cherry',
                'scientific_name' => 'Solanum lycopersicum var. cerasiforme', 'category' => 'pangan', 'care_level' => 'sedang',
                'light_requirement' => 'Matahari penuh (6+ jam)',
                'water_requirement' => 'Siram rutin, jaga kelembapan tanah',
                'humidity' => 'Sedang', 'temperature' => '20–30°C',
                'growth_duration' => '60–80 hari',
            ],
            [
                'name' => 'Kemangi', 'slug' => 'kemangi',
                'scientific_name' => 'Ocimum basilicum', 'category' => 'pangan', 'care_level' => 'mudah',
                'light_requirement' => 'Matahari pagi–siang',
                'water_requirement' => 'Siram tiap 1–2 hari, tanah jangan kering',
                'humidity' => 'Sedang–tinggi', 'temperature' => '20–32°C',
                'growth_duration' => '20–30 hari',
            ],
            [
                'name' => 'Lidah Buaya', 'slug' => 'aloe-vera',
                'scientific_name' => 'Aloe barbadensis miller', 'category' => 'hias', 'care_level' => 'mudah',
                'light_requirement' => 'Cahaya terang tidak langsung',
                'water_requirement' => 'Siram hemat (tiap 10–14 hari)',
                'humidity' => 'Rendah–sedang', 'temperature' => '15–29°C',
                'growth_duration' => '45–60 hari',
            ],
        ];

        foreach ($species as $item) {
            PlantSpecies::firstOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
