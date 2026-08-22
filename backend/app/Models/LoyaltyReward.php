<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyReward extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'points_cost', 'type', 'icon',
        'stock', 'max_per_user', 'is_active',
    ];

    protected $casts = [
        'points_cost' => 'integer',
        'stock' => 'integer',
        'max_per_user' => 'integer',
        'is_active' => 'boolean',
    ];
}
