<?php

namespace App\Services;

use App\Models\Service;
use App\Models\ServiceOrder;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class ServiceBookingService
{
    public function index(array $filters): LengthAwarePaginator
    {
        return Service::query()
            ->where('is_active', true)
            ->with('provider:id,name')
            ->when($filters['category'] ?? null, fn ($q, $cat) => $q->where('category', $cat))
            ->paginate(15);
    }

    public function show(Service $service): Service
    {
        return $service->load('provider:id,name,phone');
    }

    public function book(User $customer, array $data): ServiceOrder
    {
        $service = Service::findOrFail($data['service_id']);

        if (! $service->is_active) {
            throw ValidationException::withMessages(['service' => ['Layanan ini sedang tidak aktif.']]);
        }

        $schedule = \Carbon\Carbon::parse($data['schedule_at']);
        if ($schedule->isPast()) {
            throw ValidationException::withMessages(['schedule_at' => ['Jadwal harus di masa depan.']]);
        }

        return ServiceOrder::create([
            'service_id' => $service->id,
            'customer_id' => $customer->id,
            'schedule_at' => $schedule,
            'address_snapshot' => $data['address'],
            'status' => 'pending',
            'total' => $service->price_per_visit,
            'note' => $data['note'] ?? null,
        ]);
    }

    public function myOrders(User $customer): LengthAwarePaginator
    {
        return ServiceOrder::query()
            ->where('customer_id', $customer->id)
            ->with('service:id,name,category')
            ->latest()
            ->paginate(15);
    }
}
