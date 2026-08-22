<?php

namespace Tests\Feature\Community;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Community feature tests (docs/04-features.json — Phase 8: Community).
 * Mencakup: posts, komentar, like, laporan, dan ownership check.
 */
class CommunityTest extends TestCase
{
    use RefreshDatabase;

    // ── Posts ──

    public function test_list_post_publik_perlu_auth(): void
    {
        Post::factory()->count(3)->create();

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/v1/community/posts');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_buat_post(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/community/posts', [
                'content' => 'Tips menanam cabai di pot 🌶️',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.content', 'Tips menanam cabai di pot 🌶️');

        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'content' => 'Tips menanam cabai di pot 🌶️',
        ]);
    }

    public function test_buat_post_content_wajib(): void
    {
        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->postJson('/api/v1/community/posts', []);

        $response->assertStatus(422);
    }

    public function test_detail_post(): void
    {
        $post = Post::factory()->create();

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson("/api/v1/community/posts/{$post->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $post->id);
    }

    public function test_hapus_post_sendiri(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/v1/community/posts/{$post->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    public function test_hapus_post_orang_lain_ditolak(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $post = Post::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($intruder, 'sanctum')
            ->deleteJson("/api/v1/community/posts/{$post->id}");

        $response->assertStatus(403);
    }

    // ── Likes ──

    public function test_toggle_like_post(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['likes_count' => 0]);

        // Like pertama
        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/community/posts/{$post->id}/like");

        $response->assertStatus(200)
            ->assertJsonPath('data.liked', true);

        // Unlike
        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/community/posts/{$post->id}/like");

        $response->assertStatus(200)
            ->assertJsonPath('data.liked', false);
    }

    // ── Comments ──

    public function test_tambah_komentar(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['comments_count' => 0]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/community/posts/{$post->id}/comments", [
                'content' => 'Tips yang sangat membantu!',
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('comments', [
            'post_id' => $post->id,
            'user_id' => $user->id,
            'content' => 'Tips yang sangat membantu!',
        ]);

        $this->assertEquals(1, $post->refresh()->comments_count);
    }

    public function test_komentar_content_wajib(): void
    {
        $post = Post::factory()->create();

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->postJson("/api/v1/community/posts/{$post->id}/comments", []);

        $response->assertStatus(422);
    }

    public function test_hapus_komentar_sendiri(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['comments_count' => 1]);
        $comment = Comment::factory()->create([
            'post_id' => $post->id,
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/v1/comments/{$comment->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_hapus_komentar_orang_lain_ditolak(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $post = Post::factory()->create(['comments_count' => 1]);
        $comment = Comment::factory()->create([
            'post_id' => $post->id,
            'user_id' => $owner->id,
        ]);

        $response = $this->actingAs($intruder, 'sanctum')
            ->deleteJson("/api/v1/comments/{$comment->id}");

        $response->assertStatus(422); // ValidationException
    }

    public function test_admin_bisa_hapus_komentar_orang_lain(): void
    {
        $admin = User::factory()->admin()->create();
        $owner = User::factory()->create();
        $post = Post::factory()->create(['comments_count' => 1]);
        $comment = Comment::factory()->create([
            'post_id' => $post->id,
            'user_id' => $owner->id,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/v1/comments/{$comment->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    // ── Reports ──

    public function test_laporkan_post(): void
    {
        $reporter = User::factory()->create();
        $post = Post::factory()->create();

        $response = $this->actingAs($reporter, 'sanctum')
            ->postJson("/api/v1/community/posts/{$post->id}/report", [
                'reason' => 'Konten spam',
            ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('reports', [
            'reporter_id' => $reporter->id,
            'reason' => 'Konten spam',
            'status' => 'open',
        ]);
    }

    public function test_laporan_reason_wajib(): void
    {
        $post = Post::factory()->create();

        $response = $this->actingAs(User::factory()->create(), 'sanctum')
            ->postJson("/api/v1/community/posts/{$post->id}/report", []);

        $response->assertStatus(422);
    }

    public function test_admin_melihat_daftar_laporan(): void
    {
        $admin = User::factory()->admin()->create();
        $post = Post::factory()->create();
        Report::factory()->count(2)->create([
            'reportable_type' => Post::class,
            'reportable_id' => $post->id,
            'status' => 'open',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/v1/admin/community/reports');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }

    public function test_customer_tidak_bisa_akses_daftar_laporan(): void
    {
        $customer = User::factory()->create();

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson('/api/v1/admin/community/reports');

        $response->assertStatus(403);
    }
}
