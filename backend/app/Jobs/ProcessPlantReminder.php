<?php

namespace App\Jobs;

use App\Services\ReminderService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcessPlantReminder implements ShouldQueue
{
    use Queueable;

    /**
     * Dipicu scheduler setiap jam (routes/console.php) — docs/14-notification.json.
     */
    public function handle(ReminderService $reminderService): void
    {
        try {
            $processed = $reminderService->processDueReminders();
            Log::info("PlantReminder: {$processed} pengingat diproses.");
        } catch (\Throwable $e) {
            Log::error('PlantReminder gagal: '.$e->getMessage());
        }
    }
}
