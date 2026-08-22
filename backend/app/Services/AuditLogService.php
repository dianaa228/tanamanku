<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * AuditLogService — mencatat semua aksi admin untuk keamanan & compliance.
 *
 * Digunakan oleh middleware dan controller untuk merekam perubahan data sensitif.
 */
class AuditLogService
{
    /**
     * Catat aksi admin ke tabel audit_logs.
     *
     * @param User|null $user User yang melakukan aksi (null = system)
     * @param string $action Jenis aksi (update_role, verify_store, dll)
     * @param Model $model Model yang diubah
     * @param array|null $oldValues Data sebelum perubahan
     * @param array|null $newValues Data sesudah perubahan
     * @param string|null $description Deskripsi singkat
     */
    public function log(
        ?User $user,
        string $action,
        $model,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $description = null
    ): AuditLog {
        $request = request();

        $auditLog = AuditLog::create([
            'user_id' => $user?->id ?? 0,
            'action' => $action,
            'auditable_type' => get_class($model),
            'auditable_id' => $model->getKey(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'description' => $description,
        ]);

        Log::info("Audit: {$action}", [
            'user' => $user?->email ?? 'system',
            'model' => get_class($model) . '#' . $model->getKey(),
        ]);

        return $auditLog;
    }

    /**
     * Rekam perubahan model (before/after snapshot).
     * Panggil SEBELUM update untuk mendapatkan old values.
     */
    public function recordChanges(
        ?User $user,
        string $action,
        $model,
        array $changedAttributes,
        ?string $description = null
    ): AuditLog {
        $oldValues = [];
        $newValues = [];

        foreach ($changedAttributes as $attribute) {
            if (array_key_exists($attribute, $model->getOriginal())) {
                $oldValues[$attribute] = $model->getOriginal($attribute);
                $newValues[$attribute] = $model->{$attribute};
            }
        }

        return $this->log($user, $action, $model, $oldValues, $newValues, $description);
    }

    /**
     * Ambil riwayat audit untuk model tertentu.
     */
    public function getHistory(string $type, int $id, int $limit = 50): \Illuminate\Database\Eloquent\Collection
    {
        return AuditLog::forModel($type, $id)
            ->with('user:id,name,email')
            ->latest()
            ->limit($limit)
            ->get();
    }

    /**
     * Ambil semua aksi admin dalam rentang waktu tertentu.
     */
    public function getAdminActions(int $days = 30, int $limit = 100): \Illuminate\Database\Eloquent\Collection
    {
        return AuditLog::recent($days)
            ->with('user:id,name,email')
            ->latest()
            ->limit($limit)
            ->get();
    }
}
