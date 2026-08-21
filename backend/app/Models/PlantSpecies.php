<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlantSpecies extends Model
{
    use HasFactory;
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected $fillable = [
        'name', 'slug', 'scientific_name', 'category', 'light_requirement',
        'water_requirement', 'humidity', 'temperature', 'growth_duration',
        'care_level', 'description', 'image',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function userPlants(): HasMany
    {
        return $this->hasMany(UserPlant::class);
    }
}
