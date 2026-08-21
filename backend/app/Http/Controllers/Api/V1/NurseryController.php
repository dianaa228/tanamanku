<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\NurseryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NurseryController extends BaseController
{
    public function __construct(private NurseryService $nurseryService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $nurseries = $this->nurseryService->getNurseries($request->only(['city', 'search', 'open_only']));
        return $this->success($nurseries, 'Nursery dimuat');
    }

    public function show(string $idOrSlug): JsonResponse
    {
        $nursery = $this->nurseryService->getNursery($idOrSlug);
        return $this->success($nursery, 'Detail nursery dimuat');
    }

    public function products(int $nurseryId): JsonResponse
    {
        $products = $this->nurseryService->getNurseryProducts($nurseryId);
        return $this->success($products, 'Produk dimuat');
    }
}
