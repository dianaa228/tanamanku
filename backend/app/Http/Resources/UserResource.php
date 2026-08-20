<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role?->value ?? $this->role,
            'avatar' => $this->avatar,
            'is_active' => $this->is_active,
            'member_since' => $this->created_at?->format('Y-m-d'),
            'addresses' => AddressResource::collection($this->whenLoaded('addresses')),
            'store' => new StoreResource($this->whenLoaded('store')),
            'token' => $this->when(isset($this->token), $this->token),
        ];
    }
}
