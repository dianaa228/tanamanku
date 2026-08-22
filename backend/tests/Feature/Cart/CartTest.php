<?php

namespace Tests\Feature\Cart;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Cart feature tests (docs/04-features.json — MVP).
 * Mencakup: tambah, update, hapus item, kosongkan keranjang,
 * validasi stok server-side, harga dari server, ownership check.
 */
class CartTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $seller = User::factory()->seller()->create();
        $store = Store::factory()->create(['user_id' => $seller->id, 'status' => 'active']);
        $category = Category::factory()->create();
        $this->product = Product::factory()->create([
            'store_id' => $store->id,
            'category_id' => $category->id,
            'price' => 50000,
            'stock' => 10,
            'is_active' => true,
        ]);
    }

    // ── Auth ──

    public function test_cart_perlu_autentikasi(): void
    {
        $this->getJson('/api/v1/cart')->assertStatus(401);
    }

    public function test_tambah_item_perlu_autentikasi(): void
    {
        $this->postJson('/api/v1/cart/items', [
            'product_id' => $this->product->id,
            'quantity' => 1,
        ])->assertStatus(401);
    }

    // ── Show cart ──

    public function test_lihat_keranjang_kosong(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/cart');

        $response->assertStatus(200)
            ->assertJsonPath('data.count', 0)
            ->assertJsonPath('data.subtotal', 0);
    }

    public function test_lihat_keranjang_dengan_item(): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
        $cart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/cart');

        $response->assertStatus(200)
            ->assertJsonPath('data.count', 2)
            ->assertJsonPath('data.subtotal', 100000); // 2 x 50.000
    }

    // ── Add item ──

    public function test_tambah_item_ke_keranjang(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => $this->product->id,
                'quantity' => 2,
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('cart_items', [
            'product_id' => $this->product->id,
            'quantity' => 2,
        ]);
    }

    public function test_tambah_item_default_quantity_1(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => $this->product->id,
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('cart_items', [
            'product_id' => $this->product->id,
            'quantity' => 1,
        ]);
    }

    public function test_tambah_item_sama_gabung_quantity(): void
    {
        // Tambah 2 item yang sama
        $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => $this->product->id,
                'quantity' => 2,
            ])->assertStatus(201);

        $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => $this->product->id,
                'quantity' => 3,
            ])->assertStatus(201);

        // Harusnya hanya 1 cart_item dengan quantity 5
        $this->assertDatabaseCount('cart_items', 1);
        $this->assertDatabaseHas('cart_items', [
            'product_id' => $this->product->id,
            'quantity' => 5,
        ]);
    }

    public function test_harga_dari_server_bukan_klien(): void
    {
        $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => $this->product->id,
                'quantity' => 1,
                'unit_price' => 1, // harga palsu dari klien
            ])->assertStatus(201);

        // Harga harus dari database (50000), bukan dari request (1)
        $this->assertDatabaseHas('cart_items', [
            'product_id' => $this->product->id,
            'unit_price' => 50000,
        ]);
        $this->assertDatabaseMissing('cart_items', [
            'product_id' => $this->product->id,
            'unit_price' => 1,
        ]);
    }

    // ── Stock validation ──

    public function test_tambah_item_stok_tidak_cukup(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => $this->product->id,
                'quantity' => 99, // stok hanya 10
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('quantity');
    }

    public function test_tambah_item_stok_gabungan_tidak_cukup(): void
    {
        // Tambah 8 item
        $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => $this->product->id,
                'quantity' => 8,
            ])->assertStatus(201);

        // Tambah lagi 5 → total 13, stok hanya 10
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => $this->product->id,
                'quantity' => 5,
            ]);

        $response->assertStatus(422);
        // Quantity tetap 8 (tidak bertambah)
        $this->assertDatabaseHas('cart_items', [
            'product_id' => $this->product->id,
            'quantity' => 8,
        ]);
    }

    public function test_tambah_item_produk_tidak_aktif(): void
    {
        $inactive = Product::factory()->create([
            'store_id' => $this->product->store_id,
            'category_id' => $this->product->category_id,
            'is_active' => false,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => $inactive->id,
                'quantity' => 1,
            ]);

        $response->assertStatus(404); // findOrFail
    }

    public function test_tambah_item_produk_tidak_ada(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => 99999,
                'quantity' => 1,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('product_id');
    }

    public function test_tambah_item_quantity_minimal_1(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => $this->product->id,
                'quantity' => 0,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('quantity');
    }

    public function test_tambah_item_quantity_maksimal_99(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => $this->product->id,
                'quantity' => 100,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('quantity');
    }

    // ── Update item ──

    public function test_update_quantity_item(): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
        $item = $cart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/v1/cart/items/{$item->id}", [
                'quantity' => 5,
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('cart_items', [
            'id' => $item->id,
            'quantity' => 5,
        ]);
    }

    public function test_update_quantity_stok_tidak_cukup(): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
        $item = $cart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 1,
            'unit_price' => $this->product->price,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/v1/cart/items/{$item->id}", [
                'quantity' => 99, // stok hanya 10
            ]);

        $response->assertStatus(422);
        // Quantity tetap 1
        $this->assertDatabaseHas('cart_items', [
            'id' => $item->id,
            'quantity' => 1,
        ]);
    }

    public function test_update_quantity_minimal_1(): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
        $item = $cart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/v1/cart/items/{$item->id}", [
                'quantity' => 0,
            ]);

        $response->assertStatus(422);
    }

    public function test_update_quantity_wajib(): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
        $item = $cart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/v1/cart/items/{$item->id}", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('quantity');
    }

    // ── Remove item ──

    public function test_hapus_item_dari_keranjang(): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
        $item = $cart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/v1/cart/items/{$item->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('cart_items', ['id' => $item->id]);
    }

    // ── Clear cart ──

    public function test_kosongkan_keranjang(): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
        $cart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson('/api/v1/cart');

        $response->assertStatus(200);
        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_kosongkan_keranjang_kosong_tidak_error(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson('/api/v1/cart');

        $response->assertStatus(200);
    }

    // ── Ownership check ──

    public function test_item_orang_lain_tidak_bisa_diupdate(): void
    {
        $other = User::factory()->create();
        $otherCart = Cart::firstOrCreate(['user_id' => $other->id]);
        $item = $otherCart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/v1/cart/items/{$item->id}", [
                'quantity' => 5,
            ]);

        $response->assertStatus(403);
    }

    public function test_item_orang_lain_tidak_bisa_dihapus(): void
    {
        $other = User::factory()->create();
        $otherCart = Cart::firstOrCreate(['user_id' => $other->id]);
        $item = $otherCart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2,
            'unit_price' => $this->product->price,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/v1/cart/items/{$item->id}");

        $response->assertStatus(403);
    }

    // ── Subtotal calculation ──

    public function test_subtotal_dihitung_dari_semua_item(): void
    {
        $productB = Product::factory()->create([
            'store_id' => $this->product->store_id,
            'category_id' => $this->product->category_id,
            'price' => 30000,
            'stock' => 5,
            'is_active' => true,
        ]);

        $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
        $cart->items()->create([
            'product_id' => $this->product->id,
            'quantity' => 2, // 2 x 50.000 = 100.000
            'unit_price' => $this->product->price,
        ]);
        $cart->items()->create([
            'product_id' => $productB->id,
            'quantity' => 3, // 3 x 30.000 = 90.000
            'unit_price' => $productB->price,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/cart');

        $response->assertStatus(200)
            ->assertJsonPath('data.count', 5)
            ->assertJsonPath('data.subtotal', 190000); // 100.000 + 90.000
    }

    // ── Multiple users ──

    public function test_pengguna_beda_punya_keranjang_sendiri(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        // UserA tambah item
        $this->actingAs($userA, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => $this->product->id,
                'quantity' => 2,
            ])->assertStatus(201);

        // UserA lihat cart → ada 1 item
        $this->actingAs($userA, 'sanctum')
            ->getJson('/api/v1/cart')
            ->assertJsonPath('data.count', 2);

        // UserB lihat cart → kosong
        $this->actingAs($userB, 'sanctum')
            ->getJson('/api/v1/cart')
            ->assertJsonPath('data.count', 0);
    }
}
