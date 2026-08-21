<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UserPlant extends Model
{
    use HasFactory;
    public const STATUS_HEALTHY = 'sehat';
    public const STATUS_NEEDS_WATER = 'perlu-air';
    public const STATUS_ATTENTION = 'perhatian';

    protected $fillable = [
        'user_id', 'plant_species_id', 'nickname', 'planted_at',
        'location', 'pot', 'photo', 'status', 'height_cm',
    ];

    protected function casts(): array
    {
        return [
            'planted_at' => 'date',
            'height_cm' => 'float',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function species(): BelongsTo
    {
        return $this->belongsTo(PlantSpecies::class, 'plant_species_id');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(PlantPhoto::class);
    }

    public function growthLogs(): HasMany
    {
        return $this->hasMany(PlantGrowthLog::class);
    }

    public function latestGrowthLog(): HasOne
    {
        return $this->hasOne(PlantGrowthLog::class)->latestOfMany();
    }

    public function careLogs(): HasMany
    {
        return $this->hasMany(PlantCareLog::class);
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(PlantReminder::class);
    }

    public function diagnoses(): HasMany
    {
        return $this->hasMany(PlantDiagnosis::class);
    }

    public function isOwnedBy(User $user): bool
    {
        return $this->user_id === $user->id;
    }
}
