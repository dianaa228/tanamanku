<?php

namespace Tests\Feature\Order;

use App\Enums\UserRole;
use App\Models\Cart;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Order edge case tests — melengkapi OrderCheckoutTest.php dasar.
 * Mencakup: keranjang kosong, batalkan status salah, multi-produk, update status, boundary.
 */
class OrderEdgeCaseTest extends TestCase
{
    use RefreshDatabase;

    private function seedCatalog(array $productOverrides = []): array
    {
        $seller = User::factory()->create(['role' => UserRole::Seller]);
        $store = Store::factory()->create(['user_id' => $seller->id, 'status' => 'active']);
        $category = Category::factory()->create();
        $product = Product::factory()->create(array_merge([
            'store_id' => $store->id,
            'category_id' => $category->id,
            'price' => 50000,
            'stock' => 10,
        ], $productOverrides));

        return compact('seller', 'store', 'product');
    }

    private function addToCart(User $user, Product $product, int $qty = 1): void
    {
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $cart->items()->create([
            'product_id' => $product->id,
            'quantity' => $qty,
            'unit_price' => $product->price,
        ]);
    }

    private function createCompletedOrder(User $user, Product $product, int $qty = 1): Order
    {
        $order = Order::create([
            'user_id' => $user->id,
            'store_id' => $product->store_id,
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'status' => 'completed',
            'subtotal' => $product->price * $qty,
            'shipping_cost' => 15000,
            'discount' => 0,
            'total' => ($product->price * $qty) + 15000,
            'payment_status' => 'paid',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => $qty,
            'unit_price' => $product->price,
            'subtotal' => $product->price * $qty,
        ]);

        return $order;
    }

    // ── Empty cart ──

    public function test_checkout_keranjang_kosong_gagal(): void
    {
        $customer = User::factory()->create();

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'qris',
            'address' => ['label' => 'Rumah', 'recipient' => 'R', 'phone' => '1', 'street' => 'Jl. X', 'city' => 'Y', 'province' => 'Z'],
        ]);

        $response->assertStatus(422);
        $this->assertDatabaseCount('orders', 0);
    }

    // ── Cancel restrictions ──

    public function test_batalkan_pesanan_sudah_selesai_gagal(): void
    {
        $customer = User::factory()->create();
        ['product' => $product] = $this->seedCatalog();
        $order = $this->createCompletedOrder($customer, $product);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/orders/{$order->id}/cancel");

        $response->assertStatus(422);
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'status' => 'completed']);
    }

    public function test_batalkan_pesanan_sudah_dikirim_gagal(): void
    {
        $customer = User::factory()->create();
        ['product' => $product] = $this->seedCatalog();

        $order = Order::create([
            'user_id' => $customer->id,
            'store_id' => $product->store_id,
            'order_number' => 'ORD-SHI-' . strtoupper(uniqid()),
            'status' => 'shipped',
            'subtotal' => $product->price,
            'shipping_cost' => 15000,
            'discount' => 0,
            'total' => $product->price + 15000,
            'payment_status' => 'paid',
        ]);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/orders/{$order->id}/cancel");

        $response->assertStatus(422);
    }

    public function test_batalkan_pesanan_pending_berhasil(): void
    {
        $customer = User::factory()->create();
        ['product' => $product] = $this->seedCatalog();
        $this->addToCart($customer, $product, 2);

        $orderResponse = $this->actingAs($customer, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'qris',
            'address' => ['label' => 'Rumah', 'recipient' => 'R', 'phone' => '1', 'street' => 'Jl. X', 'city' => 'Y', 'province' => 'Z'],
        ])->assertStatus(201);

        $orderId = $orderResponse->json('data.id');

        // Batalkan → stok harus kembali
        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/orders/{$orderId}/cancel")
            ->assertStatus(200);

        $this->assertSame(10, $product->refresh()->stock); // stok kembali: 10 - 2 + 2
        $this->assertDatabaseHas('orders', ['id' => $orderId, 'status' => 'cancelled']);
    }

    public function test_batalkan_pesanan_sudah_dibayar_juga_dapat(): void
    {
        $customer = User::factory()->create();
        ['product' => $product] = $this->seedCatalog();
        $this->addToCart($customer, $product, 1);

        $orderResponse = $this->actingAs($customer, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'qris',
            'address' => ['label' => 'Rumah', 'recipient' => 'R', 'phone' => '1', 'street' => 'Jl. X', 'city' => 'Y', 'province' => 'Z'],
        ])->assertStatus(201);

        $orderId = $orderResponse->json('data.id');

        // Update status ke paid
        Order::where('id', $orderId)->update(['status' => 'paid']);

        // Batalkan
        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/orders/{$orderId}/cancel")
            ->assertStatus(200);

        $this->assertDatabaseHas('orders', ['id' => $orderId, 'status' => 'cancelled']);
    }

    // ── Multi-product checkout ──

    public function test_checkout_multi_produk(): void
    {
        $customer = User::factory()->create();
        $seller = User::factory()->create(['role' => UserRole::Seller]);
        $store = Store::factory()->create(['user_id' => $seller->id, 'status' => 'active']);
        $category = Category::factory()->create();

        $productA = Product::factory()->create([
            'store_id' => $store->id,
            'category_id' => $category->id,
            'price' => 30000,
            'stock' => 5,
        ]);
        $productB = Product::factory()->create([
            'store_id' => $store->id,
            'category_id' => $category->id,
            'price' => 20000,
            'stock' => 3,
        ]);

        $this->addToCart($customer, $productA, 2); // 2 x 30.000 = 60.000
        $this->addToCart($customer, $productB, 1); // 1 x 20.000 = 20.000

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'transfer',
            'address' => ['label' => 'Kantor', 'recipient' => 'Budi', 'phone' => '0813', 'street' => 'Jl. Gatot Subroto', 'city' => 'Jakarta Pusat', 'province' => 'DKI Jakarta'],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.subtotal', 80000); // 60.000 + 20.000

        $order = Order::find($response->json('data.id'));
        $this->assertEquals(95000, (float) $order->total); // 80.000 + ongkir 15.000
        $this->assertCount(2, $order->items);

        // Stok dikurangi
        $this->assertSame(3, $productA->refresh()->stock); // 5 - 2
        $this->assertSame(2, $productB->refresh()->stock); // 3 - 1
    }

    // ── Stock boundary ──

    public function test_checkout_stok_persis_sama_dengan_quantity(): void
    {
        $customer = User::factory()->create();
        ['product' => $product] = $this->seedCatalog(['stock' => 2]);
        $this->addToCart($customer, $product, 2); // stok = 2, qty = 2

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'qris',
            'address' => ['label' => 'Rumah', 'recipient' => 'R', 'phone' => '1', 'street' => 'Jl. X', 'city' => 'Y', 'province' => 'Z'],
        ]);

        $response->assertStatus(201);
        $this->assertSame(0, $product->refresh()->stock);
    }

    public function test_checkout_stok_satu_lebih_dari_quantity(): void
    {
        $customer = User::factory()->create();
        ['product' => $product] = $this->seedCatalog(['stock' => 3]);
        $this->addToCart($customer, $product, 2); // stok = 3, qty = 2

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'qris',
            'address' => ['label' => 'Rumah', 'recipient' => 'R', 'phone' => '1', 'street' => 'Jl. X', 'city' => 'Y', 'province' => 'Z'],
        ]);

        $response->assertStatus(201);
        $this->assertSame(1, $product->refresh()->stock);
    }

    // ── Order status update (seller) ──

    public function test_seller_update_status_order(): void
    {
        $customer = User::factory()->create();
        $seller = User::factory()->seller()->create();
        $store = Store::factory()->create(['user_id' => $seller->id, 'status' => 'active']);
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'store_id' => $store->id,
            'category_id' => $category->id,
            'price' => 50000,
            'stock' => 10,
        ]);

        $this->addToCart($customer, $product, 1);
        $orderResponse = $this->actingAs($customer, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'cod',
            'address' => ['label' => 'Rumah', 'recipient' => 'R', 'phone' => '1', 'street' => 'Jl. X', 'city' => 'Y', 'province' => 'Z'],
        ])->assertStatus(201);

        $orderId = $orderResponse->json('data.id');

        // Seller update ke processing
        $this->actingAs($seller, 'sanctum')
            ->putJson("/api/v1/seller/orders/{$orderId}/status", ['status' => 'processing'])
            ->assertStatus(200);

        $this->assertDatabaseHas('orders', ['id' => $orderId, 'status' => 'processing']);

        // Seller update ke shipped
        $this->actingAs($seller, 'sanctum')
            ->putJson("/api/v1/seller/orders/{$orderId}/status", ['status' => 'shipped'])
            ->assertStatus(200);

        $this->assertDatabaseHas('orders', ['id' => $orderId, 'status' => 'shipped']);
    }

    public function test_seller_update_status_invalid_gagal(): void
    {
        $seller = User::factory()->seller()->create();
        $store = Store::factory()->create(['user_id' => $seller->id, 'status' => 'active']);
        $customer = User::factory()->create();
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'store_id' => $store->id,
            'category_id' => $category->id,
            'price' => 50000,
            'stock' => 10,
        ]);

        $this->addToCart($customer, $product, 1);
        $orderResponse = $this->actingAs($customer, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'cod',
            'address' => ['label' => 'Rumah', 'recipient' => 'R', 'phone' => '1', 'street' => 'Jl. X', 'city' => 'Y', 'province' => 'Z'],
        ])->assertStatus(201);

        $orderId = $orderResponse->json('data.id');

        // Status tidak valid
        $this->actingAs($seller, 'sanctum')
            ->putJson("/api/v1/seller/orders/{$orderId}/status", ['status' => 'bogus'])
            ->assertStatus(422);
    }

    // ── Order list & ownership ──

    public function test_list_pesanan_hanyaMilikSendiri(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        ['product' => $product] = $this->seedCatalog();

        // UserA punya 2 order
        $this->addToCart($userA, $product, 1);
        $this->actingAs($userA, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'cod',
            'address' => ['label' => 'Rumah', 'recipient' => 'A', 'phone' => '1', 'street' => 'Jl. X', 'city' => 'Y', 'province' => 'Z'],
        ]);

        $this->addToCart($userA, $product, 1);
        $this->actingAs($userA, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'cod',
            'address' => ['label' => 'Kantor', 'recipient' => 'A', 'phone' => '1', 'street' => 'Jl. Y', 'city' => 'Z', 'province' => 'W'],
        ]);

        // UserB punya 1 order
        $this->addToCart($userB, $product, 1);
        $this->actingAs($userB, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'cod',
            'address' => ['label' => 'Rumah', 'recipient' => 'B', 'phone' => '2', 'street' => 'Jl. Z', 'city' => 'W', 'province' => 'V'],
        ]);

        // UserA hanya lihat 2 order miliknya
        $response = $this->actingAs($userA, 'sanctum')->getJson('/api/v1/orders');
        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');

        // UserB hanya lihat 1 order miliknya
        $response = $this->actingAs($userB, 'sanctum')->getJson('/api/v1/orders');
        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    // ── Payment method validation ──

    public function test_checkout_payment_method_wajib(): void
    {
        $customer = User::factory()->create();
        ['product' => $product] = $this->seedCatalog();
        $this->addToCart($customer, $product, 1);

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/v1/orders', [
            'address' => ['label' => 'Rumah', 'recipient' => 'R', 'phone' => '1', 'street' => 'Jl. X', 'city' => 'Y', 'province' => 'Z'],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('payment_method');
    }

    public function test_checkout_address_wajib(): void
    {
        $customer = User::factory()->create();
        ['product' => $product] = $this->seedCatalog();
        $this->addToCart($customer, $product, 1);

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'qris',
        ]);

        $response->assertStatus(422);
    }

    // ── Order number format ──

    public function test_order_number_format(): void
    {
        $customer = User::factory()->create();
        ['product' => $product] = $this->seedCatalog();
        $this->addToCart($customer, $product, 1);

        $orderResponse = $this->actingAs($customer, 'sanctum')->postJson('/api/v1/orders', [
            'payment_method' => 'qris',
            'address' => ['label' => 'Rumah', 'recipient' => 'R', 'phone' => '1', 'street' => 'Jl. X', 'city' => 'Y', 'province' => 'Z'],
        ])->assertStatus(201);

        $orderNumber = $orderResponse->json('data.order_number');
        $this->assertMatchesRegularExpression('/^ORD-\d{8}-[A-Z0-9]{6}$/', $orderNumber);
    }
}
