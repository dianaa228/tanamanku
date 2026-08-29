<?php
// ========================================
// Tanamanku — API Entry Point (Hostinger)
// ========================================
// Upload ke: ~/public_html/api.php
// ========================================

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// ── Auto-detect backend path ──
// On Hostinger, public_html may be a symlink to domains/.../public_html/
// __DIR__ resolves symlinks, so we need to check multiple locations
$possiblePaths = [
    dirname(__DIR__) . '/tanamanku',                    // ~/tanamanku (if no symlink)
    dirname(dirname(__DIR__)) . '/tanamanku',            // ~/domains/.../../tanamanku
    dirname(dirname(dirname(__DIR__))) . '/tanamanku',   // ~/domains/tanamanku
    $_SERVER['DOCUMENT_ROOT'] . '/../tanamanku',         // relative to docroot
    (getenv('HOME') ?: '/home/' . get_current_user()) . '/tanamanku',  // absolute home
    '/home/' . get_current_user() . '/tanamanku',        // explicit home
];

$basePath = null;
foreach ($possiblePaths as $path) {
    $path = realpath($path) ?: $path;
    if (file_exists($path . '/artisan')) {
        $basePath = $path;
        break;
    }
}

if (!$basePath) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Backend application not found',
        'debug' => [
            'tried_paths' => array_map(fn($p) => realpath($p) ?: $p, $possiblePaths),
            'doc_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
            'dir' => __DIR__,
            'home' => getenv('HOME'),
            'user' => get_current_user(),
        ],
    ]);
    exit;
}

// ── Maintenance mode ──
if (file_exists($maintenance = $basePath . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

// ── Bootstrap Laravel ──
require $basePath . '/vendor/autoload.php';

$app = require_once $basePath . '/bootstrap/app.php';
$app->handleRequest(Request::capture());
