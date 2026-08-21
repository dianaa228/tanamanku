<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loyalty_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('points')->default(0);
            $table->unsignedInteger('total_earned')->default(0);
            $table->unsignedInteger('total_redeemed')->default(0);
            $table->string('tier')->default('bronze'); // bronze | silver | gold | platinum
            $table->timestamps();

            $table->unique('user_id');
        });

        Schema::create('loyalty_rewards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedInteger('points_cost');
            $table->string('type'); // voucher | shipping | points | product | service | subscription
            $table->string('icon')->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->unsignedInteger('max_per_user')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('loyalty_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // earn | redeem | bonus
            $table->integer('points'); // positive = earn, negative = redeem
            $table->string('description');
            $table->string('reference')->nullable(); // order | review | garden | community | reward | system
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_transactions');
        Schema::dropIfExists('loyalty_rewards');
        Schema::dropIfExists('loyalty_profiles');
    }
};
