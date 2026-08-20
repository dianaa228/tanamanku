<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Comment;
use App\Models\Post;
use App\Services\CommunityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends BaseController
{
    public function __construct(private CommunityService $communityService)
    {
    }

    public function store(Request $request, Post $post): JsonResponse
    {
        $data = $request->validate(['content' => ['required', 'string', 'max:2000']]);

        $comment = $this->communityService->addComment($request->user(), $post, $data['content']);

        return $this->created($comment, 'Komentar terkirim');
    }

    public function destroy(Request $request, Comment $comment): JsonResponse
    {
        $this->communityService->deleteComment($request->user(), $comment);

        return $this->deleted('Komentar dihapus');
    }
}
