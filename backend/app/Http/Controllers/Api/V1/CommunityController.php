<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Community\StorePostRequest;
use App\Http\Resources\CommunityPostResource;
use App\Models\Post;
use App\Models\Report;
use App\Services\CommunityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunityController extends BaseController
{
    public function __construct(private CommunityService $communityService)
    {
    }

    public function index(): JsonResponse
    {
        return $this->success(CommunityPostResource::collection($this->communityService->posts()));
    }

    public function store(StorePostRequest $request): JsonResponse
    {
        $post = $this->communityService->store($request->user(), $request->validated());

        return $this->created(new CommunityPostResource($post), 'Post berhasil dibagikan');
    }

    public function show(Post $post): JsonResponse
    {
        return $this->success(new CommunityPostResource($this->communityService->show($post)));
    }

    public function destroy(Post $post): JsonResponse
    {
        $this->communityService->destroy($post);

        return $this->deleted('Post dihapus');
    }

    public function toggleLike(Request $request, Post $post): JsonResponse
    {
        $post = $this->communityService->toggleLike($request->user(), $post);

        return $this->success([
            'liked' => $post->likes()->where('user_id', $request->user()->id)->exists(),
            'likes_count' => $post->likes_count,
        ], 'Suka diperbarui');
    }

    public function report(Request $request, Post $post): JsonResponse
    {
        $data = $request->validate(['reason' => ['required', 'string', 'max:500']]);

        return $this->created(
            $this->communityService->report($request->user(), $post, $data['reason']),
            'Laporan terkirim. Terima kasih!',
        );
    }

    public function reported(): JsonResponse
    {
        return $this->success($this->communityService->reported(), 'Daftar laporan');
    }

    public function resolveReport(Report $report): JsonResponse
    {
        return $this->success($this->communityService->resolveReport($report), 'Laporan diselesaikan');
    }
}
