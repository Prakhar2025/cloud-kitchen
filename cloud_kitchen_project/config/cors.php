<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    | MOBILE APP CONFIGURATION:
    | This configuration allows React Native and other mobile apps to
    | communicate with the API. In production, replace '*' with specific
    | allowed origins for enhanced security.
    |
    */

    // Paths that should handle CORS (API and Sanctum CSRF cookie)
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // HTTP methods allowed for CORS requests
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    // Allowed origins - in production, specify exact domains
    // Example for production: ['https://yourapp.com', 'https://api.yourapp.com']
    'allowed_origins' => ['*'],

    // Regex patterns for allowed origins (advanced use)
    'allowed_origins_patterns' => [],

    // Headers that can be used in the actual request
    'allowed_headers' => [
        'Content-Type',
        'X-Requested-With',
        'Authorization',  // Required for Bearer token authentication
        'Accept',
        'Origin',
        'X-CSRF-TOKEN',
    ],

    // Headers to expose to the browser
    'exposed_headers' => [
        'Authorization',
    ],

    // How long the results of a preflight request can be cached (seconds)
    // 86400 = 24 hours
    'max_age' => 86400,

    // Whether to allow credentials (cookies, authorization headers)
    // Set to true if using Sanctum's SPA authentication
    // For token-based auth (mobile), this can be false
    'supports_credentials' => false,

];
