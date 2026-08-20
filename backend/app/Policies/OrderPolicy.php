<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function view(User $user, Order $order): bool
    {
        return $user->isAdmin() || $order->isOwnedBy($user);
    }

    public function update(User $user, Order $order): bool
    {
        // Pembatalan & pembayaran hanya untuk pemilik pesanan (atau admin)
        return $user->isAdmin() || $order->isOwnedBy($user);
    }

    public function fulfill(User $user, Order $order): bool
    {
        // Seller toko yang menampung order
        return $user->isAdmin() || $order->store?->user_id === $user->id;
    }
}
