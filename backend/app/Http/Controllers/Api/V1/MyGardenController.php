<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Garden\StoreUserPlantRequest;
use App\Http\Resources\GardenResource;
use App\Models\UserPlant;
use App\Services\GardenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MyGardenController extends BaseController
{
    public function __construct(private GardenService $gardenService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        return $this->success(GardenResource::collection($this->gardenService->index($request->user())));
    }

    public function store(StoreUserPlantRequest $request): JsonResponse
    {
        $plant = $this->gardenService->store($request->user(), $request->validated());

        return $this->created(new GardenResource($plant), 'Tanaman ditambahkan ke kebunmu');
    }

    public function show(UserPlant $userPlant): JsonResponse
    {
        return $this->success(new GardenResource($this->gardenService->show($userPlant)));
    }

    public function update(StoreUserPlantRequest $request, UserPlant $userPlant): JsonResponse
    {
        $plant = $this->gardenService->update($userPlant, $request->validated());

        return $this->success(new GardenResource($plant), 'Tanaman diperbarui');
    }

    public function destroy(UserPlant $userPlant): JsonResponse
    {
        $this->gardenService->destroy($userPlant);

        return $this->deleted('Tanaman dihapus dari kebun');
    }

    public function allReminders(Request $request): JsonResponse
    {
        $reminders = \App\Models\PlantReminder::whereHas('userPlant', function ($q) use ($request) {
            $q->where('user_id', $request->user()->id);
        })->with('userPlant:id,nickname')->get();

        return $this->success($reminders, 'Pengingat berhasil dimuat');
    }

    public function addPhoto(Request $request, UserPlant $userPlant): JsonResponse
    {
        $data = $request->validate([
            'photo' => ['required', 'image', 'max:5120'],
            'note' => ['nullable', 'string', 'max:500'],
        ]);

        $path = $request->file('photo')->store('user-plants', 'public');

        $photo = $userPlant->photos()->create([
            'path' => $path,
            'note' => $data['note'] ?? null,
            'taken_at' => now(),
        ]);

        return $this->created($photo, 'Foto berhasil ditambahkan');
    }
}
