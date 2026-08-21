<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\PlantExchange;
use App\Models\PlantListing;
use App\Services\PlantExchangeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlantExchangeController extends BaseController
{
    public function __construct(private PlantExchangeService $exchangeService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        return $this->success($this->exchangeService->listings($request->only(['type'])));
    }

    public function show(PlantListing $plantListing): JsonResponse
    {
        $plantListing->load('owner:id,name,avatar', 'species');
        return $this->success($plantListing, 'Listing dimuat');
    }

    public function myListings(Request $request): JsonResponse
    {
        $listings = PlantListing::where('user_id', $request->user()->id)
            ->with('species')
            ->latest()
            ->get();
        return $this->success($listings, 'Listing saya dimuat');
    }

    public function myExchanges(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $exchanges = PlantExchange::whereHas('listing', fn($q) => $q->where('user_id', $userId))
            ->orWhere('offerer_id', $userId)
            ->with(['listing.user:id,name,avatar', 'offerer:id,name,avatar'])
            ->latest()
            ->get();
        return $this->success($exchanges, 'Pertukaran saya dimuat');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'plant_species_id' => ['nullable', 'exists:plant_species,id'],
            'title' => ['required', 'string', 'max:191'],
            'description' => ['nullable', 'string', 'max:5000'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'type' => ['required', 'in:sell,exchange'],
            'images' => ['nullable', 'array'],
        ]);

        $listing = $this->exchangeService->store($request->user(), $data);

        return $this->created($listing, 'Listing berhasil dibuat');
    }

    public function offer(Request $request, PlantListing $plantListing): JsonResponse
    {
        $data = $request->validate(['message' => ['nullable', 'string', 'max:2000']]);

        return $this->created(
            $this->exchangeService->offer($request->user(), $plantListing, $data['message'] ?? null),
            'Tawaran terkirim',
        );
    }

    public function respond(Request $request, PlantExchange $plantExchange): JsonResponse
    {
        // Hanya pemilik listing yang boleh merespons
        if ($plantExchange->listing->user_id !== $request->user()->id) {
            return $this->forbidden('Hanya pemilik listing yang dapat merespons.');
        }

        $data = $request->validate(['status' => ['required', 'in:accepted,rejected']]);
        $exchange = $this->exchangeService->respond($plantExchange, $data['status']);

        return $this->success($exchange, 'Tawaran diperbarui');
    }
}
