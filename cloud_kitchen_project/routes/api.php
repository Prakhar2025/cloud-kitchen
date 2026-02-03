<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
| IMPORTANT: These routes are prefixed with /api automatically.
| Rate limiting is applied via the 'api' middleware group in Kernel.php.
|
*/

/*
|--------------------------------------------------------------------------
| API Version 1 Routes
|--------------------------------------------------------------------------
|
| All v1 API routes are grouped under /api/v1 prefix.
| This allows for future API versioning without breaking changes.
|
*/
Route::prefix('v1')->group(function () {
    
    /*
    |----------------------------------------------------------------------
    | Public Routes (No Authentication Required)
    |----------------------------------------------------------------------
    |
    | These routes are accessible without an auth token.
    | Rate limiting is handled by the 'api' middleware group.
    |
    */
    
    // User Registration
    // POST /api/v1/register
    Route::post('/register', [AuthController::class, 'register'])
        ->name('api.v1.register');
    
    // User Login
    // POST /api/v1/login
    Route::post('/login', [AuthController::class, 'login'])
        ->name('api.v1.login');
    
    /*
    |----------------------------------------------------------------------
    | Protected Routes (Authentication Required)
    |----------------------------------------------------------------------
    |
    | These routes require a valid Sanctum token in the Authorization header:
    | Authorization: Bearer <token>
    |
    */
    Route::middleware('auth:sanctum')->group(function () {
        
        // Get Authenticated User Profile
        // GET /api/v1/user
        Route::get('/user', [AuthController::class, 'user'])
            ->name('api.v1.user');
        
        // Logout (Revoke Current Token)
        // POST /api/v1/logout
        Route::post('/logout', [AuthController::class, 'logout'])
            ->name('api.v1.logout');
        
        // Logout from All Devices (Revoke All Tokens)
        // POST /api/v1/logout-all
        Route::post('/logout-all', [AuthController::class, 'logoutAll'])
            ->name('api.v1.logout-all');
    });
});

/*
|--------------------------------------------------------------------------
| Health Check Endpoint
|--------------------------------------------------------------------------
|
| Simple endpoint to verify API is running.
| Useful for mobile app to check connectivity.
|
*/
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'version' => 'v1',
    ]);
})->name('api.health');
