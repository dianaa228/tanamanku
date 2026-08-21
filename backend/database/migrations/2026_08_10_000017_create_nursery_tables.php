<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nurseries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('address');
            $table->string('city');
            $table->string('province');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('hours')->nullable();
            $table->boolean('is_open')->default(true);
            $table->decimal('rating_avg', 3, 2)->default(0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->unsignedInteger('products_count')->default(0);
            $table->json('images')->nullable();
            $table->json('categories')->nullable();
            $table->unsignedSmallInteger('founded_year')->nullable();
            $table->timestamps();

            $table->index('city');
            $table->index('is_open');
        });

        Schema::create('nursery_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nursery_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedInteger('price')->default(0);
            $table->unsignedInteger('stock')->default(0);
            $table->string('category')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('nursery_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nursery_products');
        Schema::dropIfExists('nurseries');
    }
};
