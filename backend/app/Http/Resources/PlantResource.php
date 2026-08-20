<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'scientific_name' => $this->scientific_name,
            'category' => $this->category,
            'care_level' => $this->care_level,
            'light_requirement' => $this->light_requirement,
            'water_requirement' => $this->water_requirement,
            'humidity' => $this->humidity,
            'temperature' => $this->temperature,
            'growth_duration' => $this->growth_duration,
            'description' => $this->description,
        ];
    }
}
