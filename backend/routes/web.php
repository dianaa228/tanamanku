angg mrkii<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| Tanamanku murni API — frontend (React/Flutter) mengonsumsi /api/v1.
| Halaman web hanya sebagai fallback health check.
*/

Route::get('/', fn () => response()->json([
    'success' => true,
    'message' => 'Tanamanku API — gunakan /api/v1. Lihat docs/06-api.json.',
]));
