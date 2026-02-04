<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\User\MenuController;
use App\Http\Controllers\Api\User\CartController;
use App\Http\Controllers\Api\User\OrderController;
use App\Http\Controllers\Api\User\AddressController;
use App\Http\Controllers\Api\User\ProfileController;

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

        // ====================================================================
        // User Module Routes
        // ====================================================================

        // Menu
        // GET /api/v1/user/menu
        Route::get('/user/menu', [MenuController::class, 'index'])->name('api.v1.user.menu.index');

        // Cart
        // GET /api/v1/user/cart
        Route::get('/user/cart', [CartController::class, 'index'])->name('api.v1.user.cart.index');
        // POST /api/v1/user/cart/{id}/add
        Route::post('/user/cart/{id}/add', [CartController::class, 'add'])->name('api.v1.user.cart.add');
        // POST /api/v1/user/cart/{id}/decrease
        Route::post('/user/cart/{id}/decrease', [CartController::class, 'decrease'])->name('api.v1.user.cart.decrease');
        // DELETE /api/v1/user/cart/{id}
        Route::delete('/user/cart/{id}', [CartController::class, 'remove'])->name('api.v1.user.cart.remove');

        // Orders
        // GET /api/v1/user/orders
        Route::get('/user/orders', [OrderController::class, 'index'])->name('api.v1.user.orders.index');
        // POST /api/v1/user/orders/place
        Route::post('/user/orders/place', [OrderController::class, 'placeOrder'])->name('api.v1.user.orders.place');
        // POST /api/v1/user/orders/{order}/cancel
        Route::post('/user/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('api.v1.user.orders.cancel');
        // POST /api/v1/user/orders/{order}/rate
        Route::post('/user/orders/{order}/rate', [OrderController::class, 'rate'])->name('api.v1.user.orders.rate');

        // Address
        // GET /api/v1/user/addresses
        Route::get('/user/addresses', [AddressController::class, 'index'])->name('api.v1.user.addresses.index');
        // POST /api/v1/user/addresses
        Route::post('/user/addresses', [AddressController::class, 'store'])->name('api.v1.user.addresses.store');
        // PUT /api/v1/user/addresses/{address}
        Route::put('/user/addresses/{address}', [AddressController::class, 'update'])->name('api.v1.user.addresses.update');
        // DELETE /api/v1/user/addresses/{address}
        Route::delete('/user/addresses/{address}', [AddressController::class, 'destroy'])->name('api.v1.user.addresses.destroy');

        // Profile
        // POST /api/v1/user/profile/update
        Route::post('/user/profile/update', [ProfileController::class, 'update'])->name('api.v1.user.profile.update');

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
