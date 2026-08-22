<?php

namespace Tests\Feature\Nursery;

use App\Models\Nursery;
use App\Models\NurseryProduct;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Nursery feature tests (docs/04-features.json — future).
 * Mencakup: daftar nursery, detail nursery, produk nursery.
 */
class NurseryTest extends TestCase
{
    use RefreshDatabase;

    private function createNursery(array $overrides = []): Nursery
    {
        return Nursery::create(array_merge([
            'owner_id' => User::factory()->create()->id,
            'name' => 'Green Thumb Nursery',
            'slug' => 'green-thumb-nursery',
            'description' => 'Toko tanaman hias terlengkap',
            'address' => 'Jl. Sudirman No. 123',
            'city' => 'Jakarta Selatan',
            'province' => 'DKI Jakarta',
            'phone' => '081234567890',
            'email' => 'greenthumb@email.com',
            'hours' => '08:00 - 17:00',
            'is_open' => true,
            'rating_avg' => 4.5,
            'reviews_count' => 120,
            'products_count' => 50,
            'images' => ['nursery_1.jpg'],
            'categories' => ['tanaman-hias', 'media-tanam'],
            'founded_year' => 2020,
        ], $overrides));
    }

    public function test_list_nursery(): void
    {
        $this->createNursery();
        $this->createNursery(['name' => 'Taman Sejahtera', 'slug' => 'taman-sejahtera']);

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/v1/nurseries');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_filter_nursery_by_city(): void
    {
        $this->createNursery(['city' => 'Jakarta Selatan']);
        $this->createNursery(['name' => 'Bandung Plants', 'slug' => 'bandung-plants', 'city' => 'Bandung']);

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/v1/nurseries?city=Jakarta Selatan');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_filter_nursery_by_search(): void
    {
        $this->createNursery(['name' => 'Green Thumb']);
        $this->createNursery(['name' => 'Taman Sejahtera', 'slug' => 'taman-sejahtera']);

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/v1/nurseries?search=Green');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_detail_nursery_by_id(): void
    {
        $nursery = $this->createNursery();

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson("/api/v1/nurseries/{$nursery->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Green Thumb Nursery');
    }

    public function test_detail_nursery_by_slug(): void
    {
        $nursery = $this->createNursery();

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/v1/nurseries/green-thumb-nursery');

        $response->assertStatus(200)
            ->assertJsonPath('data.slug', 'green-thumb-nursery');
    }

    public function test_nursery_tidak_ditemukan(): void
    {
        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/v1/nurseries/tidak-ada');

        $response->assertStatus(404);
    }

    public function test_produk_nursery(): void
    {
        $nursery = $this->createNursery();
        NurseryProduct::factory()->count(3)->create([
            'nursery_id' => $nursery->id,
            'is_active' => true,
        ]);

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson("/api/v1/nurseries/{$nursery->id}/products");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_produk_nursery_hanya_aktif(): void
    {
        $nursery = $this->createNursery();
        NurseryProduct::factory()->count(2)->create([
            'nursery_id' => $nursery->id,
            'is_active' => true,
        ]);
        NurseryProduct::factory()->create([
            'nursery_id' => $nursery->id,
            'is_active' => false,
        ]);

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson("/api/v1/nurseries/{$nursery->id}/products");

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }
}
