<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlantReminder extends Model
{
    use HasFactory;

    public const TYPE_WATER = 'siram';
    public const TYPE_FERTILIZE = 'pupuk';
    public const TYPE_REPOT = 'repot';
    public const TYPE_PEST = 'cek-hama';
    public const TYPE_PRUNE = 'pangkas';

    protected $fillable = [
        'user_plant_id', 'type', 'frequency_days', 'next_due_at',
        'last_done_at', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'frequency_days' => 'integer',
            'next_due_at' => 'date',
            'last_done_at' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function userPlant(): BelongsTo
    {
        return $this->belongsTo(UserPlant::class);
    }

    public function scopeDue($query)
    {
        return $query->where('is_active', true)->where('next_due_at', '<=', now());
    }
}
