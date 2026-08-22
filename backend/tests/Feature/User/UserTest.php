<?php

namespace Tests\Feature\User;

use App\Models\Address;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * User feature tests (docs/04-features.json — Phase 2: Auth).
 * Mencakup: profil, alamat, admin user management.
 */
class UserTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    // ── Profile ──

    public function test_lihat_profil_saya(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/users/me');

        $response->assertStatus(200)
            ->assertJsonPath('data.email', $this->user->email);
    }

    public function test_update_profil(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson('/api/v1/users/me', [
                'name' => 'Nama Baru',
                'phone' => '081234567890',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'Nama Baru',
        ]);
    }

    public function test_update_profil_nama_wajib_string(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson('/api/v1/users/me', [
                'name' => 12345,
            ]);

        $response->assertStatus(422);
    }

    // ── Addresses ──

    public function test_lihat_daftar_alamat(): void
    {
        Address::factory()->count(2)->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/users/me/addresses');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_tambah_alamat(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/users/me/addresses', [
                'label' => 'Rumah',
                'recipient' => 'Rina',
                'phone' => '081234567890',
                'province' => 'DKI Jakarta',
                'city' => 'Jakarta Selatan',
                'district' => 'Kebayoran Baru',
                'street' => 'Jl. Senopati No. 12',
                'postal_code' => '12190',
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('addresses', [
            'user_id' => $this->user->id,
            'label' => 'Rumah',
        ]);
    }

    public function test_tambah_alamat_wajib(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->postJson('/api/v1/users/me/addresses', []);

        $response->assertStatus(422);
    }

    public function test_update_alamat_saya(): void
    {
        $address = Address::factory()->create(['user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/v1/users/me/addresses/{$address->id}", [
                'label' => 'Kantor',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('addresses', [
            'id' => $address->id,
            'label' => 'Kantor',
        ]);
    }

    public function test_update_alamat_orang_lain_ditolak(): void
    {
        $other = User::factory()->create();
        $address = Address::factory()->create(['user_id' => $other->id]);

        $response = $this->actingAs($this->user, 'sanctum')
            ->putJson("/api/v1/users/me/addresses/{$address->id}", [
                'label' => 'Hack',
            ]);

        $response->assertStatus(403);
    }

    // ── Admin ──

    public function test_admin_dashboard(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure(['data' => ['users', 'sellers', 'orders', 'revenue']]);
    }

    public function test_admin_list_users(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->count(3)->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/users');

        $response->assertStatus(200);
    }

    public function test_admin_update_role(): void
    {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($admin, 'sanctum')
            ->putJson("/api/v1/admin/users/{$customer->id}/role", [
                'role' => 'seller',
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'id' => $customer->id,
            'role' => 'seller',
        ]);
    }

    public function test_admin_toggle_active(): void
    {
        $admin = User::factory()->admin()->create();
        $customer = User::factory()->create(['is_active' => true]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$customer->id}/toggle");

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'id' => $customer->id,
            'is_active' => false,
        ]);
    }

    public function test_customer_tidak_bisa_akses_admin(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')
            ->getJson('/api/v1/admin/users');

        $response->assertStatus(403);
    }
}
