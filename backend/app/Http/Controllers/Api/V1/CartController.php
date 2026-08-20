<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Cart\AddToCartRequest;
use App\Models\CartItem;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends BaseController
{
    public function __construct(private CartService $cartService)
    {
    }

    public function show(Request $request): JsonResponse
    {
        $cart = $this->cartService->show($request->user());

        return $this->success([
            'items' => $cart->items,
            'count' => $cart->items->sum('quantity'),
            'subtotal' => $this->cartService->subtotal($cart),
        ]);
    }

    public function addItem(AddToCartRequest $request): JsonResponse
    {
        $item = $this->cartService->addItem($request->user(), $request->validated());

        return $this->created($item, 'Item ditambahkan ke keranjang');
    }

    public function updateItem(Request $request, CartItem $cartItem): JsonResponse
    {
        $request->validate(['quantity' => ['required', 'integer', 'min:1']]);
        $item = $this->cartService->updateItem($request->user(), $cartItem, (int) $request->input('quantity'));

        return $this->success($item, 'Jumlah item diperbarui');
    }

    public function removeItem(Request $request, CartItem $cartItem): JsonResponse
    {
        $this->cartService->removeItem($request->user(), $cartItem);

        return $this->deleted('Item dihapus dari keranjang');
    }

    public function clear(Request $request): JsonResponse
    {
        $this->cartService->clear($request->user());

        return $this->success(null, 'Keranjang dikosongkan');
    }
}
