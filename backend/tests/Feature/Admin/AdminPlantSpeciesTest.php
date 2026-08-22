<?php

namespace Tests\Feature\Admin;

use App\Models\PlantSpecies;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Feature tests untuk admin plant species management.
 * Mencakup: create, update, validation, auth.
 */
class AdminPlantSpeciesTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
    }

    // ── Create Plant Species ──

    public function test_admin_bisa_buat_spesies_baru(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/admin/plant-species', [
                'name' => 'Monstera Deliciosa',
                'slug' => 'monstera-deliciosa',
                'category' => 'hias',
                'care_level' => 'mudah',
                'scientific_name' => 'Monstera deliciosa',
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('plant_species', [
            'name' => 'Monstera Deliciosa',
            'slug' => 'monstera-deliciosa',
        ]);
    }

    public function test_create_spesies_wajib_name(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/admin/plant-species', [
                'slug' => 'test',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    public function test_create_spesies_wajib_slug(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/admin/plant-species', [
                'name' => 'Test',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('slug');
    }

    public function test_create_spesies_slug_unique(): void
    {
        PlantSpecies::factory()->create(['slug' => 'monstera-deliciosa']);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/admin/plant-species', [
                'name' => 'Monstera Lain',
                'slug' => 'monstera-deliciosa',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('slug');
    }

    public function test_create_spesies_care_level_valid(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/admin/plant-species', [
                'name' => 'Test',
                'slug' => 'test-species',
                'care_level' => 'invalid_level',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('care_level');
    }

    public function test_create_spesies_care_level_mudah(): void
    {
        $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/admin/plant-species', [
                'name' => 'Aloe Vera',
                'slug' => 'aloe-vera',
                'care_level' => 'mudah',
            ]);

        $this->assertDatabaseHas('plant_species', [
            'slug' => 'aloe-vera',
            'care_level' => 'mudah',
        ]);
    }

    // ── Update Plant Species ──

    public function test_admin_bisa_update_spesies(): void
    {
        $species = PlantSpecies::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/plant-species/{$species->id}", [
                'name' => 'Updated Name',
                'care_level' => 'sulit',
            ]);

        $response->assertStatus(200);

        $species->refresh();
        $this->assertEquals('Updated Name', $species->name);
        $this->assertEquals('sulit', $species->care_level);
    }

    public function test_update_spesies_partial(): void
    {
        $species = PlantSpecies::factory()->create([
            'name' => 'Original',
            'care_level' => 'mudah',
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/plant-species/{$species->id}", [
                'name' => 'Updated',
            ]);

        $species->refresh();
        $this->assertEquals('Updated', $species->name);
        $this->assertEquals('mudah', $species->care_level); // tidak berubah
    }

    // ── Auth ──

    public function test_customer_tidak_bisa_buat_spesies(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/admin/plant-species', [
                'name' => 'Test',
                'slug' => 'test',
            ])
            ->assertStatus(403);
    }

    public function test_seller_tidak_bisa_update_spesies(): void
    {
        $seller = User::factory()->seller()->create();
        $species = PlantSpecies::factory()->create();

        $this->actingAs($seller, 'sanctum')
            ->putJson("/api/v1/admin/plant-species/{$species->id}", [
                'name' => 'Hacked',
            ])
            ->assertStatus(403);
    }

    // ── Public Access ──

    public function test_semua_orang_bisa_lihat_spesies(): void
    {
        PlantSpecies::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/plant-species');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_semua_orang_bisa_lihat_detail_spesies(): void
    {
        $species = PlantSpecies::factory()->create();

        $response = $this->getJson("/api/v1/plant-species/{$species->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.name', $species->name);
    }
}
