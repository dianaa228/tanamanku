<?php

namespace Tests\Unit\Services;

use App\Models\LoyaltyProfile;
use App\Models\LoyaltyReward;
use App\Models\User;
use App\Services\LoyaltyService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

/**
 * Unit tests untuk LoyaltyService.
 * Mencakup: getOrCreateProfile, earnPoints, updateTier, redeemReward, getHistory.
 */
class LoyaltyServiceTest extends TestCase
{
    use RefreshDatabase;

    private LoyaltyService $service;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new LoyaltyService();
        $this->user = User::factory()->create();
    }

    // ── Profile ──

    public function test_get_or_create_profile_creates_new(): void
    {
        $profile = $this->service->getOrCreateProfile($this->user);

        $this->assertEquals($this->user->id, $profile->user_id);
        $this->assertEquals(0, $profile->points);
        $this->assertEquals('bronze', $profile->tier);
    }

    public function test_get_or_create_profile_returns_existing(): void
    {
        LoyaltyProfile::create([
            'user_id' => $this->user->id,
            'points' => 500,
            'total_earned' => 500,
            'total_redeemed' => 0,
            'tier' => 'bronze',
        ]);

        $profile = $this->service->getOrCreateProfile($this->user);

        $this->assertEquals(500, $profile->points);
        $this->assertDatabaseCount('loyalty_profiles', 1);
    }

    // ── Earn Points ──

    public function test_earn_points(): void
    {
        $transaction = $this->service->earnPoints($this->user, 100, 'Pembelian');

        $this->assertEquals('earn', $transaction->type);
        $this->assertEquals(100, $transaction->points);
        $this->assertEquals('Pembelian', $transaction->description);

        $profile = LoyaltyProfile::where('user_id', $this->user->id)->first();
        $this->assertEquals(100, $profile->points);
        $this->assertEquals(100, $profile->total_earned);
    }

    public function test_earn_points_with_reference(): void
    {
        $transaction = $this->service->earnPoints($this->user, 50, 'Bonus order', 'order', 42);

        $this->assertEquals('order', $transaction->reference);
        $this->assertEquals(42, $transaction->reference_id);
    }

    public function test_earn_points_accumulate(): void
    {
        $this->service->earnPoints($this->user, 100, 'Pertama');
        $this->service->earnPoints($this->user, 200, 'Kedua');

        $profile = LoyaltyProfile::where('user_id', $this->user->id)->first();
        $this->assertEquals(300, $profile->points);
        $this->assertEquals(300, $profile->total_earned);
    }

    // ── Tier Upgrade ──

    public function test_tier_bronze_default(): void
    {
        $this->service->earnPoints($this->user, 10, 'Bonus');

        $profile = LoyaltyProfile::where('user_id', $this->user->id)->first();
        $this->assertEquals('bronze', $profile->tier);
    }

    public function test_tier_naik_ke_silver(): void
    {
        $this->service->earnPoints($this->user, 1000, 'Big bonus');

        $profile = LoyaltyProfile::where('user_id', $this->user->id)->first();
        $this->assertEquals('silver', $profile->tier);
    }

    public function test_tier_naik_ke_gold(): void
    {
        $this->service->earnPoints($this->user, 5000, 'Mega bonus');

        $profile = LoyaltyProfile::where('user_id', $this->user->id)->first();
        $this->assertEquals('gold', $profile->tier);
    }

    public function test_tier_naik_ke_platinum(): void
    {
        $this->service->earnPoints($this->user, 15000, 'Ultra bonus');

        $profile = LoyaltyProfile::where('user_id', $this->user->id)->first();
        $this->assertEquals('platinum', $profile->tier);
    }

    public function test_tier_turun_saat_redeem(): void
    {
        // Naik ke silver (1000 poin)
        $this->service->earnPoints($this->user, 1000, 'Bonus');

        // Redeem 500 → sisa 500 → turun ke bronze
        $reward = LoyaltyReward::factory()->create(['points_cost' => 500, 'stock' => 10]);
        $this->service->redeemReward($this->user, $reward);

        $profile = LoyaltyProfile::where('user_id', $this->user->id)->first();
        $this->assertEquals('bronze', $profile->tier);
        $this->assertEquals(500, $profile->points);
    }

    // ── Redeem ──

    public function test_redeem_reward(): void
    {
        $this->service->earnPoints($this->user, 500, 'Bonus');

        $reward = LoyaltyReward::factory()->create([
            'points_cost' => 200,
            'stock' => 10,
        ]);

        $result = $this->service->redeemReward($this->user, $reward);

        $this->assertArrayHasKey('transaction', $result);
        $this->assertArrayHasKey('voucher_code', $result);
        $this->assertStringStartsWith('TMR-', $result['voucher_code']);
        $this->assertEquals('redeem', $result['transaction']->type);
        $this->assertEquals(-200, $result['transaction']->points);

        $profile = LoyaltyProfile::where('user_id', $this->user->id)->first();
        $this->assertEquals(300, $profile->points);
        $this->assertEquals(200, $profile->total_redeemed);

        $this->assertEquals(9, $reward->fresh()->stock);
    }

    public function test_redeem_insufficient_points(): void
    {
        $this->service->earnPoints($this->user, 50, 'Sedikit bonus');

        $reward = LoyaltyReward::factory()->create(['points_cost' => 200]);

        $this->expectException(ValidationException::class);
        $this->service->redeemReward($this->user, $reward);
    }

    public function test_redeem_stock_0_tetap_bisa(): void
    {
        $this->service->earnPoints($this->user, 500, 'Bonus');

        $reward = LoyaltyReward::factory()->create([
            'points_cost' => 100,
            'stock' => 0,
        ]);

        $result = $this->service->redeemReward($this->user, $reward);
        $this->assertArrayHasKey('voucher_code', $result);
    }

    // ── History ──

    public function test_get_history(): void
    {
        $this->service->earnPoints($this->user, 100, 'Bonus 1');
        $this->service->earnPoints($this->user, 200, 'Bonus 2');

        $history = $this->service->getHistory($this->user);

        $this->assertCount(2, $history);
    }

    public function test_get_history_filtered_by_type(): void
    {
        $this->service->earnPoints($this->user, 100, 'Bonus');

        $reward = LoyaltyReward::factory()->create(['points_cost' => 50, 'stock' => 10]);
        $this->service->redeemReward($this->user, $reward);

        $earnHistory = $this->service->getHistory($this->user, ['type' => 'earn']);
        $this->assertCount(1, $earnHistory);

        $redeemHistory = $this->service->getHistory($this->user, ['type' => 'redeem']);
        $this->assertCount(1, $redeemHistory);
    }

    public function test_get_history_hanya_user_sendiri(): void
    {
        $other = User::factory()->create();
        $this->service->earnPoints($this->user, 100, 'Bonus A');
        $this->service->earnPoints($other, 200, 'Bonus B');

        $history = $this->service->getHistory($this->user);
        $this->assertCount(1, $history);
    }

    // ── Rewards ──

    public function test_get_rewards(): void
    {
        LoyaltyReward::factory()->count(3)->create(['is_active' => true]);
        LoyaltyReward::factory()->create(['is_active' => false]);

        $rewards = $this->service->getRewards();
        $this->assertCount(3, $rewards);
    }

    public function test_get_rewards_filtered_by_type(): void
    {
        LoyaltyReward::factory()->count(2)->create(['is_active' => true, 'type' => 'voucher']);
        LoyaltyReward::factory()->create(['is_active' => true, 'type' => 'merchandise']);

        $vouchers = $this->service->getRewards(['type' => 'voucher']);
        $this->assertCount(2, $vouchers);
    }
}
