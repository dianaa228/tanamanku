<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// ── Path ke Laravel app (di luar public_html) ──
$basePath = dirname(__DIR__) . '/tanamanku';

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = $basePath . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require $basePath . '/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
(require_once $basePath . '/bootstrap/app.php')
    ->handleRequest(Request::capture());
