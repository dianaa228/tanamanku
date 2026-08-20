<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;

/**
 * Format respons API Tanamanku (docs/06-api.json).
 *
 *   success: { success: true,  message: "Success", data: {} }
 *   error:   { success: false, message: "Error",  errors: {} }
 */
trait ApiResponse
{
    public function success(mixed $data = [], string $message = 'Success', int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    public function created(mixed $data = [], string $message = 'Resource berhasil dibuat'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    public function deleted(string $message = 'Resource berhasil dihapus'): JsonResponse
    {
        return $this->success(null, $message, 200);
    }

    public function error(string $message = 'Terjadi kesalahan.', array $errors = [], int $status = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => (object) $errors,
        ], $status);
    }

    public function notFound(string $message = 'Resource tidak ditemukan'): JsonResponse
    {
        return $this->error($message, [], 404);
    }

    public function unauthorized(string $message = 'Belum terautentikasi'): JsonResponse
    {
        return $this->error($message, [], 401);
    }

    public function forbidden(string $message = 'Tidak memiliki akses'): JsonResponse
    {
        return $this->error($message, [], 403);
    }
}
