<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\UserPlant;
use App\Services\PlantDiagnosisService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlantDiagnosisController extends BaseController
{
    public function __construct(private PlantDiagnosisService $diagnosisService)
    {
    }

    public function diagnose(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_plant_id' => ['required', 'exists:user_plants,id'],
            'symptoms' => ['required', 'array', 'min:1'],
            'symptoms.*' => ['string'],
        ]);

        $userPlant = UserPlant::findOrFail($data['user_plant_id']);
        $this->authorize('view', $userPlant);

        $diagnosis = $this->diagnosisService->diagnose($userPlant, $data['symptoms']);

        return $this->success($diagnosis, 'Hasil diagnosis');
    }
}
