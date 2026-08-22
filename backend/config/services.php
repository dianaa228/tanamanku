<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Payment Gateway
    |--------------------------------------------------------------------------
    |
    | Konfigurasi payment gateway Tanamanku.
    | Webhook secret digunakan untuk memverifikasi HMAC-SHA256 signature
    | dari setiap request webhook yang masuk dari payment gateway.
    |
    | PAYMENT_PROVIDER: 'midtrans' | 'xendit' | 'tripay' | 'stub'
    | PAYMENT_WEBHOOK_SECRET: Secret key untuk HMAC signature verification
    | PAYMENT_WEBHOOK_HEADER: Nama header yang berisi signature (default: X-Webhook-Signature)
    |
    */
    'payment' => [
        'provider' => env('PAYMENT_PROVIDER', 'stub'),
        'webhook_secret' => env('PAYMENT_WEBHOOK_SECRET', ''),
        'webhook_header' => env('PAYMENT_WEBHOOK_HEADER', 'X-Webhook-Signature'),
    ],

];
