<?php

namespace App\Services;

use App\Models\PlantReminder;
use App\Models\UserPlant;
use App\Notifications\PlantCareNotification;
use Illuminate\Support\Collection;

class ReminderService
{
    /**
     * Ambil semua reminder yang jatuh tempo (is_active & next_due_at <= now).
     */
    public function dueReminders(): Collection
    {
        return PlantReminder::query()
            ->due()
            ->with('userPlant.user')
            ->get();
    }

    /**
     * Kirim notifikasi untuk reminder jatuh tempo lalu jadwalkan ulang.
     * Dipanggil oleh job ProcessPlantReminder (docs/14).
     */
    public function processDueReminders(): int
    {
        $processed = 0;

        $this->dueReminders()->each(function (PlantReminder $reminder) {
            $user = $reminder->userPlant->user;

            $user->notify(new PlantCareNotification($reminder));

            $this->reschedule($reminder);
            $processed++;
        });

        return $processed;
    }

    /**
     * Jadwalkan ulang: next_due_at = last_done + frequency_days.
     */
    public function reschedule(PlantReminder $reminder): PlantReminder
    {
        $reminder->update([
            'next_due_at' => now()->addDays($reminder->frequency_days),
        ]);

        return $reminder;
    }

    /**
     * Tandai selesai: catat care log + atur ulang jadwal.
     */
    public function markDone(PlantReminder $reminder): PlantReminder
    {
        $reminder->update([
            'last_done_at' => now(),
            'next_due_at' => now()->addDays($reminder->frequency_days),
        ]);

        $reminder->userPlant->careLogs()->create([
            'type' => $reminder->type,
            'note' => 'Pengingat diselesaikan',
            'done_at' => now(),
        ]);

        return $reminder;
    }

    public function store(UserPlant $userPlant, array $data): PlantReminder
    {
        return $userPlant->reminders()->create([
            'type' => $data['type'],
            'frequency_days' => $data['frequency_days'],
            'next_due_at' => now()->addDays($data['frequency_days']),
            'is_active' => true,
        ]);
    }
}
