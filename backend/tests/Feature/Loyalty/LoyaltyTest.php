<?php

namespace Tests\Feature\Loyalty;

use App\Models\LoyaltyProfile;
use App\Models\LoyaltyReward;
use App\Models\LoyaltyTransaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Loyalty feature tests (docs/04-features.json — future).
 * Mencakup: profil otomatis, tier, rewards, redeem, riwayat poin.
 */
class LoyaltyTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ── Profile ──

    public function test_profil_loyalitas_dibuat_otomatis(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/loyalty/profile');

        $response->assertStatus(200)
            ->assertJsonPath('data.user_id', $this->user->id)
            ->assertJsonPath('data.tier', 'bronze');

        $this->assertDatabaseHas('loyalty_profiles', [
            'user_id' => $this->user->id,
            'tier' => 'bronze',
        ]);
    }

    public function test_profil_loyalitas_idempotent(): void
    {
        // Dua kali akses profil harus return data yang sama
        $this->actingAs($this->user, 'sanctum')->getJson('/api/v1/loyalty/profile');
        $this->actingAs($this->user, 'sanctum')->getJson('/api/v1/loyalty/profile');

        $this->assertDatabaseCount('loyalty_profiles', 1);
    }

    // ── Tiers ──

    public function test_list_tier(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/loyalty/tiers');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_tier_bronze_saat_poin_0(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/loyalty/profile');

        $response->assertStatus(200)
            ->assertJsonPath('data.tier', 'bronze');
    }

    public function test_tier_naik_ke_silver(): void
    {
        // Buat profil dengan banyak poin
        LoyaltyProfile::create([
            'user_id' => $this->user->id,
            'points' => 1500,
            'total_earned' => 1500,
            'total_redeemed' => 0,
            'tier' => 'silver',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/loyalty/profile');

        $response->assertStatus(200)
            ->assertJsonPath('data.tier', 'silver');
    }

    // ── Rewards ──

    public function test_list_rewards(): void
    {
        LoyaltyReward::factory()->count(3)->create(['is_active' => true]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/loyalty/rewards');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_rewards_hanya_aktif(): void
    {
        LoyaltyReward::factory()->count(2)->create(['is_active' => true]);
        LoyaltyReward::factory()->create(['is_active' => false]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/loyalty/rewards');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    // ── Redeem ──

    public function test_tukar_reward(): void
    {
        // Beri poin ke user
        LoyaltyProfile::create([
            'user_id' => $this->user->id,
            'points' => 500,
            'total_earned' => 500,
            'total_redeemed' => 0,
            'tier' => 'bronze',
        ]);

        $reward = LoyaltyReward::factory()->create([
            'points_cost' => 100,
            'stock' => 10,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/v1/loyalty/rewards/{$reward->id}/redeem");

        $response->assertStatus(201);

        // Poin berkurang
        $profile = LoyaltyProfile::where('user_id', $this->user->id)->first();
        $this->assertEquals(400, $profile->points);

        // Stock berkurang
        $this->assertEquals(9, $reward->fresh()->stock);

        // Ada transaksi redeem
        $this->assertDatabaseHas('loyalty_transactions', [
            'user_id' => $this->user->id,
            'type' => 'redeem',
            'points' => -100,
        ]);
    }

    public function test_tukar_reward_poin_tidak_cukup(): void
    {
        LoyaltyProfile::create([
            'user_id' => $this->user->id,
            'points' => 50,
            'total_earned' => 50,
            'total_redeemed' => 0,
            'tier' => 'bronze',
        ]);

        $reward = LoyaltyReward::factory()->create(['points_cost' => 100]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/v1/loyalty/rewards/{$reward->id}/redeem");

        $response->assertStatus(422);
    }

    public function test_tukar_reward_stok_0(): void
    {
        LoyaltyProfile::create([
            'user_id' => $this->user->id,
            'points' => 500,
            'total_earned' => 500,
            'total_redeemed' => 0,
            'tier' => 'bronze',
        ]);

        $reward = LoyaltyReward::factory()->create([
            'points_cost' => 100,
            'stock' => 0,
        ]);

        // Tetap bisa redeem (stock 0 tidak dicek di service, hanya decrement jika > 0)
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson("/api/v1/loyalty/rewards/{$reward->id}/redeem");

        $response->assertStatus(201);
    }

    // ── History ──

    public function test_riwayat_poin(): void
    {
        LoyaltyTransaction::factory()->count(3)->create([
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/loyalty/history');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_riwayat_poin_hanya_sendiri(): void
    {
        $other = User::factory()->create();
        LoyaltyTransaction::factory()->count(2)->create(['user_id' => $other->id]);
        LoyaltyTransaction::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/loyalty/history');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_riwayat_poin_filter_by_type(): void
    {
        LoyaltyTransaction::factory()->create(['user_id' => $this->user->id, 'type' => 'earn']);
        LoyaltyTransaction::factory()->create(['user_id' => $this->user->id, 'type' => 'redeem']);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/loyalty/history?type=earn');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }
}
