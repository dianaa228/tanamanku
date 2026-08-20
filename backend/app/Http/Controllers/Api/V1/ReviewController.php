<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\OrderItem;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $reviews = Review::query()
            ->with('user:id,name,avatar')
            ->when($request->input('product_id'), fn ($q, $id) => $q->whereHas('orderItem', fn ($i) => $i->where('product_id', $id)))
            ->latest()
            ->paginate(10);

        return $this->success($reviews);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'order_item_id' => ['required', 'exists:order_items,id'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $orderItem = OrderItem::with('order')->findOrFail($data['order_item_id']);

        // Hanya pembeli yang menyelesaikan pesanan dapat memberi ulasan (docs/01)
        if ($orderItem->order->user_id !== $request->user()->id || $orderItem->order->status !== 'completed') {
            return $this->forbidden('Ulasan hanya untuk pesanan yang sudah selesai.');
        }

        $review = Review::updateOrCreate(
            ['order_item_id' => $orderItem->id],
            array_merge($data, ['user_id' => $request->user()->id]),
        );

        return $this->created($review, 'Ulasan berhasil dikirim');
    }
}
