<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class CartService
{
    public function getOrCreateCart(User $user): Cart
    {
        return Cart::firstOrCreate(['user_id' => $user->id]);
    }

    /**
     * Tambah item ke keranjang dengan pengecekan stok SERVER-SIDE
     * (docs/16: "Stock must be checked server-side.").
     */
    public function addItem(User $user, array $data): CartItem
    {
        $product = Product::active()->findOrFail($data['product_id']);

        $requestedQty = $data['quantity'] ?? 1;
        $available = $this->availableStock($product);

        $existing = $this->getOrCreateCart($user)->items()
            ->where('product_id', $product->id)
            ->where('variant_id', $data['variant_id'] ?? null)
            ->first();

        $newQty = $requestedQty + ($existing->quantity ?? 0);
        if ($newQty > $available) {
            throw ValidationException::withMessages([
                'quantity' => ["Stok tidak mencukupi. Tersisa {$available}."],
            ]);
        }

        // Harga diambil dari database — jangan pernah percaya harga dari klien.
        $unitPrice = $this->unitPrice($product, $data['variant_id'] ?? null);

        if ($existing) {
            $existing->update(['quantity' => $newQty, 'unit_price' => $unitPrice]);

            return $existing;
        }

        return $this->getOrCreateCart($user)->items()->create([
            'product_id' => $product->id,
            'variant_id' => $data['variant_id'] ?? null,
            'quantity' => $newQty,
            'unit_price' => $unitPrice,
        ]);
    }

    public function updateItem(User $user, CartItem $cartItem, int $quantity): CartItem
    {
        $this->authorizeCartItem($user, $cartItem);

        if ($quantity < 1) {
            throw ValidationException::withMessages(['quantity' => ['Jumlah minimal 1.']]);
        }

        $available = $this->availableStock($cartItem->product);
        if ($quantity > $available) {
            throw ValidationException::withMessages(['quantity' => ["Stok tidak mencukupi. Tersisa {$available}."]]);
        }

        $cartItem->update(['quantity' => $quantity]);

        return $cartItem;
    }

    public function removeItem(User $user, CartItem $cartItem): void
    {
        $this->authorizeCartItem($user, $cartItem);
        $cartItem->delete();
    }

    public function clear(User $user): void
    {
        $this->getOrCreateCart($user)->items()->delete();
    }

    public function show(User $user): Cart
    {
        return $this->getOrCreateCart($user)->load('items.product:id,name,slug,price,stock', 'items.variant');
    }

    public function subtotal(Cart $cart): float
    {
        return (float) $cart->items->sum(fn ($item) => $item->quantity * $item->unit_price);
    }

    private function authorizeCartItem(User $user, CartItem $cartItem): void
    {
        if ($cartItem->cart->user_id !== $user->id) {
            abort(403, 'Item keranjang ini bukan milik Anda.');
        }
    }

    private function availableStock(Product $product): int
    {
        $inventory = $product->inventory;

        return $inventory ? $inventory->available() : $product->stock;
    }

    private function unitPrice(Product $product, ?int $variantId): float
    {
        if ($variantId) {
            $variant = $product->variants()->findOrFail($variantId);

            return (float) $product->price + (float) $variant->price_adjustment;
        }

        return (float) $product->price;
    }
}
