<?php

namespace App\Notifications;

use App\Models\PlantReminder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class PlantCareNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public PlantReminder $reminder)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $labels = [
            'siram' => 'Penyiraman', 'pupuk' => 'Pemupukan', 'repot' => 'Repotting',
            'cek-hama' => 'Pemeriksaan Hama', 'pangkas' => 'Pemangkasan',
        ];
        $label = $labels[$this->reminder->type] ?? 'Perawatan';

        return [
            'type' => 'plant_care',
            'title' => "💧 {$label} untuk {$this->reminder->userPlant->nickname}",
            'body' => "Jadwal {$label} hari ini untuk {$this->reminder->userPlant->nickname}. Jangan lupa ya!",
            'data' => [
                'user_plant_id' => $this->reminder->user_plant_id,
                'reminder_id' => $this->reminder->id,
                'type' => $this->reminder->type,
            ],
        ];
    }
}
