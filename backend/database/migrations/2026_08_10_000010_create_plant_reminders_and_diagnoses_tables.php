<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plant_reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_plant_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // siram | pupuk | repot | cek-hama | pangkas
            $table->unsignedInteger('frequency_days');
            $table->date('next_due_at');
            $table->date('last_done_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'next_due_at']);
        });

        Schema::create('plant_diagnoses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_plant_id')->constrained()->cascadeOnDelete();
            $table->json('symptoms');
            $table->string('diagnosis');
            $table->string('severity'); // ringan | sedang | berat
            $table->json('advice');
            $table->timestamp('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plant_diagnoses');
        Schema::dropIfExists('plant_reminders');
    }
};
