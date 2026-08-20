<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_plants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plant_species_id')->constrained()->restrictOnDelete();
            $table->string('nickname')->nullable();
            $table->date('planted_at')->nullable();
            $table->string('location')->nullable();
            $table->string('pot')->nullable();
            $table->string('photo')->nullable();
            $table->string('status')->default('sehat'); // sehat | perlu-air | perhatian
            $table->decimal('height_cm', 6, 1)->default(0);
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });

        Schema::create('plant_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_plant_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->string('note')->nullable();
            $table->timestamp('taken_at')->nullable();
            $table->timestamps();
        });

        Schema::create('plant_growth_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_plant_id')->constrained()->cascadeOnDelete();
            $table->decimal('height_cm', 6, 1);
            $table->unsignedInteger('leaves_count')->nullable();
            $table->string('note')->nullable();
            $table->timestamp('logged_at');
            $table->timestamps();
        });

        Schema::create('plant_care_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_plant_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // siram | pupuk | repot | cek-hama | pangkas
            $table->string('note')->nullable();
            $table->timestamp('done_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plant_care_logs');
        Schema::dropIfExists('plant_growth_logs');
        Schema::dropIfExists('plant_photos');
        Schema::dropIfExists('user_plants');
    }
};
