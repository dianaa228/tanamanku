<?php

namespace Tests\Feature\Marketplace;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_kategori_publik_dapat_diakses_tanpa_token(): void
    {
        Category::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/categories');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(3, 'data');
    }

    public function test_produk_publik_dapat_diakses_tanpa_token(): void
    {
        $seller = User::factory()->seller()->create();
        $store = Store::factory()->create(['user_id' => $seller->id]);
        Product::factory()->count(3)->create(['store_id' => $store->id, 'is_active' => true]);

        $response = $this->getJson('/api/v1/products');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_detail_produk_berdasarkan_slug(): void
    {
        $seller = User::factory()->seller()->create();
        $store = Store::factory()->create(['user_id' => $seller->id]);
        Product::factory()->create([
            'store_id' => $store->id,
            'name' => 'Monstera Deliciosa',
            'slug' => 'monstera-deliciosa',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/products/monstera-deliciosa');

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Monstera Deliciosa']);
    }

    public function test_detail_produk_tidak_ditemukan(): void
    {
        $response = $this->getJson('/api/v1/products/tidak-ada-slug');

        $response->assertStatus(404);
    }

    public function test_seller_dapat_melihat_produk_sendiri(): void
    {
        $seller = User::factory()->seller()->create();
        $store = Store::factory()->create(['user_id' => $seller->id]);
        Product::factory()->count(2)->create(['store_id' => $store->id]);

        $response = $this->actingAs($seller, 'sanctum')
            ->getJson('/api/v1/seller/products');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_seller_tanpa_toko_tidak_bisa_lihat_produk(): void
    {
        $seller = User::factory()->seller()->create();

        $response = $this->actingAs($seller, 'sanctum')
            ->getJson('/api/v1/seller/products');

        $response->assertStatus(403);
    }

    public function test_customer_tidak_bisa_akses_seller_products(): void
    {
        $customer = User::factory()->create();

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/seller/products');

        $response->assertStatus(403);
    }
}
