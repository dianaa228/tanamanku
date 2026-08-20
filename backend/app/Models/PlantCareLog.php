<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlantCareLog extends Model
{
    protected $fillable = ['user_plant_id', 'type', 'note', 'done_at'];

    protected function casts(): array
    {
        return ['done_at' => 'datetime'];
    }

    public function userPlant(): BelongsTo
    {
        return $this->belongsTo(UserPlant::class);
    }
}
