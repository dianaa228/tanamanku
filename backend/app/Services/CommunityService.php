<?php

namespace App\Services;

use App\Models\Comment;
use App\Models\Post;
use App\Models\PostLike;
use App\Models\Report;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class CommunityService
{
    public function posts(): LengthAwarePaginator
    {
        return Post::query()
            ->with('user:id,name,avatar', 'images', 'comments.user:id,name,avatar')
            ->withCount('likes')
            ->latest()
            ->paginate(10);
    }

    public function show(Post $post): Post
    {
        return $post->load('user:id,name,avatar', 'images', 'comments.user:id,name,avatar')
            ->loadCount('likes');
    }

    public function store(User $user, array $data): Post
    {
        return $user->posts()->create([
            'content' => $data['content'],
        ]);
    }

    public function destroy(Post $post): void
    {
        $post->delete();
    }

    public function toggleLike(User $user, Post $post): Post
    {
        $like = $post->likes()->where('user_id', $user->id)->first();

        if ($like) {
            $like->delete();
            $post->decrement('likes_count');
        } else {
            $post->likes()->create(['user_id' => $user->id]);
            $post->increment('likes_count');
        }

        return $post->refresh();
    }

    public function addComment(User $user, Post $post, string $content): Comment
    {
        $comment = $post->comments()->create([
            'user_id' => $user->id,
            'content' => $content,
        ]);
        $post->increment('comments_count');

        return $comment;
    }

    public function deleteComment(User $user, Comment $comment): void
    {
        if (! $comment->isOwnedBy($user) && ! $user->isAdmin()) {
            throw ValidationException::withMessages(['comment' => ['Anda tidak berhak menghapus komentar ini.']]);
        }

        $comment->post()->decrement('comments_count');
        $comment->delete();
    }

    public function report(User $user, Post $post, string $reason): Report
    {
        return $post->reports()->create([
            'reporter_id' => $user->id,
            'reason' => $reason,
            'status' => Report::STATUS_OPEN,
        ]);
    }

    public function reported(): LengthAwarePaginator
    {
        return Report::query()
            ->with('reportable', 'reporter:id,name')
            ->where('status', Report::STATUS_OPEN)
            ->latest()
            ->paginate(15);
    }

    public function resolveReport(Report $report): Report
    {
        $report->update(['status' => Report::STATUS_RESOLVED]);

        return $report;
    }
}
