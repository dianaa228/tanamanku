<?php

namespace Tests\Feature\Admin;

use App\Models\AuditLog;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Feature tests untuk admin user management.
 * Mencakup: dashboard, list users, update role, toggle active, audit logging.
 */
class AdminUserTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $customer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
        $this->customer = User::factory()->create();
    }

    // ── Auth ──

    public function test_admin_routes_perlu_autentikasi(): void
    {
        $this->getJson('/api/v1/admin/users')->assertStatus(401);
    }

    public function test_customer_tidak_bisa_akses_admin_routes(): void
    {
        $this->actingAs($this->customer, 'sanctum')
            ->getJson('/api/v1/admin/users')
            ->assertStatus(403);
    }

    public function test_seller_tidak_bisa_akses_admin_routes(): void
    {
        $seller = User::factory()->seller()->create();
        $this->actingAs($seller, 'sanctum')
            ->getJson('/api/v1/admin/users')
            ->assertStatus(403);
    }

    // ── Dashboard ──

    public function test_admin_dashboard_menampilkan_stats(): void
    {
        // Buat data test
        User::factory()->count(5)->create();
        User::factory()->seller()->count(2)->create();
        Order::factory()->count(3)->create(['total' => 100000]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(200)
            ->assertJsonPath('data.users', User::count())
            ->assertJsonStructure([
                'data' => ['users', 'sellers', 'orders', 'revenue'],
            ]);
    }

    // ── List Users ──

    public function test_admin_bisa_list_semua_users(): void
    {
        User::factory()->count(10)->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/admin/users');

        $response->assertStatus(200)
            ->assertJsonCount(11, 'data.data'); // 10 + admin
    }

    public function test_admin_bisa_filter_users_by_role(): void
    {
        User::factory()->count(3)->create(['role' => 'customer']);
        User::factory()->seller()->count(2)->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/admin/users?role=seller');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data.data');
    }

    public function test_admin_bisa_search_users(): void
    {
        User::factory()->create(['name' => 'Budi Santoso']);
        User::factory()->create(['name' => 'Sari Dewi']);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/admin/users?search=Budi');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data.data');
    }

    // ── Update Role ──

    public function test_admin_bisa_update_role_user(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/users/{$this->customer->id}/role", [
                'role' => 'seller',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.role', 'seller');

        $this->customer->refresh();
        $this->assertEquals('seller', $this->customer->role->value);
    }

    public function test_admin_bisa_update_role_ke_admin(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/users/{$this->customer->id}/role", [
                'role' => 'admin',
            ]);

        $response->assertStatus(200);
        $this->customer->refresh();
        $this->assertEquals('admin', $this->customer->role->value);
    }

    public function test_update_role_wajib(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/users/{$this->customer->id}/role", []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('role');
    }

    public function test_update_role_tidak_valid(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/users/{$this->customer->id}/role", [
                'role' => 'superadmin',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('role');
    }

    // ── Toggle Active ──

    public function test_admin_bisa_nonaktifkan_user(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$this->customer->id}/toggle");

        $response->assertStatus(200);

        $this->customer->refresh();
        $this->assertFalse($this->customer->is_active);
    }

    public function test_admin_bisa_aktifkan_user(): void
    {
        $this->customer->update(['is_active' => false]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$this->customer->id}/toggle");

        $response->assertStatus(200);

        $this->customer->refresh();
        $this->assertTrue($this->customer->is_active);
    }

    public function test_toggle_active_idempotent(): void
    {
        // Toggle sekali → nonaktif
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$this->customer->id}/toggle")
            ->assertStatus(200);

        // Toggle lagi → aktif
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$this->customer->id}/toggle")
            ->assertStatus(200);

        $this->customer->refresh();
        $this->assertTrue($this->customer->is_active);
    }

    // ── Audit Log ──

    public function test_update_role_tercatat_di_audit_log(): void
    {
        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/users/{$this->customer->id}/role", [
                'role' => 'seller',
            ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'update_role',
            'auditable_type' => User::class,
            'auditable_id' => $this->customer->id,
        ]);
    }

    public function test_toggle_active_tercatat_di_audit_log(): void
    {
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$this->customer->id}/toggle");

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'toggle_user_active',
        ]);
    }
}
