<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\PlantFinderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlantFinderController extends BaseController
{
    public function __construct(private PlantFinderService $finderService)
    {
    }

    public function questions(): JsonResponse
    {
        return $this->success($this->finderService->questions(), 'Pertanyaan Plant Finder');
    }

    public function recommend(Request $request): JsonResponse
    {
        $answers = $request->validate([
            'lokasi' => ['required', 'string'],
            'pengalaman' => ['required', 'string'],
            'tujuan' => ['required', 'string'],
            'waktu' => ['required', 'string'],
        ]);

        return $this->success($this->finderService->recommend($answers), 'Rekomendasi tanaman');
    }
}
