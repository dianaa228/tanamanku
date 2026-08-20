<?php

namespace App\Jobs;

use App\Models\Product;
use App\Services\InventoryService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class UpdateInventory implements ShouldQueue
{
    use Queueable;

    public function __construct(public Product $product)
    {
    }

    public function handle(InventoryService $inventoryService): void
    {
        $inventoryService->sync($this->product);
    }
}
