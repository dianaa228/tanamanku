<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\UserPlant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlantCareController extends BaseController
{
    public function store(Request $request, UserPlant $userPlant): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:siram,pupuk,repot,cek-hama,pangkas'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $log = $userPlant->careLogs()->create([
            'type' => $data['type'],
            'note' => $data['note'] ?? null,
            'done_at' => now(),
        ]);

        return $this->created($log, 'Perawatan dicatat');
    }
}
