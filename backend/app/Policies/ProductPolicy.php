<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    public function create(User $user): bool
    {
        // Seller dengan toko terverifikasi (atau admin) dapat membuat produk
        return $user->isAdmin() || ($user->isSeller() && $user->store?->status === 'active');
    }

    public function update(User $user, Product $product): bool
    {
        // Hanya pemilik toko dari produk tsb (docs/03: ownership check)
        return $user->isAdmin() || $product->store->user_id === $user->id;
    }

    public function delete(User $user, Product $product): bool
    {
        return $this->update($user, $product);
    }
}
