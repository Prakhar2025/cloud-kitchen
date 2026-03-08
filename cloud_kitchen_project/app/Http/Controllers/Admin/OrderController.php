<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with([
            'user',
            'address',
            'items',
            'ratings.food',
            'ratings.user',
            'deliveryBoy'
        ])->latest()->get();

        $deliveryBoys = User::where('role', 'delivery')->get();

        return view('admin.orders.index', compact('orders', 'deliveryBoys'));
    }

    public function updateStatus($id)
    {
        $order = Order::findOrFail($id);

        $newStatus = request('status');

        // Admin allowed only these
        if (!in_array($newStatus, ['pending', 'accepted', 'preparing', 'out_for_delivery'])) {
            return back()->with('error', 'Invalid status update.');
        }

        $order->status = $newStatus;
        $order->save();

        return back()->with('success', 'Order status updated successfully');
    }

    public function assignDelivery($id)
    {
        $order = Order::findOrFail($id);

        $order->delivery_boy_id = request('delivery_boy_id');
        $order->save();

        return back()->with('success', 'Delivery boy assigned successfully');
    }
}