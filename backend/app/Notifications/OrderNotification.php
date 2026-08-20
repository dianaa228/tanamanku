<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class OrderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'order',
            'order_number' => $this->order->order_number,
            'title' => 'Pesanan '.$this->order->order_number,
            'body' => match ($this->order->status) {
                Order::STATUS_PAID => 'Pembayaran Anda telah diterima. Pesanan sedang diproses penjual. ✅',
                Order::STATUS_SHIPPED => 'Pesanan Anda sedang dalam perjalanan! 🚚',
                Order::STATUS_COMPLETED => 'Pesanan selesai. Terima kasih telah belanja di Tanamanku! 🌿',
                Order::STATUS_CANCELLED => 'Pesanan Anda dibatalkan.',
                default => 'Pesanan Anda sedang menunggu pembayaran. ⏳',
            },
            'data' => [
                'order_id' => $this->order->id,
                'total' => (float) $this->order->total,
            ],
        ];
    }
}
