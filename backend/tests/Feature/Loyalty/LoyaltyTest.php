<?php

namespace Tests\Feature\Loyalty;

use App\Models\LoyaltyProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoyaltyTest extends TestCase
{
    use RefreshDatabase;

    public function test_profil_loyalitas_dibuat_otomatis(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/loyalty/profile');

        $response->assertStatus(200)
            ->assertJsonPath('data.user_id', $user->id)
            ->assertJsonPath('data.tier', 'bronze');

        $this->assertDatabaseHas('loyalty_profiles', [
            'user_id' => $user->id,
            'tier' => 'bronze',
        ]);
    }

    public function test_list_tier(): void
    {
        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/v1/loyalty/tiers');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_list_rewards(): void
    {
        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/v1/loyalty/rewards');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_riwayat_poin(): void
    {
        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/v1/loyalty/history');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}
