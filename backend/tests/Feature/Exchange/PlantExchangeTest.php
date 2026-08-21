<?php

namespace Tests\Feature\Exchange;

use App\Models\PlantExchange;
use App\Models\PlantListing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlantExchangeTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_listing_perlu_auth(): void
    {
        PlantListing::factory()->count(3)->create(['status' => 'active']);

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/v1/plant-exchange/listings');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_buat_listing(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/plant-exchange/listings', [
                'title' => 'Monstera Deliciosa',
                'description' => 'Monstera sehat, sudah 6 bulan',
                'price' => 75000,
                'type' => 'sell',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Monstera Deliciosa');

        $this->assertDatabaseHas('plant_listings', [
            'user_id' => $user->id,
            'title' => 'Monstera Deliciosa',
            'type' => 'sell',
        ]);
    }

    public function test_detail_listing(): void
    {
        $listing = PlantListing::factory()->create(['status' => 'active']);

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson("/api/v1/plant-exchange/listings/{$listing->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.title', $listing->title);
    }

    public function test_listing_saya(): void
    {
        $user = User::factory()->create();
        PlantListing::factory()->count(2)->create(['user_id' => $user->id, 'status' => 'active']);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/plant-exchange/listings/mine');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_kirim_tawaran(): void
    {
        $seller = User::factory()->create();
        $buyer = User::factory()->create();
        $listing = PlantListing::factory()->create(['user_id' => $seller->id, 'status' => 'active']);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson("/api/v1/plant-exchange/listings/{$listing->id}/offer", [
                'message' => 'Mau tukar dengan Monstera saya',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('plant_exchanges', [
            'listing_id' => $listing->id,
            'offerer_id' => $buyer->id,
            'status' => 'pending',
        ]);
    }

    public function test_tidak_bisa_tawar_listing_sendiri(): void
    {
        $user = User::factory()->create();
        $listing = PlantListing::factory()->create(['user_id' => $user->id, 'status' => 'active']);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/plant-exchange/listings/{$listing->id}/offer", [
                'message' => 'Tawar sendiri',
            ]);

        $response->assertStatus(422);
    }

    public function test_pertukaran_saya(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/plant-exchange/exchanges/mine');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}
