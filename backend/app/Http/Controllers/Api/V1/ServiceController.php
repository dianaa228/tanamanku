<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Service;
use App\Services\ServiceBookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends BaseController
{
    public function __construct(private ServiceBookingService $bookingService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        return $this->success($this->bookingService->index($request->only(['category'])));
    }

    public function show(Service $service): JsonResponse
    {
        return $this->success($this->bookingService->show($service));
    }
}
