<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\UserPlant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlantGrowthController extends BaseController
{
    public function index(UserPlant $userPlant): JsonResponse
    {
        return $this->success($userPlant->growthLogs()->orderBy('logged_at')->get(), 'Riwayat pertumbuhan');
    }

    public function store(Request $request, UserPlant $userPlant): JsonResponse
    {
        $data = $request->validate([
            'height_cm' => ['required', 'numeric', 'min:0'],
            'leaves_count' => ['nullable', 'integer', 'min:0'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $log = $userPlant->growthLogs()->create(array_merge($data, ['logged_at' => now()]));

        // Sinkronkan tinggi terkini
        $userPlant->update(['height_cm' => $data['height_cm']]);

        return $this->created($log, 'Catatan pertumbuhan ditambahkan');
    }
}
