<?php

namespace App\Services;

use App\Models\PlantSpecies;

/**
 * Mesin rekomendasi tanaman berbasis aturan (docs/16: PlantFinderService).
 * Mirip dengan rule engine yang dipakai demo web — versi produksi di sini.
 */
class PlantFinderService
{
    /** Pertanyaan & opsi yang dikirim ke frontend. */
    public function questions(): array
    {
        return [
            [
                'id' => 'lokasi', 'question' => 'Di mana tanaman akan diletakkan?',
                'options' => [
                    ['value' => 'indoor-terang', 'label' => 'Dalam ruangan terang'],
                    ['value' => 'indoor-redup', 'label' => 'Dalam ruangan redup'],
                    ['value' => 'outdoor', 'label' => 'Balkon / halaman'],
                    ['value' => 'teras', 'label' => 'Teras semi-terbuka'],
                ],
            ],
            [
                'id' => 'pengalaman', 'question' => 'Seberapa berpengalaman Anda berkebun?',
                'options' => [
                    ['value' => 'pemula', 'label' => 'Pemula'],
                    ['value' => 'sedang', 'label' => 'Menengah'],
                    ['value' => 'mahir', 'label' => 'Mahir'],
                ],
            ],
            [
                'id' => 'tujuan', 'question' => 'Apa tujuan utama Anda?',
                'options' => [
                    ['value' => 'hias', 'label' => 'Mempercantik ruangan'],
                    ['value' => 'pangan', 'label' => 'Panen sayur / buah'],
                    ['value' => 'udara', 'label' => 'Membersihkan udara'],
                    ['value' => 'relaksasi', 'label' => 'Hobi & relaksasi'],
                ],
            ],
            [
                'id' => 'waktu', 'question' => 'Berapa banyak waktu untuk merawat tiap minggu?',
                'options' => [
                    ['value' => 'sibuk', 'label' => 'Sangat sibuk (<15 menit)'],
                    ['value' => 'normal', 'label' => 'Cukup (15–45 menit)'],
                    ['value' => 'banyak', 'label' => 'Santai (45+ menit)'],
                ],
            ],
        ];
    }

    /**
     * Rekomendasi 3 spesies terbaik berdasarkan jawaban pengguna.
     * Batasi query maksimal 500 spesies untuk mencegah DoS.
     */
    public function recommend(array $answers): array
    {
        return PlantSpecies::query()
            ->limit(500) // Batasi untuk mencegah memory exhaustion
            ->get()
            ->map(fn ($species) => ['species' => $species, 'score' => $this->score($species, $answers)])
            ->sortByDesc('score')
            ->take(3)
            ->pluck('species')
            ->values()
            ->all();
    }

    private function score(PlantSpecies $species, array $answers): int
    {
        $score = 0;
        $slug = $species->slug;
        $loc = $answers['lokasi'] ?? '';
        $exp = $answers['pengalaman'] ?? '';
        $goal = $answers['tujuan'] ?? '';
        $time = $answers['waktu'] ?? '';

        $hardiness = match ($species->care_level) {
            'mudah' => 2, 'sedang' => 1, default => 0,
        };
        $lowLight = ['sirih-gading', 'lidah-mertua', 'aglonema', 'monstera-deliciosa', 'aloe-vera'];
        $fullSun = ['cabai-rawit', 'tomat-cherry', 'kemangi'];
        $edible = $fullSun;
        $airPurifier = ['lidah-mertua', 'monstera-deliciosa', 'sirih-gading', 'aglonema'];

        if ($loc === 'indoor-redup' && in_array($slug, $lowLight)) $score += 3;
        if (in_array($loc, ['outdoor', 'teras']) && in_array($slug, $fullSun)) $score += 3;
        if ($exp === 'pemula') $score += $hardiness * 2;
        if ($goal === 'pangan' && in_array($slug, $edible)) $score += 3;
        if ($goal === 'udara' && in_array($slug, $airPurifier)) $score += 3;
        if ($time === 'sibuk') $score += $hardiness === 2 ? 3 : 0;
        $score += 1;

        return $score;
    }
}
