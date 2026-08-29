<?php
// ========================================
// Tanamanku — Combined Entry Point
// ========================================
// Handles both API (Laravel) and SPA (React) routing
// Upload ke: ~/public_html/index.php
// ========================================

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$basePath = dirname(__DIR__) . '/tanamanku';

// ── API routes → Laravel ──
if (str_starts_with($uri, '/api/')) {
    // Maintenance mode check
    if (file_exists($maintenance = $basePath . '/storage/framework/maintenance.php')) {
        require $maintenance;
    }

    // Bootstrap Laravel
    require $basePath . '/vendor/autoload.php';
    (require_once $basePath . '/bootstrap/app.php')
        ->handleRequest(\Illuminate\Http\Request::capture());
    return;
}

// ── Static files → serve directly ──
$filePath = __DIR__ . $uri;
if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    // Set proper MIME types
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
    return;
}

// ── Everything else → React SPA (index.html) ──
$indexFile = __DIR__ . '/index.html';
if (file_exists($indexFile)) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($indexFile);
    return;
}

// ── Fallback ──
http_response_code(404);
echo 'Not Found';
