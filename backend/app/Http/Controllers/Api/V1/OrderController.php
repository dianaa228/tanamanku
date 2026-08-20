<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Store;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends BaseController
{
    public function __construct(private OrderService $orderService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        return $this->success(OrderResource::collection($this->orderService->index($request->user())));
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->createFromCart($request->user(), $request->validated());

        return $this->created(new OrderResource($order), 'Pesanan berhasil dibuat');
    }

    public function show(Order $order): JsonResponse
    {
        return $this->success(new OrderResource($order->load('items.product', 'payment', 'shipment', 'store')));
    }

    public function cancel(Order $order): JsonResponse
    {
        $order = $this->orderService->cancel($order);

        return $this->success(new OrderResource($order), 'Pesanan dibatalkan');
    }

    public function sellerOrders(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        return $this->success(OrderResource::collection($this->orderService->sellerOrders($store->id)));
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $order = $this->orderService->updateStatus($order, (string) $request->input('status'));

        return $this->success(new OrderResource($order), 'Status pesanan diperbarui');
    }

    public function salesReport(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        $totals = Order::where('store_id', $store->id)
            ->whereNotIn('status', ['pending', 'cancelled'])
            ->selectRaw('COUNT(*) as count, SUM(total) as revenue')
            ->first();

        return $this->success([
            'order_count' => (int) $totals?->count,
            'revenue' => (float) $totals?->revenue,
            'store' => $store->only(['id', 'name']),
        ], 'Laporan penjualan');
    }

    public function adminReports(Request $request): JsonResponse
    {
        $from = $request->input('from');
        $to = $request->input('to');

        $query = Order::query();
        if ($from) $query->whereDate('created_at', '>=', $from);
        if ($to) $query->whereDate('created_at', '<=', $to);

        $summary = (clone $query)
            ->whereNotIn('status', ['pending', 'cancelled'])
            ->selectRaw('COUNT(*) as orders, SUM(total) as gmvs, COUNT(DISTINCT user_id) as buyers')
            ->first();

        $byStatus = (clone $query)->selectRaw('status, COUNT(*) as total')->groupBy('status')->get();

        return $this->success([
            'gmv' => (float) $summary?->gmvs,
            'orders' => (int) $summary?->orders,
            'buyers' => (int) $summary?->buyers,
            'by_status' => $byStatus,
        ], 'Laporan admin');
    }
}
