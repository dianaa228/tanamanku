<?php

namespace Tests\Feature\Garden;

use App\Models\PlantReminder;
use App\Models\PlantSpecies;
use App\Models\User;
use App\Models\UserPlant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Plant Reminder feature tests (docs/04-features.json — Phase 6: Plant Care).
 * Mencakup: CRUD pengingat, tandai selesai, ownership check.
 */
class PlantReminderTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    private function createPlant(): UserPlant
    {
        return UserPlant::factory()->create(['user_id' => $this->user->id]);
    }

    // ── List Reminders ──

    public function test_list_pengingat_tanaman(): void
    {
        $plant = $this->createPlant();
        PlantReminder::factory()->count(2)->create([
            'user_plant_id' => $plant->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/v1/my-garden/{$plant->id}/reminders");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_list_pengingat_global(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/my-garden/reminders');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_pengingat_tanaman_orang_lain_tidak_bisa_diakses(): void
    {
        $other = User::factory()->create();
        $otherPlant = UserPlant::factory()->create(['user_id' => $other->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson("/api/v1/my-garden/{$otherPlant->id}/reminders");

        $response->assertStatus(403);
    }

    // ── Create Reminder ──

    public function test_buat_pengingat(): void
    {
        $plant = $this->createPlant();

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/v1/my-garden/{$plant->id}/reminders", [
                'type' => 'siram',
                'frequency_days' => 3,
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('plant_reminders', [
            'user_plant_id' => $plant->id,
            'type' => 'siram',
            'frequency_days' => 3,
            'is_active' => true,
        ]);
    }

    public function test_buat_pengingat_pupuk(): void
    {
        $plant = $this->createPlant();

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/v1/my-garden/{$plant->id}/reminders", [
                'type' => 'pupuk',
                'frequency_days' => 14,
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('plant_reminders', [
            'user_plant_id' => $plant->id,
            'type' => 'pupuk',
            'frequency_days' => 14,
        ]);
    }

    public function test_buat_pengingat_type_wajib(): void
    {
        $plant = $this->createPlant();

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/v1/my-garden/{$plant->id}/reminders", [
                'frequency_days' => 3,
            ]);

        $response->assertStatus(422);
    }

    // ── Update Reminder ──

    public function test_update_pengingat(): void
    {
        $plant = $this->createPlant();
        $reminder = PlantReminder::factory()->create([
            'user_plant_id' => $plant->id,
            'type' => 'siram',
            'frequency_days' => 3,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/v1/my-garden/reminders/{$reminder->id}", [
                'type' => 'siram',
                'frequency_days' => 5,
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('plant_reminders', [
            'id' => $reminder->id,
            'frequency_days' => 5,
        ]);
    }

    // ── Delete Reminder ──

    public function test_hapus_pengingat(): void
    {
        $plant = $this->createPlant();
        $reminder = PlantReminder::factory()->create([
            'user_plant_id' => $plant->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/v1/my-garden/reminders/{$reminder->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('plant_reminders', ['id' => $reminder->id]);
    }

    public function test_hapus_pengingat_orang_lain_ditolak(): void
    {
        $other = User::factory()->create();
        $otherPlant = UserPlant::factory()->create(['user_id' => $other->id]);
        $reminder = PlantReminder::factory()->create([
            'user_plant_id' => $otherPlant->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->deleteJson("/api/v1/my-garden/reminders/{$reminder->id}");

        $response->assertStatus(403);
    }

    // ── Mark Done ──

    public function test_tandai_pengingat_selesai(): void
    {
        $plant = $this->createPlant();
        $reminder = PlantReminder::factory()->create([
            'user_plant_id' => $plant->id,
            'type' => 'siram',
            'frequency_days' => 3,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/v1/my-garden/reminders/{$reminder->id}/done");

        $response->assertStatus(200);

        // Reminder di-reschedule
        $reminder->refresh();
        $this->assertNotNull($reminder->last_done_at);

        // Care log dibuat
        $this->assertDatabaseHas('plant_care_logs', [
            'user_plant_id' => $plant->id,
            'type' => 'siram',
        ]);
    }

    public function test_tandai_pengingat_selesai_reschedule(): void
    {
        $plant = $this->createPlant();
        $reminder = PlantReminder::factory()->create([
            'user_plant_id' => $plant->id,
            'frequency_days' => 7,
        ]);

        $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/v1/my-garden/reminders/{$reminder->id}/done");

        $reminder->refresh();
        $this->assertTrue($reminder->next_due_at->isAfter(now()));
    }
}
