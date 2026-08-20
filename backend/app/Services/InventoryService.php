<?php

namespace App\Services;

use App\Models\Inventory;
use App\Models\Product;
use Illuminate\Validation\ValidationException;

class InventoryService
{
    /**
     * Sinkronkan tabel inventories dari kolom products.stock.
     */
    public function sync(Product $product): Inventory
    {
        $inventory = $product->inventory()->firstOrNew([]);
        $inventory->quantity = $product->stock;
        $inventory->reserved_quantity = $inventory->reserved_quantity ?? 0;
        $inventory->save();

        return $inventory;
    }

    public function update(Product $product, int $quantity): Product
    {
        if ($quantity < 0) {
            throw ValidationException::withMessages(['quantity' => ['Stok tidak boleh negatif.']]);
        }

        $product->update(['stock' => $quantity]);
        $this->sync($product);

        return $product;
    }

    /**
     * Cek stok tersedia (docs/16: "Stock must be checked server-side.").
     */
    public function checkStock(Product $product, int $qty): void
    {
        if ($qty > $this->available($product)) {
            throw ValidationException::withMessages([
                'quantity' => ["Stok '{$product->name}' tidak mencukupi. Tersisa {$this->available($product)}."],
            ]);
        }
    }

    /**
     * Reservasi stok saat checkout.
     */
    public function reserve(Product $product, int $qty): void
    {
        $this->checkStock($product, $qty);

        $inventory = $product->inventory ?? $this->sync($product);
        $inventory->increment('reserved_quantity', $qty);
        $product->decrement('stock', $qty);
    }

    /**
     * Lepas reservasi (pembatalan pesanan / pembayaran gagal).
     */
    public function release(Product $product, int $qty): void
    {
        $inventory = $product->inventory;
        if ($inventory) {
            $inventory->decrement('reserved_quantity', max(0, $qty));
        }
        $product->increment('stock', $qty);
    }

    public function available(Product $product): int
    {
        $inventory = $product->inventory;

        return $inventory ? $inventory->available() : $product->stock;
    }
}
