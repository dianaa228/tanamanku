<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Controllers\Api\V1\CommunityController;
use App\Http\Controllers\Api\V1\MyGardenController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\PlantCareController;
use App\Http\Controllers\Api\V1\PlantDiagnosisController;
use App\Http\Controllers\Api\V1\PlantExchangeController;
use App\Http\Controllers\Api\V1\PlantFinderController;
use App\Http\Controllers\Api\V1\PlantGrowthController;
use App\Http\Controllers\Api\V1\PlantReminderController;
use App\Http\Controllers\Api\V1\PlantSpeciesController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\ServiceOrderController;
use App\Http\Controllers\Api\V1\ShipmentController;
use App\Http\Controllers\Api\V1\StoreController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\LoyaltyController;
use App\Http\Controllers\Api\V1\SubscriptionController;
use App\Http\Controllers\Api\V1\NurseryController;
use App\Http\Controllers\Api\V1\AnalyticsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Tanamanku API — base: /api/v1 (docs/06-api.json)
|--------------------------------------------------------------------------
| Frontend (React & Flutter) mengonsumsi API ini. Semua resource protected
| memakai Sanctum + ownership check via Policy.
*/

// ===== Sanctum login redirect (for unauthenticated API responses) =====
Route::post('/login', fn () => response()->json([
    'success' => false,
    'message' => 'Unauthenticated.',
], 401))->name('login');

// ===== Auth (publik) =====
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

// ===== Katalog (publik sebagian) =====
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/stores', [StoreController::class, 'index']);
Route::get('/stores/{store}', [StoreController::class, 'show']);
Route::get('/stores/{store}/products', [ProductController::class, 'byStore']);
Route::get('/plant-species', [PlantSpeciesController::class, 'index']);
Route::get('/plant-species/{plantSpecies}', [PlantSpeciesController::class, 'show']);

// ===== Protected (customer) =====
Route::middleware('auth:sanctum')->group(function () {
    // User
    Route::get('/users/me', [UserController::class, 'me']);
    Route::put('/users/me', [UserController::class, 'update']);
    Route::get('/users/me/addresses', [UserController::class, 'addresses']);
    Route::post('/users/me/addresses', [UserController::class, 'storeAddress']);
    Route::put('/users/me/addresses/{address}', [UserController::class, 'updateAddress']);

    // Cart
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'show']);
        Route::post('/items', [CartController::class, 'addItem']);
        Route::put('/items/{cartItem}', [CartController::class, 'updateItem']);
        Route::delete('/items/{cartItem}', [CartController::class, 'removeItem']);
        Route::delete('/', [CartController::class, 'clear']);
    });

    // Orders
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index']);
        Route::post('/', [OrderController::class, 'store']);
        Route::get('/{order}', [OrderController::class, 'show'])->middleware('can:view,order');
        Route::post('/{order}/cancel', [OrderController::class, 'cancel'])->middleware('can:update,order');
        Route::post('/{order}/pay', [PaymentController::class, 'create'])->middleware('can:update,order');
        Route::get('/{order}/shipment', [ShipmentController::class, 'show'])->middleware('can:view,order');
    });

    // Ulasan
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::post('/products/{product}/favorite', [ProductController::class, 'toggleFavorite']);

    // My Garden
    Route::prefix('my-garden')->group(function () {
        Route::get('/', [MyGardenController::class, 'index']);
        Route::post('/', [MyGardenController::class, 'store']);
        Route::get('/{userPlant}', [MyGardenController::class, 'show'])->middleware('can:view,userPlant');
        Route::put('/{userPlant}', [MyGardenController::class, 'update'])->middleware('can:update,userPlant');
        Route::delete('/{userPlant}', [MyGardenController::class, 'destroy'])->middleware('can:delete,userPlant');
        Route::post('/{userPlant}/photos', [MyGardenController::class, 'addPhoto'])->middleware('can:update,userPlant');
        Route::get('/{userPlant}/growth', [PlantGrowthController::class, 'index'])->middleware('can:view,userPlant');
        Route::post('/{userPlant}/growth', [PlantGrowthController::class, 'store'])->middleware('can:update,userPlant');
        Route::post('/{userPlant}/care', [PlantCareController::class, 'store'])->middleware('can:update,userPlant');
        Route::get('/{userPlant}/reminders', [PlantReminderController::class, 'index'])->middleware('can:view,userPlant');
        Route::post('/{userPlant}/reminders', [PlantReminderController::class, 'store'])->middleware('can:update,userPlant');
        Route::put('/reminders/{plantReminder}', [PlantReminderController::class, 'update'])->middleware('can:update,plantReminder');
        Route::delete('/reminders/{plantReminder}', [PlantReminderController::class, 'destroy'])->middleware('can:update,plantReminder');
        Route::post('/reminders/{plantReminder}/done', [PlantReminderController::class, 'markDone'])->middleware('can:update,plantReminder');
    });

    // Smart Plant
    Route::get('/plant-finder/recommend', [PlantFinderController::class, 'recommend']);
    Route::get('/plant-finder/questions', [PlantFinderController::class, 'questions']);
    Route::post('/plant-diagnosis', [PlantDiagnosisController::class, 'diagnose']);

    // Community
    Route::prefix('community')->group(function () {
        Route::get('/posts', [CommunityController::class, 'index']);
        Route::post('/posts', [CommunityController::class, 'store']);
        Route::get('/posts/{post}', [CommunityController::class, 'show']);
        Route::delete('/posts/{post}', [CommunityController::class, 'destroy'])->middleware('can:delete,post');
        Route::post('/posts/{post}/like', [CommunityController::class, 'toggleLike']);
        Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
        Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
        Route::post('/posts/{post}/report', [CommunityController::class, 'report']);
    });

    // Plant Exchange
    Route::prefix('plant-exchange')->group(function () {
        Route::get('/listings', [PlantExchangeController::class, 'index']);
        Route::post('/listings', [PlantExchangeController::class, 'store']);
        Route::post('/listings/{plantListing}/offer', [PlantExchangeController::class, 'offer']);
        Route::put('/exchanges/{plantExchange}', [PlantExchangeController::class, 'respond']);
    });

    // Services
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{service}', [ServiceController::class, 'show']);
    Route::post('/service-orders', [ServiceOrderController::class, 'store']);
    Route::get('/service-orders', [ServiceOrderController::class, 'index']);
    Route::get('/service-orders/{serviceOrder}', [ServiceOrderController::class, 'show']);

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
    });

    // Loyalty
    Route::prefix('loyalty')->group(function () {
        Route::get('/profile', [LoyaltyController::class, 'profile']);
        Route::get('/tiers', [LoyaltyController::class, 'tiers']);
        Route::get('/rewards', [LoyaltyController::class, 'rewards']);
        Route::post('/rewards/{rewardId}/redeem', [LoyaltyController::class, 'redeem']);
        Route::get('/history', [LoyaltyController::class, 'history']);
    });

    // Subscription
    Route::prefix('subscription')->group(function () {
        Route::get('/plans', [SubscriptionController::class, 'plans']);
        Route::get('/current', [SubscriptionController::class, 'current']);
        Route::post('/subscribe', [SubscriptionController::class, 'subscribe']);
        Route::post('/cancel', [SubscriptionController::class, 'cancel']);
        Route::get('/billing', [SubscriptionController::class, 'billing']);
    });

    // Nursery
    Route::get('/nurseries', [NurseryController::class, 'index']);
    Route::get('/nurseries/{idOrSlug}', [NurseryController::class, 'show']);
    Route::get('/nurseries/{nurseryId}/products', [NurseryController::class, 'products']);

    // Seller Analytics
    Route::get('/seller/analytics', [AnalyticsController::class, 'seller']);
});

// ===== Seller (web) =====
Route::middleware(['auth:sanctum', 'role:seller,admin'])->prefix('seller')->group(function () {
    Route::get('/dashboard', [StoreController::class, 'dashboard']);
    Route::get('/store', [StoreController::class, 'myStore']);
    Route::put('/store', [StoreController::class, 'update']);
    Route::get('/products', [ProductController::class, 'sellerProducts']);
    Route::post('/products', [ProductController::class, 'store'])->middleware('can:create,App\Models\Product');
    Route::put('/products/{product}', [ProductController::class, 'update'])->middleware('can:update,product');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->middleware('can:delete,product');
    Route::get('/inventory', [ProductController::class, 'inventory']);
    Route::put('/inventory/{product}', [ProductController::class, 'updateInventory'])->middleware('can:update,product');
    Route::get('/orders', [OrderController::class, 'sellerOrders']);
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus'])->middleware('can:fulfill,order');
    Route::get('/sales', [OrderController::class, 'salesReport']);
});

// ===== Admin (web) =====
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [UserController::class, 'adminDashboard']);
    Route::get('/users', [UserController::class, 'adminUsers']);
    Route::put('/users/{user}/role', [UserController::class, 'adminUpdateRole']);
    Route::post('/users/{user}/toggle', [UserController::class, 'adminToggleActive']);
    Route::get('/stores', [StoreController::class, 'adminStores']);
    Route::post('/stores/{store}/verify', [StoreController::class, 'verify']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    Route::get('/reports', [OrderController::class, 'adminReports']);
    Route::get('/community/reports', [CommunityController::class, 'reported']);
    Route::post('/community/reports/{report}/resolve', [CommunityController::class, 'resolveReport']);
    Route::post('/plant-species', [PlantSpeciesController::class, 'store']);
    Route::put('/plant-species/{plantSpecies}', [PlantSpeciesController::class, 'update']);

    // Admin Analytics
    Route::get('/analytics', [AnalyticsController::class, 'admin']);
});

// Webhook pembayaran (publik, diverifikasi signature di PaymentService)
Route::post('/webhooks/payment', [PaymentController::class, 'webhook'])->withoutMiddleware(['auth:sanctum']);
