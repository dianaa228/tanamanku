<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plant_species', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('scientific_name')->nullable();
            $table->string('category')->default('hias');
            $table->string('light_requirement')->nullable();
            $table->string('water_requirement')->nullable();
            $table->string('humidity')->nullable();
            $table->string('temperature')->nullable();
            $table->string('growth_duration')->nullable();
            $table->string('care_level')->default('mudah');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plant_species');
    }
};
