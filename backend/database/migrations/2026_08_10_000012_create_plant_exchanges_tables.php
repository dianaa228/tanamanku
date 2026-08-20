<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plant_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plant_species_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->string('type')->default('sell'); // sell | exchange
            $table->json('images')->nullable();
            $table->string('status')->default('active'); // active | completed | closed
            $table->timestamps();
        });

        Schema::create('plant_exchanges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained('plant_listings')->cascadeOnDelete();
            $table->foreignId('offerer_id')->constrained('users')->cascadeOnDelete();
            $table->string('message')->nullable();
            $table->string('status')->default('pending'); // pending | accepted | rejected | done
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plant_exchanges');
        Schema::dropIfExists('plant_listings');
    }
};
