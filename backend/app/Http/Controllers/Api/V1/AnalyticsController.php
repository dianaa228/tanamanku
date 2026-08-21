<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends BaseController
{
    public function __construct(private AnalyticsService $analyticsService)
    {
    }

    public function seller(Request $request): JsonResponse
    {
        $user = $request->user();
        $storeId = $user->store?->id;

        if (!$storeId) {
            return $this->forbidden('Anda tidak memiliki toko.');
        }

        $analytics = $this->analyticsService->getSellerAnalytics($storeId);
        return $this->success($analytics, 'Analytics dimuat');
    }

    public function admin(): JsonResponse
    {
        $analytics = $this->analyticsService->getAdminAnalytics();
        return $this->success($analytics, 'Analytics platform dimuat');
    }
}
