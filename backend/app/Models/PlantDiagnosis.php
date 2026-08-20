<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlantDiagnosis extends Model
{
    protected $fillable = [
        'user_plant_id', 'symptoms', 'diagnosis', 'severity', 'advice', 'created_at',
    ];

    protected function casts(): array
    {
        return [
            'symptoms' => 'array',
            'advice' => 'array',
        ];
    }

    public $timestamps = false;

    public function userPlant(): BelongsTo
    {
        return $this->belongsTo(UserPlant::class);
    }
}
