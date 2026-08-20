<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Plant\StoreReminderRequest;
use App\Models\PlantReminder;
use App\Models\UserPlant;
use App\Services\ReminderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlantReminderController extends BaseController
{
    public function __construct(private ReminderService $reminderService)
    {
    }

    public function index(UserPlant $userPlant): JsonResponse
    {
        return $this->success($userPlant->reminders()->get(), 'Pengingat berhasil dimuat');
    }

    public function store(StoreReminderRequest $request, UserPlant $userPlant): JsonResponse
    {
        $reminder = $this->reminderService->store($userPlant, $request->validated());

        return $this->created($reminder, 'Pengingat dibuat');
    }

    public function update(StoreReminderRequest $request, PlantReminder $plantReminder): JsonResponse
    {
        $plantReminder->update($request->validated());

        return $this->success($plantReminder, 'Pengingat diperbarui');
    }

    public function destroy(PlantReminder $plantReminder): JsonResponse
    {
        $plantReminder->delete();

        return $this->deleted('Pengingat dihapus');
    }

    public function markDone(Request $request, PlantReminder $plantReminder): JsonResponse
    {
        $reminder = $this->reminderService->markDone($plantReminder);

        return $this->success($reminder, 'Pengingat selesai 🎉');
    }
}
