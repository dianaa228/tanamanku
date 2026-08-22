<?php

namespace App\Http\Middleware;

use App\Services\AuditLogService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * AuditLogMiddleware — mencatat semua aksi admin secara otomatis.
 *
 * Middleware ini merekam:
 * - Method HTTP (POST, PUT, PATCH, DELETE)
 * - URL yang diakses
 * - User yang melakukan aksi
 * - IP address dan user agent
 * - Timestamp
 *
 * Untuk perubahan data spesifik (before/after), gunakan AuditLogService
 * secara manual di controller atau service.
 */
class AuditLogMiddleware
{
    public function __construct(private AuditLogService $auditLogService)
    {
    }

    public function handle(Request $request, Closure $next): Response
    {
        // Hanya log aksi yang mengubah data (bukan GET)
        if (in_array($request->method(), ['GET', 'HEAD', 'OPTIONS'])) {
            return $next($request);
        }

        /** @var Response $response */
        $response = $next($request);

        // Catat hanya jika request berhasil (2xx)
        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 300) {
            $this->logAction($request, $response);
        }

        return $response;
    }

    /**
     * Catat aksi admin ke audit log.
     */
    private function logAction(Request $request, Response $response): void
    {
        $user = $request->user();
        $method = $request->method();
        $path = $request->path();

        // Tentukan action berdasarkan method dan path
        $action = $this->determineAction($method, $path);

        // Extract model info dari URL (jika ada)
        $modelInfo = $this->extractModelInfo($path);

        // Build description
        $description = "{$method} /{$path}";

        // Log ke database via service
        $this->auditLogService->log(
            user: $user,
            action: $action,
            model: $user, // Use user as the auditable model for general actions
            oldValues: null,
            newValues: [
                'method' => $method,
                'path' => $path,
                'model_type' => $modelInfo['type'] ?? null,
                'model_id' => $modelInfo['id'] ?? null,
                'status_code' => $response->getStatusCode(),
            ],
            description: $description
        );
    }

    /**
     * Tentukan jenis aksi berdasarkan HTTP method dan path.
     */
    private function determineAction(string $method, string $path): string
    {
        // Map path ke action yang deskriptif
        $actionMap = [
            'PUT' => [
                'users/*/role' => 'update_role',
                'users/*/toggle' => 'toggle_user_active',
                'categories/*' => 'update_category',
                'plant-species/*' => 'update_plant_species',
            ],
            'POST' => [
                'stores/*/verify' => 'verify_store',
                'categories' => 'create_category',
                'community/reports/*/resolve' => 'resolve_report',
                'plant-species' => 'create_plant_species',
            ],
            'DELETE' => [
                'categories/*' => 'delete_category',
            ],
        ];

        $methodActions = $actionMap[$method] ?? [];

        foreach ($methodActions as $pattern => $action) {
            if ($this->matchesPattern($path, $pattern)) {
                return $action;
            }
        }

        // Default action
        return strtolower($method) . '_action';
    }

    /**
     * Cocokkan URL path dengan pattern sederhana.
     * Contoh: 'admin/users/5/role' matches 'users/*/role'
     */
    private function matchesPattern(string $path, string $pattern): bool
    {
        // Hapus prefix 'admin/' jika ada
        $path = preg_replace('#^admin/#', '', $path);
        $pattern = preg_replace('#^admin/#', '', $pattern);

        // Convert pattern ke regex: * -> [^/]+
        $regex = '#^' . str_replace('*', '[^/]+', $pattern) . '$#';

        return (bool) preg_match($regex, $path);
    }

    /**
     * Extract model type dan ID dari URL path.
     */
    private function extractModelInfo(string $path): ?array
    {
        // Pattern: admin/{type}/{id}/{action}
        if (preg_match('#admin/(\w+)/(\d+)#', $path, $matches)) {
            return [
                'type' => $matches[1],
                'id' => $matches[2],
            ];
        }

        return null;
    }
}
