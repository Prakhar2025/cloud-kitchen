<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\FoodItemController;
use App\Http\Controllers\User\MenuController;
use App\Http\Controllers\User\CartController;
use App\Http\Controllers\User\CheckoutController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\User\OrderController as UserOrderController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\User\NotificationController;
use App\Http\Controllers\User\AddressController;
use App\Http\Controllers\User\ProfileController as UserProfileController;
use App\Http\Controllers\Admin\FestivalBannerController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\User\RatingController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', [MenuController::class, 'index'])->name('menu');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('admin.dashboard');

    // CATEGORY ROUTES
    Route::get('/categories', [CategoryController::class, 'index'])
        ->name('admin.categories.index');

    Route::post('/categories', [CategoryController::class, 'store'])
        ->name('admin.categories.store');

    Route::get('/categories/{id}/edit', [CategoryController::class, 'edit'])
        ->name('admin.categories.edit');

    Route::post('/categories/{id}/update', [CategoryController::class, 'update'])
        ->name('admin.categories.update');

    Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])
        ->name('admin.categories.destroy');

    Route::get('/categories/{id}/toggle-status', [CategoryController::class, 'toggleStatus'])
        ->name('admin.categories.toggle');


    // FOOD ROUTES
    Route::get('/foods', [FoodItemController::class, 'index'])
        ->name('admin.foods.index');

    Route::get('/foods/create', [FoodItemController::class, 'create'])
        ->name('admin.foods.create');

    Route::post('/foods', [FoodItemController::class, 'store'])
        ->name('admin.foods.store');

    Route::get('/foods/{id}/edit', [FoodItemController::class, 'edit'])
        ->name('admin.foods.edit');

    Route::post('/foods/{id}/update', [FoodItemController::class, 'update'])
        ->name('admin.foods.update');

    Route::delete('/foods/{id}', [FoodItemController::class, 'destroy'])
        ->name('admin.foods.destroy');

    Route::get('/foods/{id}/toggle-status', [FoodItemController::class, 'toggleStatus'])
        ->name('admin.foods.toggle');

    Route::get('/orders', [AdminOrderController::class, 'index'])
        ->name('admin.orders.index');

    Route::post('/orders/{id}/status', [AdminOrderController::class, 'updateStatus'])
        ->name('admin.orders.updateStatus');

    Route::get('/festival-banners', [FestivalBannerController::class, 'index'])
        ->name('admin.festival_banners.index');

    Route::post('/festival-banners', [FestivalBannerController::class, 'store'])
        ->name('admin.festival_banners.store');

    Route::get('/festival-banners/{id}/edit', [FestivalBannerController::class, 'edit'])
        ->name('admin.festival_banners.edit');

    Route::put('/festival-banners/{id}', [FestivalBannerController::class, 'update'])
        ->name('admin.festival_banners.update');

    Route::delete('/festival-banners/{id}', [FestivalBannerController::class, 'destroy'])
        ->name('admin.festival_banners.destroy');

    Route::get('/festival-banners/{id}/toggle', [FestivalBannerController::class, 'toggleStatus'])
        ->name('admin.festival_banners.toggle');



});

Route::middleware('auth')->group(function () {

    Route::get('/cart', [CartController::class, 'index'])
        ->name('cart.index');

    Route::get('/add-to-cart/{id}', [CartController::class, 'add'])
        ->name('cart.add');

    Route::delete('/cart/{id}', [CartController::class, 'remove'])
        ->name('cart.remove');

    Route::get('/decrease-cart/{id}', [CartController::class, 'decrease'])
        ->name('cart.decrease');

});

Route::middleware('auth')->group(function () {
    Route::post('/place-order', [CheckoutController::class, 'placeOrder'])
        ->name('order.place');

    Route::get('/order-success', [CheckoutController::class, 'success'])
        ->name('order.success');
});

Route::middleware('auth')->get('/my-orders', [UserOrderController::class, 'index'])
    ->name('user.orders.index');

Route::middleware('auth')->post('/order/{id}/cancel', [UserOrderController::class, 'cancel'])
    ->name('user.order.cancel');

Route::middleware('auth')->get('/order/{id}/invoice', [UserOrderController::class, 'invoice'])
    ->name('user.order.invoice');

Route::middleware('auth')->get('/order/{id}/invoice/pdf', [UserOrderController::class, 'downloadInvoice'])
    ->name('user.order.invoice.pdf');

Route::middleware('auth')->get('/notifications', [NotificationController::class, 'index'])
    ->name('user.notifications');

Route::post('/order/{order}/rate', [UserOrderController::class, 'rate'])
    ->name('user.order.rate');

// Route::middleware('auth')->group(function () {

//     Route::get('/cart', [CartController::class, 'index'])->name('cart.index');

//     Route::get('/checkout/address', [CheckoutController::class, 'address'])
//         ->name('checkout.address');

//     Route::post('/checkout/address', [CheckoutController::class, 'storeAddress'])
//         ->name('checkout.address.store');

Route::get('/checkout/payment', [CheckoutController::class, 'payment'])
    ->name('checkout.payment');

Route::post('/checkout/payment', [CheckoutController::class, 'storePayment'])
    ->name('checkout.payment.store');

Route::get('/checkout/summary', [CheckoutController::class, 'summary'])
    ->name('checkout.summary');

Route::post('/checkout/place-order', [CheckoutController::class, 'placeOrder'])
    ->name('checkout.placeOrder');
// });



Route::middleware('auth')->group(function () {

    Route::get('/checkout/address', [AddressController::class, 'index'])
        ->name('checkout.address');

    Route::post('/checkout/address/select', [AddressController::class, 'select'])
        ->name('checkout.address.select');

    Route::post('/checkout/address/store', [AddressController::class, 'store'])
        ->name('checkout.address.store');
});

Route::middleware('auth')->group(function () {
   
    Route::get('/user/menu/category/{category}', [MenuController::class, 'category'])
        ->name('user.menu.category');

    Route::get('/user/profile', [UserProfileController::class, 'index'])
        ->name('user.profile.index');

    Route::get('/user/addresses', [UserProfileController::class, 'addresses'])
        ->name('user.addresses.index');

    Route::get('/user/addresses/{id}/edit', [UserProfileController::class, 'edit'])
        ->name('user.addresses.edit');
    Route::put('/user/addresses/{id}', [UserProfileController::class, 'update'])
        ->name('user.addresses.update');


    Route::delete('/user/addresses/{id}', [UserProfileController::class, 'delete'])
        ->name('user.addresses.delete');

    Route::get('/menu/ajax/search', [MenuController::class, 'ajaxSearch'])
        ->name('menu.ajax.search');

    Route::get('/menu/category/{category}', [MenuController::class, 'ajaxCategory'])
        ->name('menu.ajax.category');
});

Route::prefix('admin/reports')->middleware('auth')->group(function () {

    Route::get('/weekly', [ReportController::class, 'weekly'])
        ->name('admin.reports.weekly');

    Route::get('/monthly', [ReportController::class, 'monthly'])
        ->name('admin.reports.monthly');

    Route::get('/yearly', [ReportController::class, 'yearly'])
        ->name('admin.reports.yearly');

    Route::get('/admin/reports/weekly/pdf',[ReportController::class, 'weeklyPdf'])
        ->name('admin.reports.weekly.pdf');
    
    Route::get('/admin/reports/monthly/pdf',[ReportController::class, 'monthlyPdf'])
        ->name('admin.reports.monthly.pdf');
    
    Route::get('/admin/reports/yearly/pdf',[ReportController::class,'yearlyPdf'])
        ->name('admin.reports.yearly.pdf');

});

Route::get('/food/{food}', [MenuController::class, 'foodQuickView'])
    ->name('food.quickview');

 Route::get('/user/menu', [MenuController::class, 'index'])->name('menu');

 
Route::get('/menu/category/{category}', [MenuController::class, 'category'])
    ->name('menu.category');
    
Route::get('/category/{category}', [MenuController::class, 'category'])
    ->name('category.view');

Route::post('/rating/store', [RatingController::class, 'store'])
    ->name('rating.store')
    ->middleware('auth');


require __DIR__ . '/auth.php';
