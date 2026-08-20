<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\PlantSpecies;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlantSpeciesController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $species = PlantSpecies::query()
            ->when($request->input('search'), fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->when($request->input('category'), fn ($q, $c) => $q->where('category', $c))
            ->get();

        return $this->success($species, 'Spesies tanaman berhasil dimuat');
    }

    public function show(PlantSpecies $plantSpecies): JsonResponse
    {
        return $this->success($plantSpecies, 'Detail spesies');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:191'],
            'slug' => ['required', 'string', 'unique:plant_species'],
            'scientific_name' => ['nullable', 'string', 'max:191'],
            'category' => ['nullable', 'string', 'max:191'],
            'care_level' => ['nullable', 'in:mudah,sedang,sulit'],
            'light_requirement' => ['nullable', 'string'],
            'water_requirement' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
        ]);

        return $this->created(PlantSpecies::create($data), 'Spesies berhasil dibuat');
    }

    public function update(Request $request, PlantSpecies $plantSpecies): JsonResponse
    {
        $plantSpecies->update($request->validate([
            'name' => ['sometimes', 'string', 'max:191'],
            'scientific_name' => ['nullable', 'string', 'max:191'],
            'care_level' => ['nullable', 'in:mudah,sedang,sulit'],
            'light_requirement' => ['nullable', 'string'],
            'water_requirement' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
        ]));

        return $this->success($plantSpecies, 'Spesies diperbarui');
    }
}
