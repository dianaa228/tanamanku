<?php

namespace Tests\Feature\Services;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_layanan_perlu_auth(): void
    {
        Service::factory()->count(3)->create(['is_active' => true]);

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/v1/services');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_detail_layanan(): void
    {
        $service = Service::factory()->create(['is_active' => true]);

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson("/api/v1/services/{$service->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.name', $service->name);
    }

    public function test_booking_layanan(): void
    {
        $user = User::factory()->create();
        $service = Service::factory()->create(['is_active' => true]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/service-orders', [
                'service_id' => $service->id,
                'schedule_at' => now()->addDays(3)->toDateTimeString(),
                'address' => ['street' => 'Jl. Sudirman No. 1', 'city' => 'Jakarta Selatan'],
                'notes' => 'Tolong bawa peralatan',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('service_orders', [
            'customer_id' => $user->id,
            'service_id' => $service->id,
        ]);
    }

    public function test_riwayat_booking_saya(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/service-orders');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}
