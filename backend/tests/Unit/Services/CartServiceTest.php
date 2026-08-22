<?php

namespace Tests\Unit\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

/**
 * Unit tests untuk CartService.
 * Mencakup: addItem, updateItem, removeItem, clear, stock validation.
 */
class CartServiceTest extends TestCase
{
    use RefreshDatabase;

    private CartService $service;
    private User $user;
    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new CartService();
        $this->user = User::factory()->create();

        $seller = User::factory()->seller()->create();
        $store = Store::factory()->create(['user_id' => $seller->id]);
        $category = Category::factory()->create();
        $this->product = Product::factory()->create([
            'store_id' => $store->id,
            'category_id' => $category->id,
            'price' => 50000,
            'stock' => 10,
            'is_active' => true,
        ]);
    }

    // ── Add Item ──

    public function test_add_item_creates_cart_and_item(): void
    {
        $item = $this->service->addItem($this->user, [
            'product_id' => $this->product->id,
            'quantity' => 2,
        ]);

        $this->assertEquals(2, $item->quantity);
        $this->assertEquals(50000, $item->unit_price);
        $this->assertDatabaseHas('cart_items', [
            'product_id' => $this->product->id,
            'quantity' => 2,
        ]);
    }

    public function test_add_item_default_quantity(): void
    {
        $item = $this->service->addItem($this->user, [
            'product_id' => $this->product->id,
        ]);

        $this->assertEquals(1, $item->quantity);
    }

    public function test_add_item_merges_duplicate(): void
    {
        $this->service->addItem($this->user, [
            'product_id' => $this->product->id,
            'quantity' => 3,
        ]);

        $item = $this->service->addItem($this->user, [
            'product_id' => $this->product->id,
            'quantity' => 2,
        ]);

        $this->assertEquals(5, $item->quantity);
        $this->assertDatabaseCount('cart_items', 1);
    }

    public function test_add_item_stock_exceeded(): void
    {
        $this->expectException(ValidationException::class);

        $this->service->addItem($this->user, [
            'product_id' => $this->product->id,
            'quantity' => 15, // stok hanya 10
        ]);
    }

    public function test_add_item_merged_stock_exceeded(): void
    {
        $this->service->addItem($this->user, [
            'product_id' => $this->product->id,
            'quantity' => 8,
        ]);

        $this->expectException(ValidationException::class);

        $this->service->addItem($this->user, [
            'product_id' => $this->product->id,
            'quantity' => 5, // total 13 > 10
        ]);
    }

    public function test_add_item_uses_server_price(): void
    {
        $item = $this->service->addItem($this->user, [
            'product_id' => $this->product->id,
            'quantity' => 1,
            'unit_price' => 1, // harga palsu
        ]);

        $this->assertEquals(50000, $item->unit_price);
    }

    public function test_add_inactive_product(): void
    {
        $this->product->update(['is_active' => false]);

        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);

        $this->service->addItem($this->user, [
            'product_id' => $this->product->id,
            'quantity' => 1,
        ]);
    }

    // ── Update Item ──

    public function test_update_item_quantity(): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
        $item = $cart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $updated = $this->service->updateItem($this->user, $item, 5);

        $this->assertEquals(5, $updated->quantity);
    }

    public function test_update_item_stock_exceeded(): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
        $item = $cart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $this->expectException(ValidationException::class);

        $this->service->updateItem($this->user, $item, 15);
    }

    public function test_update_item_quantity_min_1(): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
        $item = $cart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $this->expectException(ValidationException::class);

        $this->service->updateItem($this->user, $item, 0);
    }

    public function test_update_other_user_item_rejected(): void
    {
        $other = User::factory()->create();
        $otherCart = Cart::firstOrCreate(['user_id' => $other->id]);
        $item = $otherCart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);

        $this->service->updateItem($this->user, $item, 5);
    }

    // ── Remove Item ──

    public function test_remove_item(): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
        $item = $cart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $this->service->removeItem($this->user, $item);

        $this->assertDatabaseMissing('cart_items', ['id' => $item->id]);
    }

    public function test_remove_other_user_item_rejected(): void
    {
        $other = User::factory()->create();
        $otherCart = Cart::firstOrCreate(['user_id' => $other->id]);
        $item = $otherCart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $this->expectException(\Symfony\Component\HttpKernel\Exception\HttpException::class);

        $this->service->removeItem($this->user, $item);
    }

    // ── Clear ──

    public function test_clear_cart(): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
        $cart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $this->service->clear($this->user);

        $this->assertDatabaseCount('cart_items', 0);
    }

    // ── Show ──

    public function test_show_cart(): void
    {
        $cart = $this->service->show($this->user);

        $this->assertInstanceOf(Cart::class, $cart);
        $this->assertEquals($this->user->id, $cart->user_id);
    }

    // ── Subtotal ──

    public function test_subtotal(): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
        $cart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 3,
            'unit_price' => 50000,
        ]);

        $subtotal = $this->service->subtotal($cart);

        $this->assertEquals(150000, $subtotal);
    }

    public function test_subtotal_empty_cart(): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);

        $subtotal = $this->service->subtotal($cart);

        $this->assertEquals(0, $subtotal);
    }
}
