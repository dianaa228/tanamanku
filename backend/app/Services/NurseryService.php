<?php

namespace App\Services;

use App\Models\Nursery;
use App\Models\NurseryProduct;

class NurseryService
{
    public function getNurseries($filters = [])
    {
        $query = Nursery::query();

        if (!empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('description', 'like', "%{$filters['search']}%");
            });
        }

        if (!empty($filters['open_only']) && $filters['open_only'] === 'true') {
            $query->where('is_open', true);
        }

        return $query->latest()->get();
    }

    public function getNursery(string $idOrSlug): Nursery
    {
        return Nursery::where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->firstOrFail();
    }

    public function getNurseryProducts(int $nurseryId)
    {
        return NurseryProduct::where('nursery_id', $nurseryId)
            ->where('is_active', true)
            ->get();
    }
}
