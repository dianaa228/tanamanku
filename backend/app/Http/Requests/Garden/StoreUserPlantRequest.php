<?php

namespace App\Http\Requests\Garden;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserPlantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'plant_species_id' => ['required', 'exists:plant_species,id'],
            'nickname' => ['nullable', 'string', 'max:100'],
            'planted_at' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:191'],
            'pot' => ['nullable', 'string', 'max:191'],
            'height_cm' => ['nullable', 'numeric', 'min:0'],
            'water_frequency_days' => ['nullable', 'integer', 'min:1', 'max:365'],
        ];
    }
}
