<?php

namespace App\Services;

use App\Models\PlantExchange;
use App\Models\PlantListing;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class PlantExchangeService
{
    public function listings(array $filters): LengthAwarePaginator
    {
        return PlantListing::query()
            ->where('status', 'active')
            ->with('owner:id,name', 'species:id,name,emoji')
            ->when($filters['type'] ?? null, fn ($q, $type) => $q->where('type', $type))
            ->latest()
            ->paginate(15);
    }

    public function store(User $user, array $data): PlantListing
    {
        return $user->plantListings()->create($data);
    }

    public function offer(User $user, PlantListing $listing, ?string $message): PlantExchange
    {
        if ($listing->user_id === $user->id) {
            throw ValidationException::withMessages(['listing' => ['Anda tidak dapat menawar listing sendiri.']]);
        }

        return $listing->exchanges()->create([
            'offerer_id' => $user->id,
            'message' => $message,
            'status' => PlantExchange::STATUS_PENDING,
        ]);
    }

    public function respond(PlantExchange $exchange, string $status): PlantExchange
    {
        if (! in_array($status, [PlantExchange::STATUS_ACCEPTED, PlantExchange::STATUS_REJECTED])) {
            throw ValidationException::withMessages(['status' => ['Status tidak valid.']]);
        }

        $exchange->update([
            'status' => $status,
            'responded_at' => now(),
        ]);

        if ($status === PlantExchange::STATUS_ACCEPTED) {
            $exchange->listing()->update(['status' => 'completed']);
        }

        return $exchange;
    }
}
