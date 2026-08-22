<?php

namespace Tests\Feature\AuditLog;

use App\Models\AuditLog;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Feature tests untuk AuditLogMiddleware.
 * Mencakup: auto-logging untuk admin actions, GET tidak dilog, action mapping.
 */
class AuditLogMiddlewareTest extends TestCase
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

    // ── Basic Logging ──

    public function test_admin_action_tercatat_di_audit_log(): void
    {
        $user = User::factory()->create();

        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/users/{$user->id}/role", [
                'role' => 'seller',
            ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'update_role',
        ]);
    }

    public function test_admin_toggle_user_tercatat(): void
    {
        $user = User::factory()->create();

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$user->id}/toggle");

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'toggle_user_active',
        ]);
    }

    public function test_admin_store_verify_tercatat(): void
    {
        $seller = User::factory()->seller()->create();
        $store = \App\Models\Store::factory()->create(['user_id' => $seller->id]);

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/stores/{$store->id}/verify");

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'verify_store',
        ]);
    }

    public function test_admin_create_category_tercatat(): void
    {
        $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/admin/categories', [
                'name' => 'Tanaman Hias',
                'slug' => 'tanaman-hias',
            ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'create_category',
        ]);
    }

    public function test_admin_update_category_tercatat(): void
    {
        $category = Category::factory()->create();

        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/categories/{$category->id}", [
                'name' => 'Updated Name',
            ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'update_category',
        ]);
    }

    public function test_admin_delete_category_tercatat(): void
    {
        $category = Category::factory()->create();

        $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/v1/admin/categories/{$category->id}");

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'delete_category',
        ]);
    }

    public function test_admin_resolve_report_tercatat(): void
    {
        $report = \App\Models\Report::create([
            'reportable_type' => \App\Models\Post::class,
            'reportable_id' => 1,
            'reporter_id' => $this->customer->id,
            'reason' => 'Spam',
            'status' => 'pending',
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/community/reports/{$report->id}/resolve");

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'resolve_report',
        ]);
    }

    public function test_admin_create_plant_species_tercatat(): void
    {
        $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/admin/plant-species', [
                'name' => 'Monstera Deliciosa',
                'slug' => 'monstera-deliciosa',
                'category' => 'hias',
                'care_level' => 'mudah',
            ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'create_plant_species',
        ]);
    }

    // ── GET requests tidak dilog ──

    public function test_get_request_tidak_tercatat(): void
    {
        $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/admin/dashboard');

        $this->assertDatabaseCount('audit_logs', 0);
    }

    public function test_admin_users_list_tidak_tercatat(): void
    {
        $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/admin/users');

        $this->assertDatabaseCount('audit_logs', 0);
    }

    // ── Audit log data ──

    public function test_audit_log_mencatat_ip_address(): void
    {
        $user = User::factory()->create();

        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/users/{$user->id}/role", [
                'role' => 'seller',
            ]);

        $auditLog = AuditLog::latest()->first();
        $this->assertNotNull($auditLog->ip_address);
    }

    public function test_audit_log_mencatat_method_dan_path(): void
    {
        $user = User::factory()->create();

        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/users/{$user->id}/role", [
                'role' => 'seller',
            ]);

        $auditLog = AuditLog::latest()->first();
        $this->assertEquals('PUT', $auditLog->new_values['method']);
        $this->assertStringContainsString('admin/users', $auditLog->new_values['path']);
    }

    public function test_audit_log_mencatat_status_code(): void
    {
        $user = User::factory()->create();

        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/users/{$user->id}/role", [
                'role' => 'seller',
            ]);

        $auditLog = AuditLog::latest()->first();
        $this->assertEquals(200, $auditLog->new_values['status_code']);
    }

    // ── Non-admin routes tidak terpengaruh ──

    public function test_customer_action_tidak_tercatat(): void
    {
        $seller = User::factory()->seller()->create();
        $store = \App\Models\Store::factory()->create(['user_id' => $seller->id]);
        $product = \App\Models\Product::factory()->create(['store_id' => $store->id]);

        $this->actingAs($this->customer, 'sanctum')
            ->postJson('/api/v1/cart/items', [
                'product_id' => $product->id,
                'quantity' => 1,
            ]);

        $this->assertDatabaseCount('audit_logs', 0);
    }

    // ── Multiple actions ──

    public function test_banyak_admin_actions_tercatat_semua(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        // 1. Update role
        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/users/{$user->id}/role", [
                'role' => 'seller',
            ]);

        // 2. Toggle active
        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/users/{$user->id}/toggle");

        // 3. Update category
        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/categories/{$category->id}", [
                'name' => 'Updated',
            ]);

        $this->assertDatabaseCount('audit_logs', 3);

        $actions = AuditLog::pluck('action')->toArray();
        $this->assertContains('update_role', $actions);
        $this->assertContains('toggle_user_active', $actions);
        $this->assertContains('update_category', $actions);
    }
}
