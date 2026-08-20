<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\ServiceOrder;
use App\Services\ServiceBookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceOrderController extends BaseController
{
    public function __construct(private ServiceBookingService $bookingService)
    {
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'schedule_at' => ['required', 'date'],
            'address' => ['required', 'array'],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $order = $this->bookingService->book($request->user(), $data);

        return $this->created($order, 'Pemesanan jasa berhasil');
    }

    public function index(Request $request): JsonResponse
    {
        return $this->success($this->bookingService->myOrders($request->user()));
    }

    public function show(Request $request, ServiceOrder $serviceOrder): JsonResponse
    {
        if ($serviceOrder->customer_id !== $request->user()->id) {
            return $this->forbidden('Pesanan jasa ini bukan milik Anda.');
        }

        return $this->success($serviceOrder->load('service'));
    }
}
