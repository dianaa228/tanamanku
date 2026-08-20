<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GardenResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nickname' => $this->nickname,
            'planted_at' => $this->planted_at?->format('Y-m-d'),
            'location' => $this->location,
            'pot' => $this->pot,
            'status' => $this->status,
            'height_cm' => (float) $this->height_cm,
            'photo' => $this->photo,
            'species' => new PlantResource($this->whenLoaded('species')),
            'photos' => $this->whenLoaded('photos'),
            'growth_logs' => $this->whenLoaded('growthLogs'),
            'care_logs' => $this->whenLoaded('careLogs'),
            'reminders' => $this->whenLoaded('reminders'),
            'diagnoses' => $this->whenLoaded('diagnoses'),
        ];
    }
}
