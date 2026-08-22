<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tabel audit logs — mencatat semua aksi admin untuk keamanan & compliance.
 * Setiap perubahan kritis (role, status toko, kategori, laporan) tercatat di sini.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('action'); // e.g. 'update_role', 'verify_store', 'resolve_report'
            $table->string('auditable_type'); // e.g. 'App\Models\User'
            $table->unsignedBigInteger('auditable_id');
            $table->json('old_values')->nullable(); // data sebelum perubahan
            $table->json('new_values')->nullable(); // data sesudah perubahan
            $table->string('ip_address', 45)->nullable(); // IPv4 atau IPv6
            $table->text('user_agent')->nullable();
            $table->text('description')->nullable(); // deskripsi singkat aksi
            $table->timestamps();

            // Index untuk query cepat
            $table->index(['auditable_type', 'auditable_id']);
            $table->index('action');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
