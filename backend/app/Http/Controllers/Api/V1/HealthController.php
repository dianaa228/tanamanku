<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends BaseController
{
    /**
     * GET /health — Health check endpoint.
     * Digunakan oleh frontend untuk mendeteksi apakah backend tersedia.
     */
    public function __invoke(): JsonResponse
    {
        try {
            DB::connection()->getPdo();
            $dbStatus = 'connected';
        } catch (\Exception $e) {
            $dbStatus = 'disconnected';
        }

        return response()->json([
            'success' => true,
            'message' => 'Tanamanku API is running',
            'data' => [
                'status' => 'healthy',
                'database' => $dbStatus,
                'timestamp' => now()->toISOString(),
                'version' => config('app.version', '1.0.0'),
            ],
        ]);
    }
}
