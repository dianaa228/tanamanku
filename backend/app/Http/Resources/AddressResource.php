<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'recipient' => $this->recipient,
            'phone' => $this->phone,
            'province' => $this->province,
            'city' => $this->city,
            'district' => $this->district,
            'street' => $this->street,
            'postal_code' => $this->postal_code,
            'is_default' => $this->is_default,
        ];
    }
}
