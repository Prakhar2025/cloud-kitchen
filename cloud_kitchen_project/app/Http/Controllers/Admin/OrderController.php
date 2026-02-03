<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Notification;


class OrderController extends Controller
{
   public function index()
{
    $orders = Order::with([
        'user',
        'address',
        'items',
        'ratings.food',
        'ratings.user'
    ])->latest()->get();

    return view('admin.orders.index', compact('orders'));
}


    public function updateStatus($id)
{
    $order = Order::findOrFail($id);

    $order->status = request('status');
    $order->save();

    Notification::create([
    'user_id' => $order->user_id,
    'message' => "Your order #{$order->id} status has been updated to {$order->status}"
]);

    return redirect()->back()
        ->with('success', 'Order status updated successfully');
}

}
