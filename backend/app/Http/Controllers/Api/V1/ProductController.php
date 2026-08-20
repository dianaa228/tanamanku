<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Store;
use App\Services\InventoryService;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends BaseController
{
    public function __construct(
        private ProductService $productService,
        private InventoryService $inventoryService,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $products = $this->productService->index($request->only(['search', 'category', 'care', 'sort', 'per_page']));

        return $this->success(ProductResource::collection($products), 'Produk berhasil dimuat');
    }

    public function show(Product $product): JsonResponse
    {
        return $this->success(new ProductResource($this->productService->show($product)));
    }

    public function byStore(Store $store): JsonResponse
    {
        $products = Product::where('store_id', $store->id)->active()->paginate(15);

        return $this->success(ProductResource::collection($products));
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $store = $request->user()->store;

        if (! $store) {
            return $this->error('Anda belum memiliki toko.', [], 403);
        }

        $product = $this->productService->store($request->validated(), $store->id);

        // Simpan gambar produk
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $product->images()->create([
                    'path' => $file->store('products', 'public'),
                    'sort_order' => $i,
                    'is_primary' => $i === 0,
                ]);
            }
        }

        return $this->created(new ProductResource($product->load('images')), 'Produk berhasil dibuat');
    }

    public function update(StoreProductRequest $request, Product $product): JsonResponse
    {
        $this->authorize('update', $product);

        $product = $this->productService->update($product, $request->validated());

        return $this->success(new ProductResource($product), 'Produk berhasil diperbarui');
    }

    public function destroy(Product $product): JsonResponse
    {
        $this->authorize('delete', $product);
        $this->productService->destroy($product);

        return $this->deleted('Produk berhasil dihapus');
    }

    public function sellerProducts(Request $request): JsonResponse
    {
        $store = $request->user()->store;

        return $this->success(ProductResource::collection($this->productService->sellerProducts($store->id)));
    }

    public function inventory(Request $request): JsonResponse
    {
        $store = $request->user()->store;
        $items = Product::where('store_id', $store->id)
            ->with('inventory')
            ->latest()
            ->paginate(15);

        return $this->success($items);
    }

    public function updateInventory(Request $request, Product $product): JsonResponse
    {
        $this->authorize('update', $product);
        $this->inventoryService->update($product, (int) $request->input('quantity'));

        return $this->success(null, 'Stok berhasil diperbarui');
    }

    public function toggleFavorite(Request $request, Product $product): JsonResponse
    {
        $favorite = $request->user()->favorites()->toggle($product->id);

        return $this->success(['is_favorite' => ! empty($favorite['attached'])], 'Favorit diperbarui');
    }
}
