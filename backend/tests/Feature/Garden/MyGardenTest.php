<?php

namespace Tests\Feature\Garden;

use App\Models\PlantSpecies;
use App\Models\User;
use App\Models\UserPlant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MyGardenTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_list_tanaman_saya(): void
    {
        UserPlant::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/my-garden');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(3, 'data');
    }

    public function test_tambah_tanaman(): void
    {
        $species = PlantSpecies::factory()->create();

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/my-garden', [
                'nickname' => 'Monstera Ku',
                'plant_species_id' => $species->id,
                'location' => 'Ruang Tamu',
                'planted_at' => '2026-01-15',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.nickname', 'Monstera Ku');

        $this->assertDatabaseHas('user_plants', [
            'user_id' => $this->user->id,
            'nickname' => 'Monstera Ku',
        ]);
    }

    public function test_detail_tanaman(): void
    {
        $plant = UserPlant::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/v1/my-garden/{$plant->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $plant->id);
    }

    public function test_tanaman_orang_lain_tidak_bisa_diakses(): void
    {
        $other = User::factory()->create();
        $plant = UserPlant::factory()->create(['user_id' => $other->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/v1/my-garden/{$plant->id}");

        $response->assertStatus(403);
    }

    public function test_catat_perawatan(): void
    {
        $plant = UserPlant::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/v1/my-garden/{$plant->id}/care", [
                'type' => 'siram',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('plant_care_logs', [
            'user_plant_id' => $plant->id,
            'type' => 'siram',
        ]);
    }

    public function test_hapus_tanaman(): void
    {
        $plant = UserPlant::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/v1/my-garden/{$plant->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('user_plants', ['id' => $plant->id]);
    }

    public function test_list_pengingat_global(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/my-garden/reminders');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}
