<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'stock' => $this->stock,
            'care_level' => $this->care_level,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
            'store' => new StoreResource($this->whenLoaded('store')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'images' => $this->whenLoaded('images'),
            'variants' => $this->whenLoaded('variants'),
            'reviews' => $this->whenLoaded('reviews'),
            'rating_avg' => (float) ($this->reviews_avg_rating ?? 0),
            'sold_count' => $this->order_items_count ?? 0,
        ];
    }
}
