<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    protected $fillable = [
        'slug', 'name', 'badge', 'price', 'period', 'description',
        'features', 'is_popular', 'is_active',
    ];

    protected $casts = [
        'price' => 'integer',
        'features' => 'array',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
    ];
}
