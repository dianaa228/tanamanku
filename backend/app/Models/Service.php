<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $fillable = [
        'provider_id', 'category', 'name', 'description', 'price_per_visit',
        'duration', 'service_area', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_per_visit' => 'decimal:2',
            'duration' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(ServiceOrder::class);
    }
}
