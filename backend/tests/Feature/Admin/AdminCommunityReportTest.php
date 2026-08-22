<?php

namespace Tests\Feature\Admin;

use App\Models\AuditLog;
use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Feature tests untuk admin community report management.
 * Mencakup: list reported posts, resolve report, audit logging.
 */
class AdminCommunityReportTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $reporter;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
        $this->reporter = User::factory()->create();
    }

    // ── List Reports ──

    public function test_admin_bisa_list_laporan(): void
    {
        $post = Post::factory()->create(['user_id' => $this->reporter->id]);
        Report::create([
            'reportable_type' => Post::class,
            'reportable_id' => $post->id,
            'reporter_id' => $this->reporter->id,
            'reason' => 'Spam',
            'status' => 'open',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/admin/community/reports');

        $response->assertStatus(200);
    }

    // ── Resolve Report ──

    public function test_admin_bisa_selesaikan_laporan(): void
    {
        $post = Post::factory()->create(['user_id' => $this->reporter->id]);
        $report = Report::create([
            'reportable_type' => Post::class,
            'reportable_id' => $post->id,
            'reporter_id' => $this->reporter->id,
            'reason' => 'Spam',
            'status' => 'open',
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/community/reports/{$report->id}/resolve");

        $response->assertStatus(200);

        $report->refresh();
        $this->assertEquals('resolved', $report->status);
    }

    public function test_resolve_report_tercatat_di_audit_log(): void
    {
        $post = Post::factory()->create(['user_id' => $this->reporter->id]);
        $report = Report::create([
            'reportable_type' => Post::class,
            'reportable_id' => $post->id,
            'reporter_id' => $this->reporter->id,
            'reason' => 'Inappropriate content',
            'status' => 'open',
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/community/reports/{$report->id}/resolve");

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->admin->id,
            'action' => 'resolve_report',
        ]);
    }

    public function test_resolve_report_mengubah_status(): void
    {
        $post = Post::factory()->create(['user_id' => $this->reporter->id]);
        $report = Report::create([
            'reportable_type' => Post::class,
            'reportable_id' => $post->id,
            'reporter_id' => $this->reporter->id,
            'reason' => 'Spam',
            'status' => 'open',
        ]);

        $this->actingAs($this->admin, 'sanctum')
            ->postJson("/api/v1/admin/community/reports/{$report->id}/resolve");

        $this->assertDatabaseHas('reports', [
            'id' => $report->id,
            'status' => 'resolved',
        ]);
    }

    // ── Auth ──

    public function test_customer_tidak_bisa_lihat_laporan(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/admin/community/reports')
            ->assertStatus(403);
    }

    public function test_customer_tidak_bisa_selesaikan_laporan(): void
    {
        $customer = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $this->reporter->id]);
        $report = Report::create([
            'reportable_type' => Post::class,
            'reportable_id' => $post->id,
            'reporter_id' => $this->reporter->id,
            'reason' => 'Spam',
            'status' => 'open',
        ]);

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/v1/admin/community/reports/{$report->id}/resolve")
            ->assertStatus(403);
    }

    // ── Multiple Reports ──

    public function test_admin_bisa_selesaikan_banyak_laporan(): void
    {
        $reports = [];
        for ($i = 0; $i < 3; $i++) {
            $post = Post::factory()->create(['user_id' => $this->reporter->id]);
            $reports[] = Report::create([
                'reportable_type' => Post::class,
                'reportable_id' => $post->id,
                'reporter_id' => $this->reporter->id,
                'reason' => "Spam #{$i}",
                'status' => 'open',
            ]);
        }

        foreach ($reports as $report) {
            $this->actingAs($this->admin, 'sanctum')
                ->postJson("/api/v1/admin/community/reports/{$report->id}/resolve")
                ->assertStatus(200);
        }

        // Semua laporan harus resolved
        foreach ($reports as $report) {
            $report->refresh();
            $this->assertEquals('resolved', $report->status);
        }
    }

    public function test_audit_log_mencatat_semua_resolve_actions(): void
    {
        for ($i = 0; $i < 3; $i++) {
            $post = Post::factory()->create(['user_id' => $this->reporter->id]);
            $report = Report::create([
                'reportable_type' => Post::class,
                'reportable_id' => $post->id,
                'reporter_id' => $this->reporter->id,
                'reason' => "Report #{$i}",
                'status' => 'open',
            ]);

            $this->actingAs($this->admin, 'sanctum')
                ->postJson("/api/v1/admin/community/reports/{$report->id}/resolve");
        }

        $this->assertDatabaseCount('audit_logs', 3);
        $this->assertEquals(3, AuditLog::forAction('resolve_report')->count());
    }
}
