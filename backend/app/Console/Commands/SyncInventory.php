<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Services\InventoryService;
use Illuminate\Console\Command;

class SyncInventory extends Command
{
    protected $signature = 'tanamanku:sync-inventory';

    protected $description = 'Sinkronkan tabel inventories dari kolom products.stock';

    public function handle(InventoryService $inventoryService): int
    {
        $products = Product::with('inventory')->get();

        $products->each(fn (Product $product) => $inventoryService->sync($product));

        $this->info("Sinkronisasi selesai: {$products->count()} produk.");

        return self::SUCCESS;
    }
}
