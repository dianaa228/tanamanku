<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class CommunityNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $event,      // post_liked | post_commented | post_reported
        public array $payload = [],
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $text = match ($this->event) {
            'post_liked' => 'Post Anda disukai! ❤️',
            'post_commented' => 'Post Anda mendapat komentar baru 💬',
            'post_reported' => 'Sebuah konten dilaporkan — perlu moderasi.',
            default => 'Aktivitas baru di komunitas Tanamanku.',
        };

        return [
            'type' => 'community',
            'title' => '💬 Komunitas Tanamanku',
            'body' => $text,
            'data' => $this->payload,
        ];
    }
}
