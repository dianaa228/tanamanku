<?php

namespace Tests\Unit\Services;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use App\Services\CommunityService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

/**
 * Unit tests untuk CommunityService.
 * Mencakup: toggleLike, addComment, deleteComment, report, resolveReport.
 */
class CommunityServiceTest extends TestCase
{
    use RefreshDatabase;

    private CommunityService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new CommunityService();
    }

    // ── Toggle Like ──

    public function test_toggle_like_adds_like(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['likes_count' => 0]);

        $result = $this->service->toggleLike($user, $post);

        $this->assertEquals(1, $result->likes_count);
        $this->assertDatabaseHas('post_likes', [
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);
    }

    public function test_toggle_like_removes_like(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['likes_count' => 1]);
        $post->likes()->create(['user_id' => $user->id]);

        $result = $this->service->toggleLike($user, $post);

        $this->assertEquals(0, $result->likes_count);
        $this->assertDatabaseMissing('post_likes', [
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);
    }

    public function test_toggle_like_twice_returns_to_zero(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['likes_count' => 0]);

        $this->service->toggleLike($user, $post); // like
        $result = $this->service->toggleLike($user, $post); // unlike

        $this->assertEquals(0, $result->likes_count);
    }

    // ── Add Comment ──

    public function test_add_comment(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['comments_count' => 0]);

        $comment = $this->service->addComment($user, $post, 'Tips yang bagus!');

        $this->assertEquals('Tips yang bagus!', $comment->content);
        $this->assertEquals($user->id, $comment->user_id);
        $this->assertEquals($post->id, $comment->post_id);
        $this->assertEquals(1, $post->fresh()->comments_count);
    }

    public function test_add_comment_increments_count(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['comments_count' => 2]);

        $this->service->addComment($user, $post, 'Komentar baru');

        $this->assertEquals(3, $post->fresh()->comments_count);
    }

    // ── Delete Comment ──

    public function test_delete_own_comment(): void
    {
        $user = User::factory()->create();
        $post = Post::factory()->create(['comments_count' => 1]);
        $comment = Comment::factory()->create([
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);

        $this->service->deleteComment($user, $comment);

        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
        $this->assertEquals(0, $post->fresh()->comments_count);
    }

    public function test_delete_other_comment_throws(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $post = Post::factory()->create(['comments_count' => 1]);
        $comment = Comment::factory()->create([
            'user_id' => $owner->id,
            'post_id' => $post->id,
        ]);

        $this->expectException(ValidationException::class);
        $this->service->deleteComment($intruder, $comment);
    }

    public function test_admin_can_delete_other_comment(): void
    {
        $admin = User::factory()->admin()->create();
        $owner = User::factory()->create();
        $post = Post::factory()->create(['comments_count' => 1]);
        $comment = Comment::factory()->create([
            'user_id' => $owner->id,
            'post_id' => $post->id,
        ]);

        $this->service->deleteComment($admin, $comment);

        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    // ── Report ──

    public function test_report_post(): void
    {
        $reporter = User::factory()->create();
        $post = Post::factory()->create();

        $report = $this->service->report($reporter, $post, 'Spam');

        $this->assertEquals($reporter->id, $report->reporter_id);
        $this->assertEquals('Spam', $report->reason);
        $this->assertEquals(Report::STATUS_OPEN, $report->status);
        $this->assertEquals(Post::class, $report->reportable_type);
        $this->assertEquals($post->id, $report->reportable_id);
    }

    public function test_reported_posts(): void
    {
        $post = Post::factory()->create();
        Report::factory()->count(2)->create([
            'reportable_type' => Post::class,
            'reportable_id' => $post->id,
            'status' => 'open',
        ]);

        $reported = $this->service->reported();

        $this->assertCount(2, $reported);
    }

    public function test_resolve_report(): void
    {
        $report = Report::factory()->create(['status' => 'open']);

        $resolved = $this->service->resolveReport($report);

        $this->assertEquals(Report::STATUS_RESOLVED, $resolved->status);
    }

    // ── Store / Destroy ──

    public function test_store_post(): void
    {
        $user = User::factory()->create();

        $post = $this->service->store($user, ['content' => 'Tips berkebun']);

        $this->assertEquals('Tips berkebun', $post->content);
        $this->assertEquals($user->id, $post->user_id);
    }

    public function test_destroy_post(): void
    {
        $post = Post::factory()->create();

        $this->service->destroy($post);

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }
}
