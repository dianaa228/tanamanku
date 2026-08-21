<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Nursery extends Model
{
    protected $fillable = [
        'owner_id', 'name', 'slug', 'description', 'address', 'city',
        'province', 'phone', 'email', 'hours', 'is_open', 'rating_avg',
        'reviews_count', 'products_count', 'images', 'categories', 'founded_year',
    ];

    protected $casts = [
        'rating_avg' => 'decimal:2',
        'reviews_count' => 'integer',
        'products_count' => 'integer',
        'images' => 'array',
        'categories' => 'array',
        'is_open' => 'boolean',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(NurseryProduct::class);
    }
}
