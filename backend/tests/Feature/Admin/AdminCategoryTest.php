<?php

namespace Tests\Feature\Admin;

use App\Models\AuditLog;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Feature tests untuk admin category management.
 * Mencakup: create, update, delete (soft), audit logging.
 */
class AdminCategoryTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
    }

    // ── Create Category ──

    public function test_admin_bisa_buat_kategori_baru(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/admin/categories', [
                'name' => 'Tanaman Hias',
                'slug' => 'tanaman-hias',
                'icon' => '🪴',
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('categories', [
            'name' => 'Tanaman Hias',
            'slug' => 'tanaman-hias',
        ]);
    }

    public function test_create_kategori_wajib_name(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/admin/categories', [
                'slug' => 'test',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    public function test_create_kategori_wajib_slug(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/admin/categories', [
                'name' => 'Test',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('slug');
    }

    public function test_create_kategori_slug_unique(): void
    {
        Category::factory()->create(['slug' => 'tanaman-hias']);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/admin/categories', [
                'name' => 'Tanaman Hias Lain',
                'slug' => 'tanaman-hias',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('slug');
    }

    public function test_create_kategori_tercatat_di_audit_log(): void
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

    // ── Update Category ──

    public function test_admin_bisa_update_kategori(): void
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/categories/{$category->id}", [
                'name' => 'Updated Name',
                'slug' => $category->slug,
            ]);

        $response->assertStatus(200);

        $category->refresh();
        $this->assertEquals('Updated Name', $category->name);
    }

    public function test_update_kategori_tercatat_di_audit_log(): void
    {
        $category = Category::factory()->create();

        $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/admin/categories/{$category->id}", [
                'name' => 'Updated',
                'slug' => $category->slug,
            ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'update_category',
        ]);
    }

    // ── Delete Category (soft) ──

    public function test_admin_bisa_nonaktifkan_kategori(): void
    {
        $category = Category::factory()->create(['is_active' => true]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/v1/admin/categories/{$category->id}");

        $response->assertStatus(200);

        $category->refresh();
        $this->assertFalse($category->is_active);
    }

    public function test_delete_kategori_tercatat_di_audit_log(): void
    {
        $category = Category::factory()->create();

        $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/v1/admin/categories/{$category->id}");

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'delete_category',
        ]);
    }

    public function test_delete_kategori_tidak_benar_benar_hapus(): void
    {
        $category = Category::factory()->create();

        $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/v1/admin/categories/{$category->id}");

        // Record masih ada, tapi is_active = false
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'is_active' => false,
        ]);
    }

    // ── Auth ──

    public function test_customer_tidak_bisa_buat_kategori(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer, 'sanctum')
            ->postJson('/api/v1/admin/categories', [
                'name' => 'Test',
                'slug' => 'test',
            ])
            ->assertStatus(403);
    }

    public function test_seller_tidak_bisa_hapus_kategori(): void
    {
        $seller = User::factory()->seller()->create();
        $category = Category::factory()->create();

        $this->actingAs($seller, 'sanctum')
            ->deleteJson("/api/v1/admin/categories/{$category->id}")
            ->assertStatus(403);
    }
}
