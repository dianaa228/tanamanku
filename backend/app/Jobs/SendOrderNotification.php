<?php

namespace App\Jobs;

use App\Models\Order;
use App\Notifications\OrderNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendOrderNotification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order)
    {
    }

    public function handle(): void
    {
        $order = $this->order->load('user', 'items');

        if ($order->user) {
            $order->user->notify(new OrderNotification($order));
        }
    }
}
