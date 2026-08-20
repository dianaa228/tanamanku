<?php

namespace Tests\Feature\Order;

use App\Enums\UserRole;
use App\Models\Cart;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Business rules penting (docs/16-business-rules.json):
 *  - Checkout memakai database transaction.
 *  - Stok dicek server-side.
 *  - Total pesanan dihitung server-side (bukan dari klien).
 */
class OrderCheckoutTest extends TestCase
{
    use RefreshDatabase;

    private function seedCatalog(): array
    {
        $seller = User::factory()->create(['role' => UserRole::Seller]);
        $store = Store::factory()->create(['user_id' => $seller->id, 'status' => 'active']);
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'store_id' => $store->id,
            'category_id' => $category->id,
            'price' => 50000,
            'stock' => 10,
        ]);

        return compact('store', 'product');
    }

    private function addToCart(User $user, Product $product, int $qty = 2): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $cart->items()->create([
            'product_id' => $product->id,
            'quantity' => $qty,
            'unit_price' => $product->price,
        ]);
    }

    public function test_total_pesanan_dihitung_server_side(): void
    {
        $customer = User::factory()->create();
        ['product' => $product] = $this->seedCatalog();
        $this->addToCart($customer, $product, 2); // 2 x 50.000 = 100.000

        // Klien mengirim total palsu — harus diabaikan server.
        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'qris',
            'address' => [
                'label' => 'Rumah', 'recipient' => 'Rina', 'phone' => '0812',
                'street' => 'Jl. Senopati 12', 'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta', 'postal_code' => '12190',
            ],
            'total' => 1000, // total palsu dari klien
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.subtotal', 100000);

        $order = Order::first();
        $this->assertEquals(115000, (float) $order->total); // 100.000 + ongkir 15.000
        $this->assertNotEquals(1000, (float) $order->total);
    }

    public function test_stok_dikurangi_saat_checkout_dan_keranjang_kosong(): void
    {
        $customer = User::factory()->create();
        ['product' => $product] = $this->seedCatalog();
        $this->addToCart($customer, $product, 3);

        $this->actingAs($customer, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'qris',
            'address' => ['label' => 'Rumah', 'recipient' => 'R', 'phone' => '1', 'street' => 'Jl. X', 'city' => 'Y', 'province' => 'Z'],
        ])->assertStatus(201);

        $this->assertSame(7, $product->refresh()->stock); // 10 - 3
        $this->assertDatabaseCount('cart_items', 0);
        $this->assertDatabaseHas('orders', ['status' => 'pending']);
        $this->assertDatabaseHas('payments', ['status' => 'pending']);
    }

    public function test_checkout_gagal_saat_stok_tidak_cukup(): void
    {
        $customer = User::factory()->create();
        ['product' => $product] = $this->seedCatalog();
        $this->addToCart($customer, $product, 99); // stok hanya 10

        $this->actingAs($customer, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'qris',
            'address' => ['label' => 'Rumah', 'recipient' => 'R', 'phone' => '1', 'street' => 'Jl. X', 'city' => 'Y', 'province' => 'Z'],
        ])->assertStatus(422);

        // Transaksi dibatalkan → stok tetap & tidak ada order
        $this->assertSame(10, $product->refresh()->stock);
        $this->assertDatabaseCount('orders', 0);
    }

    public function test_pesanan_orang_lain_tidak_bisa_diakses(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        ['product' => $product] = $this->seedCatalog();
        $this->addToCart($owner, $product, 1);

        $orderResponse = $this->actingAs($owner, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'cod',
            'address' => ['label' => 'Rumah', 'recipient' => 'R', 'phone' => '1', 'street' => 'Jl. X', 'city' => 'Y', 'province' => 'Z'],
        ])->assertStatus(201);

        $orderId = $orderResponse->json('data.id');

        // Ownership check (docs/12: Never trust ownership tanpa verifikasi)
        $this->actingAs($intruder, 'sanctum')
            ->getJson("/api/v1/orders/{$orderId}")
            ->assertStatus(403);
    }
}
