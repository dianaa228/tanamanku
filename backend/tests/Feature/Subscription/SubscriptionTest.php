<?php

namespace Tests\Feature\Subscription;

use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Subscription feature tests (docs/04-features.json).
 * Mencakup: paket langganan, berlangganan, batalkan, riwayat billing.
 */
class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    private function createPlan(array $overrides = []): SubscriptionPlan
    {
        return SubscriptionPlan::create(array_merge([
            'slug' => 'premium',
            'name' => 'Tanamanku Premium',
            'badge' => 'Premium',
            'price' => 49000,
            'period' => 'monthly',
            'description' => 'Langganan premium dengan benefit lengkap',
            'features' => ['Gratis ongkir', 'Double poin', 'Prioritas support'],
            'is_popular' => true,
            'is_active' => true,
        ], $overrides));
    }

    public function test_list_paket_langganan(): void
    {
        $this->createPlan();
        $this->createPlan(['slug' => 'basic', 'name' => 'Basic', 'price' => 19000, 'is_popular' => false]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/subscription/plans');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_berlangganan(): void
    {
        $plan = $this->createPlan();

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/subscription/subscribe', [
                'plan_id' => 'premium',
                'payment_method' => 'qris',
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('subscriptions', [
            'user_id' => $this->user->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'payment_method' => 'qris',
        ]);
    }

    public function test_lihat_langganan_aktif(): void
    {
        $plan = $this->createPlan();
        Subscription::create([
            'user_id' => $this->user->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'started_at' => now(),
            'expires_at' => now()->addMonth(),
            'auto_renew' => true,
            'payment_method' => 'qris',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/subscription/current');

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'active');
    }

    public function test_batalkan_langganan(): void
    {
        $plan = $this->createPlan();
        $subscription = Subscription::create([
            'user_id' => $this->user->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'started_at' => now(),
            'expires_at' => now()->addMonth(),
            'auto_renew' => true,
            'payment_method' => 'qris',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/subscription/cancel');

        $response->assertStatus(200);

        $this->assertDatabaseHas('subscriptions', [
            'id' => $subscription->id,
            'status' => 'cancelled',
            'auto_renew' => false,
        ]);
    }

    public function test_batalkan_langganan_tidak_aktif_gagal(): void
    {
        // User tanpa langganan aktif
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/subscription/cancel');

        $response->assertStatus(404); // firstOrFail
    }

    public function test_riwayat_billing(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/subscription/billing');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_berlangganan_membatalkan_yang_lama(): void
    {
        $plan = $this->createPlan();

        // Langganan pertama
        $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/subscription/subscribe', [
                'plan_id' => 'premium',
                'payment_method' => 'qris',
            ])->assertStatus(201);

        // Ganti paket → yang lama harus cancelled
        $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/subscription/subscribe', [
                'plan_id' => 'premium',
                'payment_method' => 'transfer',
            ])->assertStatus(201);

        $activeCount = Subscription::where('user_id', $this->user->id)
            ->where('status', 'active')
            ->count();

        $this->assertEquals(1, $activeCount);
    }
}
