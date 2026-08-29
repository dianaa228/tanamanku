<?php
// ========================================
// Tanamanku — API Entry Point (Hostinger)
// ========================================
// Upload ke: ~/public_html/api.php
// ========================================

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// ── Auto-detect backend path ──
$possiblePaths = [
    dirname(__DIR__) . '/tanamanku',
    dirname(dirname(__DIR__)) . '/tanamanku',
    getenv('HOME') . '/tanamanku',
];

$basePath = null;
foreach ($possiblePaths as $path) {
    if (file_exists($path . '/artisan')) {
        $basePath = $path;
        break;
    }
}

if (!$basePath) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Backend application not found']);
    exit;
}

// ── Maintenance mode ──
if (file_exists($maintenance = $basePath . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

// ── Bootstrap Laravel ─~
require $basePath . '/vendor/autoload.php';

$app = require_once $basePath . '/bootstrap/app.php';
$app->handleRequest(Request::capture());
