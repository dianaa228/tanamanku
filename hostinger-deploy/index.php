<?php
// ========================================
// Tanamanku — Combined Entry Point (Hostinger)
// ========================================
// Handles both API (Laravel) and SPA (React) routing
// Upload ke: ~/public_html/index.php
// ========================================

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// ── Auto-detect backend path ──
$possiblePaths = [
    dirname(__DIR__) . '/tanamanku',
    dirname(dirname(__DIR__)) . '/tanamanku',
    dirname(dirname(dirname(__DIR__))) . '/tanamanku',
    $_SERVER['DOCUMENT_ROOT'] . '/../tanamanku',
    (getenv('HOME') ?: '/home/' . get_current_user()) . '/tanamanku',
    '/home/' . get_current_user() . '/tanamanku',
];

$basePath = null;
foreach ($possiblePaths as $path) {
    $resolved = realpath($path) ?: $path;
    if (file_exists($resolved . '/artisan')) {
        $basePath = $resolved;
        break;
    }
}

// ── API routes → Laravel ──
if (str_starts_with($uri, '/api/')) {
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
            ],
        ]);
        exit;
    }

    // Maintenance mode check
    if (file_exists($maintenance = $basePath . '/storage/framework/maintenance.php')) {
        require $maintenance;
    }

    // Bootstrap Laravel
    require $basePath . '/vendor/autoload.php';
    $app = require_once $basePath . '/bootstrap/app.php';
    $app->handleRequest(\Illuminate\Http\Request::capture());
    exit;
}

// ── Static files → serve directly ──
$filePath = __DIR__ . $uri;
if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
    $mimeTypes = [
        'js'   => 'application/javascript',
        'css'  => 'text/css',
        'json' => 'application/json',
        'svg'  => 'image/svg+xml',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif'  => 'image/gif',
        'ico'  => 'image/x-icon',
        'woff' => 'font/woff',
        'woff2'=> 'font/woff2',
        'ttf'  => 'font/ttf',
        'webp' => 'image/webp',
    ];
    if (isset($mimeTypes[$ext])) {
        header('Content-Type: ' . $mimeTypes[$ext]);
    }
    readfile($filePath);
    exit;
}

// ── Everything else → React SPA (index.html) ──
$indexFile = __DIR__ . '/index.html';
if (file_exists($indexFile)) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($indexFile);
    exit;
}

// ── Fallback ──
http_response_code(404);
echo 'Not Found';
