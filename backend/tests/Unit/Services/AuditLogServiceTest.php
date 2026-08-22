<?php

namespace Tests\Unit\Services;

use App\Models\AuditLog;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Unit tests untuk AuditLogService.
 * Mencakup: log action, record changes, get history, get admin actions.
 */
class AuditLogServiceTest extends TestCase
{
    use RefreshDatabase;

    private AuditLogService $service;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new AuditLogService();
        $this->admin = User::factory()->admin()->create();
    }

    // ── Log Action ──

    public function test_log_mencatat_aksi_ke_database(): void
    {
        $user = User::factory()->create();

        $auditLog = $this->service->log(
            user: $this->admin,
            action: 'update_role',
            model: $user,
            oldValues: ['role' => 'customer'],
            newValues: ['role' => 'seller'],
            description: 'Role diubah dari customer ke seller'
        );

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'update_role',
            'auditable_type' => User::class,
            'auditable_id' => $user->id,
            'description' => 'Role diubah dari customer ke seller',
        ]);

        $this->assertEquals('update_role', $auditLog->action);
        $this->assertEquals(['role' => 'customer'], $auditLog->old_values);
        $this->assertEquals(['role' => 'seller'], $auditLog->new_values);
    }

    public function test_log_tanpa_user_system_action(): void
    {
        $user = User::factory()->create();

        $auditLog = $this->service->log(
            user: null,
            action: 'system_cleanup',
            model: $user,
            description: 'Scheduled cleanup'
        );

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => 0,
            'action' => 'system_cleanup',
        ]);
    }

    public function test_log_mencatat_ip_address(): void
    {
        $user = User::factory()->create();

        $this->service->log(
            user: $this->admin,
            action: 'test_action',
            model: $user
        );

        $auditLog = AuditLog::latest()->first();
        $this->assertNotNull($auditLog->ip_address);
    }

    // ── Record Changes ──

    public function test_record_changes_mencatat_perubahan(): void
    {
        $user = User::factory()->create(['role' => 'customer']);

        // Simulasi perubahan
        $original = $user->getOriginal();
        $user->role = 'seller';

        $auditLog = $this->service->recordChanges(
            user: $this->admin,
            action: 'update_role',
            model: $user,
            changedAttributes: ['role'],
            description: 'Role updated'
        );

        $this->assertEquals(['role' => 'customer'], $auditLog->old_values);
        $this->assertEquals(['role' => 'seller'], $auditLog->new_values);
    }

    public function test_record_changes_hanya_field_berubah(): void
    {
        $user = User::factory()->create([
            'name' => 'Original Name',
            'role' => 'customer',
        ]);

        $original = $user->getOriginal();
        $user->name = 'Updated Name';
        $user->role = 'seller';

        $auditLog = $this->service->recordChanges(
            user: $this->admin,
            action: 'update_user',
            model: $user,
            changedAttributes: ['name', 'role'],
            description: 'User updated'
        );

        $this->assertCount(2, $auditLog->old_values);
        $this->assertEquals('Original Name', $auditLog->old_values['name']);
        $this->assertEquals('customer', $auditLog->old_values['role']);
        $this->assertEquals('Updated Name', $auditLog->new_values['name']);
        $this->assertEquals('seller', $auditLog->new_values['role']);
    }

    // ── Get History ──

    public function test_get_history_untuk_model(): void
    {
        $user = User::factory()->create();

        // Buat beberapa audit log
        $this->service->log($this->admin, 'action_1', $user);
        $this->service->log($this->admin, 'action_2', $user);
        $this->service->log($this->admin, 'action_3', $user);

        $history = $this->service->getHistory(User::class, $user->id);

        $this->assertCount(3, $history);
        $this->assertEquals('action_3', $history->first()->action); // latest first
    }

    public function test_get_history_dengan_limit(): void
    {
        $user = User::factory()->create();

        for ($i = 0; $i < 10; $i++) {
            $this->service->log($this->admin, "action_{$i}", $user);
        }

        $history = $this->service->getHistory(User::class, $user->id, 5);

        $this->assertCount(5, $history);
    }

    public function test_get_history_dengan_user_relationship(): void
    {
        $user = User::factory()->create();

        $this->service->log($this->admin, 'test_action', $user);

        $history = $this->service->getHistory(User::class, $user->id);
        $log = $history->first();

        $this->assertNotNull($log->user);
        $this->assertEquals($this->admin->id, $log->user->id);
    }

    // ── Get Admin Actions ──

    public function test_get_admin_actions(): void
    {
        $user = User::factory()->create();

        $this->service->log($this->admin, 'update_role', $user);
        $this->service->log($this->admin, 'verify_store', $user);
        $this->service->log($this->admin, 'delete_category', $user);

        $actions = $this->service->getAdminActions(30);

        $this->assertCount(3, $actions);
    }

    public function test_get_admin_actions_dengan_filter_waktu(): void
    {
        $user = User::factory()->create();

        // Buat log 60 hari yang lalu (di luar default 30 hari)
        AuditLog::create([
            'user_id' => $this->admin->id,
            'action' => 'old_action',
            'auditable_type' => User::class,
            'auditable_id' => $user->id,
            'created_at' => now()->subDays(60),
        ]);

        // Buat log baru
        $this->service->log($this->admin, 'new_action', $user);

        $actions = $this->service->getAdminActions(30);

        $this->assertCount(1, $actions);
        $this->assertEquals('new_action', $actions->first()->action);
    }

    // ── Scopes ──

    public function test_scope_for_model(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $this->service->log($this->admin, 'action_a', $userA);
        $this->service->log($this->admin, 'action_b', $userB);

        $logsA = AuditLog::forModel(User::class, $userA->id)->get();
        $logsB = AuditLog::forModel(User::class, $userB->id)->get();

        $this->assertCount(1, $logsA);
        $this->assertCount(1, $logsB);
        $this->assertEquals('action_a', $logsA->first()->action);
        $this->assertEquals('action_b', $logsB->first()->action);
    }

    public function test_scope_for_action(): void
    {
        $user = User::factory()->create();

        $this->service->log($this->admin, 'update_role', $user);
        $this->service->log($this->admin, 'verify_store', $user);
        $this->service->log($this->admin, 'update_role', $user);

        $roleLogs = AuditLog::forAction('update_role')->get();
        $storeLogs = AuditLog::forAction('verify_store')->get();

        $this->assertCount(2, $roleLogs);
        $this->assertCount(1, $storeLogs);
    }

    public function test_scope_recent(): void
    {
        $user = User::factory()->create();

        // Log baru
        $this->service->log($this->admin, 'new_action', $user);

        // Log lama (60 hari)
        AuditLog::create([
            'user_id' => $this->admin->id,
            'action' => 'old_action',
            'auditable_type' => User::class,
            'auditable_id' => $user->id,
            'created_at' => now()->subDays(60),
        ]);

        $recent = AuditLog::recent(30)->get();

        $this->assertCount(1, $recent);
    }
}
