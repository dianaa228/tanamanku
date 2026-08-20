<?php

namespace App\Services;

use App\Models\PlantDiagnosis;
use App\Models\UserPlant;

class PlantDiagnosisService
{
    /** Aturan diagnosis (sama dengan rule engine di demo web). */
    private const RULES = [
        [
            'id' => 'overwatering', 'symptoms' => ['daun-kuning', 'daun-layu', 'tanah-basah'],
            'title' => 'Kemungkinan Overwatering (Kelebihan Air)', 'severity' => 'sedang',
            'advice' => [
                'Hentikan penyiraman selama 5–7 hari',
                'Periksa lubang drainase pot — pastikan tidak tersumbat',
                'Jika akar berbau busuk, segera repotting dengan media tanam baru',
            ],
        ],
        [
            'id' => 'underwatering', 'symptoms' => ['daun-kering', 'ujung-coklat', 'daun-menggulung'],
            'title' => 'Kemungkinan Kekurangan Air / Udara Terlalu Kering', 'severity' => 'sedang',
            'advice' => [
                'Rendam pot dalam air selama 15–20 menit agar media menyerap optimal',
                'Semprot daun (misting) 1–2 kali sehari',
                'Pangkas daun yang sudah kering parah',
            ],
        ],
        [
            'id' => 'jamur', 'symptoms' => ['bercak-putih', 'serbuk-putih', 'daun-keriting'],
            'title' => 'Kemungkinan Serangan Jamur (Powdery Mildew)', 'severity' => 'berat',
            'advice' => [
                'Pisahkan tanaman dari tanaman lain',
                'Buang daun yang terinfeksi parah',
                'Semprot larutan baking soda (1 sdt per liter air) setiap 3 hari',
                'Perbaiki sirkulasi udara di sekitar tanaman',
            ],
        ],
        [
            'id' => 'hama', 'symptoms' => ['lubang-daun', 'kutu-hijau', 'garis-perak'],
            'title' => 'Kemungkinan Serangan Hama (Ulat / Kutu Daun)', 'severity' => 'berat',
            'advice' => [
                'Periksa balik daun & sela batang setiap pagi',
                'Semprot air sabun (1 sdt sabun cair per liter) tiap 3 hari',
                'Untuk ulat: petik secara manual saat terlihat',
            ],
        ],
        [
            'id' => 'nutrisi', 'symptoms' => ['daun-pucat', 'pertumbuhan-lambat', 'daun-kuning-bawah'],
            'title' => 'Kemungkinan Kekurangan Nutrisi', 'severity' => 'ringan',
            'advice' => [
                'Berikan pupuk NPK seimbang 2 minggu sekali dengan dosis sesuai kemasan',
                'Pastikan pH media tanam 6–7',
                'Jika pot kecil, pertimbangkan repotting',
            ],
        ],
    ];

    public function symptoms(): array
    {
        return [
            ['id' => 'daun-kuning', 'label' => 'Daun menguning'],
            ['id' => 'daun-layu', 'label' => 'Daun lemas / layu'],
            ['id' => 'tanah-basah', 'label' => 'Tanah selalu basah'],
            ['id' => 'daun-kering', 'label' => 'Daun kering & rapuh'],
            ['id' => 'ujung-coklat', 'label' => 'Ujung daun coklat'],
            ['id' => 'daun-menggulung', 'label' => 'Daun menggulung'],
            ['id' => 'bercak-putih', 'label' => 'Bercak / serbuk putih'],
            ['id' => 'daun-keriting', 'label' => 'Daun keriting'],
            ['id' => 'lubang-daun', 'label' => 'Ada lubang di daun'],
            ['id' => 'kutu-hijau', 'label' => 'Kutu kecil di daun'],
            ['id' => 'garis-perak', 'label' => 'Garis perak keperakan'],
            ['id' => 'daun-pucat', 'label' => 'Daun pucat / pudar'],
            ['id' => 'pertumbuhan-lambat', 'label' => 'Tumbuh lambat'],
            ['id' => 'daun-kuning-bawah', 'label' => 'Daun bawah menguning'],
        ];
    }

    /**
     * Cocokkan gejala dengan aturan; simpan riwayat diagnosis.
     */
    public function diagnose(UserPlant $userPlant, array $symptoms): PlantDiagnosis
    {
        $best = null;
        $bestScore = 0;

        foreach (self::RULES as $rule) {
            $score = count(array_intersect($rule['symptoms'], $symptoms));
            if ($score > $bestScore) {
                $bestScore = $score;
                $best = $rule;
            }
        }

        $result = $best ?? [
            'title' => 'Gejala belum cukup spesifik',
            'severity' => 'ringan',
            'advice' => ['Amati selama 2–3 hari, lalu coba diagnosis ulang dengan gejala tambahan.'],
        ];

        return PlantDiagnosis::create([
            'user_plant_id' => $userPlant->id,
            'symptoms' => $symptoms,
            'diagnosis' => $result['title'],
            'severity' => $result['severity'],
            'advice' => $result['advice'],
            'created_at' => now(),
        ]);
    }
}
