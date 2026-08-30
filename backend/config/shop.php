<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Shipping Cost
    |--------------------------------------------------------------------------
    |
    | Default ongkos kirim jika client tidak mengirim shipping_cost.
    | Untuk production, override via env SHIPPING_COST_DEFAULT.
    |
    */
    'shipping_cost_default' => (float) env('SHIPPING_COST_DEFAULT', 15000),

    /*
    |--------------------------------------------------------------------------
    | Loyalty Tiers
    |--------------------------------------------------------------------------
    */
    'loyalty' => [
        'tiers' => [
            'bronze' => ['min_points' => 0, 'multiplier' => 1],
            'silver' => ['min_points' => 1000, 'multiplier' => 1.5],
            'gold' => ['min_points' => 5000, 'multiplier' => 2],
            'platinum' => ['min_points' => 15000, 'multiplier' => 3],
        ],
        'points_per_rupiah' => (int) env('LOYALTY_POINTS_PER_RP', 1),
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Reset Expiry (minutes)
    |--------------------------------------------------------------------------
    */
    'password_reset_expiry' => (int) env('PASSWORD_RESET_EXPIRY_MINUTES', 60),

];
