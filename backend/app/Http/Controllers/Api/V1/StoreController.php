<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\StoreResource;
use App\Models\Store;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoreController extends BaseController
{
    public function __construct(private OrderService $orderService)
    {
    }

    public function index(): JsonResponse
    {
        $stores = Store::active()->withCount('products')->paginate(15);

        return $this->success(StoreResource::collection($stores));
    }

    public function show(Store $store): JsonResponse
    {
        return $this->success(new StoreResource($store->load('products')));
    }

    public function myStore(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        return $store
            ? $this->success(new StoreResource($store))
            : $this->error('Anda belum memiliki toko.', [], 404);
    }

    public function update(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        if (! $store) {
            return $this->error('Anda belum memiliki toko.', [], 404);
        }

        $this->authorize('update', $store);
        $store->update($request->validate([
            'name' => ['sometimes', 'string', 'max:191'],
            'description' => ['nullable', 'string', 'max:5000'],
            'logo' => ['nullable', 'image', 'max:2048'],
        ]));

        return $this->success(new StoreResource($store), 'Toko berhasil diperbarui');
    }

    public function dashboard(Request $request): JsonResponse
    {
        $store = $request->user()->store;
        $orders = $this->orderService->sellerOrders($store->id);

        return $this->success([
            'store' => new StoreResource($store),
            'orders' => $orders,
        ]);
    }

    public function adminStores(Request $request): JsonResponse
    {
        $stores = Store::query()
            ->withCount('products')
            ->when($request->input('status'), fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(15);

        return $this->success(StoreResource::collection($stores));
    }

    public function verify(Store $store): JsonResponse
    {
        $store->update(['status' => 'active']);

        return $this->success(new StoreResource($store), 'Toko diverifikasi');
    }
}
