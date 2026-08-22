<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NurseryProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'nursery_id', 'name', 'price', 'stock', 'category', 'image', 'is_active',
    ];

    protected $casts = [
        'price' => 'integer',
        'stock' => 'integer',
        'is_active' => 'boolean',
    ];

    public function nursery(): BelongsTo
    {
        return $this->belongsTo(Nursery::class);
    }
}
