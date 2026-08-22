<?php

namespace Tests\Unit\Services;

use App\Models\Category;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use App\Services\InventoryService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

/**
 * Unit tests untuk InventoryService.
 * Mencakup: sync, update, checkStock, reserve, release, available.
 */
class InventoryServiceTest extends TestCase
{
    use RefreshDatabase;

    private InventoryService $service;
    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new InventoryService();

        $seller = User::factory()->seller()->create();
        $store = Store::factory()->create(['user_id' => $seller->id]);
        $category = Category::factory()->create();
        $this->product = Product::factory()->create([
            'store_id' => $store->id,
            'category_id' => $category->id,
            'stock' => 10,
        ]);
    }

    // ── Sync ──

    public function test_sync_membuat_inventory_baru(): void
    {
        $this->assertDatabaseMissing('inventories', ['product_id' => $this->product->id]);

        $inventory = $this->service->sync($this->product);

        $this->assertEquals(10, $inventory->quantity);
        $this->assertEquals(0, $inventory->reserved_quantity);
        $this->assertDatabaseHas('inventories', [
            'product_id' => $this->product->id,
            'quantity' => 10,
        ]);
    }

    public function test_sync_update_inventory_sudah_ada(): void
    {
        // Buat inventory manual
        Inventory::create([
            'product_id' => $this->product->id,
            'quantity' => 5,
            'reserved_quantity' => 0,
        ]);

        // Update stok product
        $this->product->update(['stock' => 15]);

        $inventory = $this->service->sync($this->product);

        $this->assertEquals(15, $inventory->quantity);
        $this->assertDatabaseCount('inventories', 1); // tetap 1 record
    }

    // ── Update ──

    public function test_update_stok(): void
    {
        $product = $this->service->update($this->product, 20);

        $this->assertEquals(20, $product->stock);
        $this->assertDatabaseHas('inventories', [
            'product_id' => $this->product->id,
            'quantity' => 20,
        ]);
    }

    public function test_update_stok_negatif_gagal(): void
    {
        $this->expectException(ValidationException::class);

        $this->service->update($this->product, -5);
    }

    public function test_update_stok_0_diperbolehkan(): void
    {
        $product = $this->service->update($this->product, 0);

        $this->assertEquals(0, $product->stock);
    }

    // ── CheckStock ──

    public function test_check_stock_sufficient(): void
    {
        // Tidak throw exception = stok cukup
        $this->service->checkStock($this->product, 5);
        $this->assertTrue(true);
    }

    public function test_check_stock_exact(): void
    {
        $this->service->checkStock($this->product, 10);
        $this->assertTrue(true);
    }

    public function test_check_stock_insufficient(): void
    {
        $this->expectException(ValidationException::class);

        $this->service->checkStock($this->product, 11);
    }

    public function test_check_stock_with_reserved(): void
    {
        // Buat inventory dengan reserved
        Inventory::create([
            'product_id' => $this->product->id,
            'quantity' => 10,
            'reserved_quantity' => 8,
        ]);

        // Available = 10 - 8 = 2, jadi request 3 harus gagal
        $this->expectException(ValidationException::class);
        $this->service->checkStock($this->product, 3);
    }

    // ── Reserve ──

    public function test_reserve_stok(): void
    {
        $this->service->reserve($this->product, 3);

        $this->product->refresh();
        $this->assertEquals(7, $this->product->stock); // 10 - 3

        $inventory = $this->product->inventory;
        $this->assertEquals(3, $inventory->reserved_quantity);
    }

    public function test_reserve_stok_tidak_cukup(): void
    {
        $this->expectException(ValidationException::class);

        $this->service->reserve($this->product, 15);
    }

    public function test_reserve_bertambah(): void
    {
        $this->service->reserve($this->product, 3);
        $this->service->reserve($this->product, 2);

        $this->product->refresh();
        $this->assertEquals(5, $this->product->stock); // 10 - 5

        $inventory = $this->product->inventory;
        $this->assertEquals(5, $inventory->reserved_quantity);
    }

    // ── Release ──

    public function test_release_stok(): void
    {
        // Reserve dulu
        $this->service->reserve($this->product, 3);
        $this->product->refresh();
        $this->assertEquals(7, $this->product->stock);

        // Release
        $this->service->release($this->product, 3);
        $this->product->refresh();
        $this->assertEquals(10, $this->product->stock);

        $inventory = $this->product->inventory;
        $this->assertEquals(0, $inventory->reserved_quantity);
    }

    public function test_release_tanpa_inventory(): void
    {
        // Release tanpa inventory sync - harus tetap increase stock
        $this->service->release($this->product, 5);
        $this->product->refresh();

        $this->assertEquals(15, $this->product->stock); // 10 + 5
    }

    // ── Available ──

    public function test_available_tanpa_inventory(): void
    {
        $available = $this->service->available($this->product);
        $this->assertEquals(10, $available);
    }

    public function test_available_dengan_reserved(): void
    {
        Inventory::create([
            'product_id' => $this->product->id,
            'quantity' => 10,
            'reserved_quantity' => 3,
        ]);

        $available = $this->service->available($this->product);
        $this->assertEquals(7, $available);
    }

    public function test_available_setelah_reserve(): void
    {
        $this->service->reserve($this->product, 4);

        $available = $this->service->available($this->product);
        $this->assertEquals(6, $available); // 10 - 4 reserved
    }
}
