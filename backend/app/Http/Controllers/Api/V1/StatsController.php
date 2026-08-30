<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Product;
use App\Models\Nursery;
use App\Models\UserPlant;
use Illuminate\Http\JsonResponse;

class StatsController extends BaseController
{
    /**
     * GET /stats — Data statistik publik untuk homepage.
     * Mengembalikan jumlah produk, nursery, dan kebun aktif.
     */
    public function index(): JsonResponse
    {
        $totalProducts = Product::where('is_active', true)->count();
        $totalNurseries = Nursery::count();
        $totalGardens = UserPlant::count();

        return $this->success([
            'products' => $totalProducts,
            'nurseries' => $totalNurseries,
            'gardens' => $totalGardens,
        ], 'Stats dimuat');
    }
}
