
<?php

/**
 * Role & permission Tanamanku (docs/03-user-roles.json).
 * Role disimpan di kolom users.role; permission digunakan oleh middleware & policy.
 */

return [
    'default' => 'customer',

    'roles' => [
        'customer' => [
            'view_products',
            'manage_cart',
            'create_order',
            'view_own_orders',
            'manage_own_garden',
            'create_post',
            'comment',
            'like_post',
            'create_plant_listing',
            'book_service',
            'review_purchased_product',
        ],
        'seller' => [
            'view_products',
            'manage_cart',
            'create_order',
            'view_own_orders',
            'manage_own_garden',
            'create_post',
            'comment',
            'like_post',
            'create_plant_listing',
            'book_service',
            'review_purchased_product',
            'manage_store',
            'manage_products',
            'manage_inventory',
            'fulfill_orders',
            'view_sales',
            'manage_product_reviews',
        ],
        'admin' => [
            '*',
        ],
    ],
];
