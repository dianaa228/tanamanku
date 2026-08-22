<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService
{
    /**
     * Pencarian & filter produk (docs/06-api.json): ?search, ?category, ?sort, ?care.
     */
    /**
     * Pencarian & filter produk (docs/06-api.json): ?search, ?category, ?sort, ?care.
     * Batasi per_page maksimal 100 untuk mencegah DoS.
     */
    public function index(array $filters): LengthAwarePaginator
    {
        // Batasi per_page maksimal 100 untuk mencegah DoS
        $perPage = min(max((int) ($filters['per_page'] ?? 15), 1), 100);

        return Product::query()
            ->with(['store:id,name,slug', 'category:id,name,slug', 'images'])
            ->withCount('orderItems')
            ->withAvg('reviews', 'rating')
            ->active()
            ->search($filters['search'] ?? null)
            ->when($filters['category'] ?? null, fn (Builder $q, $slug) => $q->whereHas('category', fn ($c) => $c->where('slug', $slug)))
            ->when($filters['care'] ?? null, fn (Builder $q, $care) => $q->where('care_level', $care))
            ->when($filters['sort'] ?? null, function (Builder $q, $sort) {
                match ($sort) {
                    'harga-asc' => $q->orderBy('price'),
                    'harga-desc' => $q->orderByDesc('price'),
                    'terlaris' => $q->orderByDesc('order_items_count'),
                    'rating' => $q->orderByDesc('reviews_avg_rating'),
                    default => $q->latest(),
                };
            })
            ->paginate($perPage)
            ->withQueryString();
    }

    public function show(Product $product): Product
    {
        return $product->load(['store', 'category', 'images', 'variants', 'reviews']);
    }

    public function store(array $data, int $storeId): Product
    {
        $product = Product::create(array_merge($data, ['store_id' => $storeId]));

        // Simpan varian (field non-fillable di-ignore otomatis oleh create())
        foreach ($data['variants'] ?? [] as $variant) {
            $product->variants()->create($variant);
        }

        // Sinkronkan stok ke tabel inventories
        app(InventoryService::class)->sync($product);

        return $product->load('images', 'variants');
    }

    public function update(Product $product, array $data): Product
    {
        $product->update($data);
        app(InventoryService::class)->sync($product);

        return $product;
    }

    public function destroy(Product $product): void
    {
        $product->delete();
    }

    public function sellerProducts(int $storeId): LengthAwarePaginator
    {
        return Product::where('store_id', $storeId)
            ->with('category:id,name', 'images')
            ->latest()
            ->paginate(15);
    }
}
