<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlantGrowthLog extends Model
{
    protected $fillable = ['user_plant_id', 'height_cm', 'leaves_count', 'note', 'logged_at'];

    protected function casts(): array
    {
        return [
            'height_cm' => 'float',
            'leaves_count' => 'integer',
            'logged_at' => 'datetime',
        ];
    }

    public function userPlant(): BelongsTo
    {
        return $this->belongsTo(UserPlant::class);
    }
}
