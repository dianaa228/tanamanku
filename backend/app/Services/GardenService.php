<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserPlant;

class GardenService
{
    public function index(User $user)
    {
        return $user->userPlants()
            ->with('species', 'reminders', 'latestGrowthLog')
            ->latest()
            ->get();
    }

    public function show(UserPlant $userPlant): UserPlant
    {
        return $userPlant->load('species', 'photos', 'growthLogs', 'careLogs', 'reminders', 'diagnoses');
    }

    public function store(User $user, array $data): UserPlant
    {
        $plant = $user->userPlants()->create($data);

        // Pengingat default: penyiraman sesuai frekuensi spesies (jika ada)
        if (isset($data['water_frequency_days']) && $data['water_frequency_days'] > 0) {
            $plant->reminders()->create([
                'type' => 'siram',
                'frequency_days' => $data['water_frequency_days'],
                'next_due_at' => now()->addDays($data['water_frequency_days']),
                'is_active' => true,
            ]);
        }

        return $this->show($plant);
    }

    public function update(UserPlant $userPlant, array $data): UserPlant
    {
        $userPlant->update($data);

        return $this->show($userPlant);
    }

    public function destroy(UserPlant $userPlant): void
    {
        $userPlant->delete();
    }

    /**
     * Catat penyiraman → buat care log + perbarui status tanaman.
     */
    public function water(UserPlant $userPlant): UserPlant
    {
        $userPlant->careLogs()->create([
            'type' => 'siram',
            'note' => 'Penyiraman manual',
            'done_at' => now(),
        ]);

        if ($userPlant->status === UserPlant::STATUS_NEEDS_WATER) {
            $userPlant->update(['status' => UserPlant::STATUS_HEALTHY]);
        }

        return $this->show($userPlant);
    }
}
