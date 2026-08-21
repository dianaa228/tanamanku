<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlantListing extends Model
{
    use HasFactory;
    public const TYPE_SELL = 'sell';
    public const TYPE_EXCHANGE = 'exchange';

    protected $fillable = [
        'user_id', 'plant_species_id', 'title', 'description', 'price',
        'type', 'images', 'status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'images' => 'array',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function species(): BelongsTo
    {
        return $this->belongsTo(PlantSpecies::class, 'plant_species_id');
    }

    public function exchanges(): HasMany
    {
        return $this->hasMany(PlantExchange::class, 'listing_id');
    }
}
