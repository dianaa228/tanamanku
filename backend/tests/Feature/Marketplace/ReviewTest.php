<?php

namespace Tests\Feature\Marketplace;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Review feature tests (docs/04-features.json — next_version).
 * Mencakup: kirim ulasan, filter by product, aturan hanya pesanan selesai.
 */
class ReviewTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    private function createCompletedOrderItem(): OrderItem
    {
        $seller = User::factory()->seller()->create();
        $store = Store::factory()->create(['user_id' => $seller->id]);
        $product = Product::factory()->create(['store_id' => $store->id]);

        $order = Order::create([
            'user_id' => $this->user->id,
            'store_id' => $store->id,
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'status' => 'completed',
            'subtotal' => $product->price,
            'shipping_cost' => 15000,
            'discount' => 0,
            'total' => $product->price + 15000,
            'payment_status' => 'paid',
        ]);

        return OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'unit_price' => $product->price,
            'subtotal' => $product->price,
        ]);
    }

    public function test_list_ulasan(): void
    {
        Review::factory()->count(3)->create();

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/reviews');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_kirim_ulasan(): void
    {
        $orderItem = $this->createCompletedOrderItem();

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/reviews', [
                'order_item_id' => $orderItem->id,
                'rating' => 5,
                'comment' => 'Tanaman sangat sehat dan packing rapi!',
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('reviews', [
            'order_item_id' => $orderItem->id,
            'user_id' => $this->user->id,
            'rating' => 5,
        ]);
    }

    public function test_ulasan_rating_wajib(): void
    {
        $orderItem = $this->createCompletedOrderItem();

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/reviews', [
                'order_item_id' => $orderItem->id,
                'comment' => 'Bagus',
            ]);

        $response->assertStatus(422);
    }

    public function test_ulasan_rating_out_of_range(): void
    {
        $orderItem = $this->createCompletedOrderItem();

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/reviews', [
                'order_item_id' => $orderItem->id,
                'rating' => 6,
            ]);

        $response->assertStatus(422);
    }

    public function test_ulasan_hanya_untuk_pesanan_selesai(): void
    {
        $seller = User::factory()->seller()->create();
        $store = Store::factory()->create(['user_id' => $seller->id]);
        $product = Product::factory()->create(['store_id' => $store->id]);

        $order = Order::create([
            'user_id' => $this->user->id,
            'store_id' => $store->id,
            'order_number' => 'ORD-' . strtoupper(uniqid()),
            'status' => 'pending', // belum selesai
            'subtotal' => $product->price,
            'shipping_cost' => 15000,
            'discount' => 0,
            'total' => $product->price + 15000,
            'payment_status' => 'pending',
        ]);

        $orderItem = OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'unit_price' => $product->price,
            'subtotal' => $product->price,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/reviews', [
                'order_item_id' => $orderItem->id,
                'rating' => 5,
            ]);

        $response->assertStatus(403);
    }

    public function test_orang_lain_tidak_bisa_ulas_pesanan_kita(): void
    {
        $orderItem = $this->createCompletedOrderItem();
        $intruder = User::factory()->create();

        $response = $this->actingAs($intruder, 'sanctum')
            ->postJson('/api/v1/reviews', [
                'order_item_id' => $orderItem->id,
                'rating' => 1,
                'comment' => 'Review palsu',
            ]);

        $response->assertStatus(403);
    }

    public function test_filter_ulasan_by_product(): void
    {
        Review::factory()->count(2)->create();

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/reviews?product_id=1');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_ulasan_update_if_already_exists(): void
    {
        $orderItem = $this->createCompletedOrderItem();

        // Ulasan pertama
        $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/reviews', [
                'order_item_id' => $orderItem->id,
                'rating' => 3,
                'comment' => 'Biasa saja',
            ])->assertStatus(201);

        // Ulasan kedua (update)
        $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/reviews', [
                'order_item_id' => $orderItem->id,
                'rating' => 5,
                'comment' => 'Setelah dipakai, ternyata bagus!',
            ])->assertStatus(201);

        // Harusnya hanya 1 review (updateOrCreate)
        $this->assertDatabaseCount('reviews', 1);
        $this->assertDatabaseHas('reviews', [
            'order_item_id' => $orderItem->id,
            'rating' => 5,
        ]);
    }
}
