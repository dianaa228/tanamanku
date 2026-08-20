<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlantPhoto extends Model
{
    protected $fillable = ['user_plant_id', 'path', 'note', 'taken_at'];

    protected function casts(): array
    {
        return ['taken_at' => 'datetime'];
    }

    public function userPlant(): BelongsTo
    {
        return $this->belongsTo(UserPlant::class);
    }
}
