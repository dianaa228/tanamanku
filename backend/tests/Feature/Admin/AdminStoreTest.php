<?php

namespace Tests\Feature\Admin;

use App\Models\AuditLog;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Feature tests untuk admin store management.
 * Mencakup: list stores, verify store, audit logging.
 */
class AdminStoreTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $seller;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
        $this->seller = User::factory()->seller()->create();
    }

    // ── List Stores ──

    public function test_admin_bisa_list_semua_stores(): void
    {
        Store::factory()->count(3)->create(['user_id' => $this->seller->id]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/admin/stores');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data.data');
    }

    public function test_admin_bisa_filter_stores_by_status(): void
    {
        Store::factory()->create(['user_id' => $this->seller->id, 'status' => 'active']);
        Store::factory()->create(['user_id' => $this->seller->id, 'status' => 'pending']);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/admin/stores?status=pending');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data.data');
    }

    // ── Verify Store ──

    public function test_admin_bisa_verify_store(): void
    {
        $store = Store::factory()->create([
            'user_id' => $this->seller->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/stores/{$store->id}/verify");

        $response->assertStatus(200);

        $store->refresh();
        $this->assertEquals('active', $store->status);
    }

    public function test_verify_store_tercatat_di_audit_log(): void
    {
        $store = Store::factory()->create([
            'user_id' => $this->seller->id,
            'status' => 'pending',
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/stores/{$store->id}/verify");

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'verify_store',
            'auditable_type' => Store::class,
            'auditable_id' => $store->id,
        ]);
    }

    public function test_verify_store_mengubah_status_ke_active(): void
    {
        $store = Store::factory()->create([
            'user_id' => $this->seller->id,
            'status' => 'pending',
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/stores/{$store->id}/verify");

        $this->assertDatabaseHas('stores', [
            'id' => $store->id,
            'status' => 'active',
        ]);
    }

    public function test_verify_store_sudah_active_tetap_active(): void
    {
        $store = Store::factory()->create([
            'user_id' => $this->seller->id,
            'status' => 'active',
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/stores/{$store->id}/verify");

        $store->refresh();
        $this->assertEquals('active', $store->status);
    }

    public function test_admin_stores_menampilkan_products_count(): void
    {
        $store = Store::factory()->create(['user_id' => $this->seller->id]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/admin/stores');

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $store->id]);
    }
}
