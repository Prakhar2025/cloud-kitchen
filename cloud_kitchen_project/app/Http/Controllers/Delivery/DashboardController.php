<?php

namespace App\Http\Controllers\Delivery;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class DashboardController extends Controller
{
    public function index()
    {
        $deliveryId = auth()->id();

        $activeOrders = Order::with('address')
            ->where('delivery_boy_id', $deliveryId)
            ->whereIn('status', ['accepted', 'preparing', 'out_for_delivery'])
            ->latest()
            ->get();

        $completedOrders = Order::with('address')
            ->where('delivery_boy_id', $deliveryId)
            ->where('status', 'delivered')
            ->latest()
            ->get();

        $totalDelivered = $completedOrders->count();

        return view('delivery.dashboard', compact(
            'activeOrders',
            'completedOrders',
            'totalDelivered'
        ));
    }
    public function myOrders()
    {
        $orders = Order::with('address')
            ->where('delivery_boy_id', auth()->id())
            ->latest()
            ->get();

        return view('delivery.my_orders', compact('orders'));
    }
    public function updateStatus(Request $request, $id)
    {
        $order = Order::where('id', $id)
            ->where('delivery_boy_id', auth()->id())
            ->firstOrFail();

        $request->validate([
            'status' => 'required|in:out_for_delivery,delivered'
        ]);

        $order->status = $request->status;

        if ($order->payment_method === 'cod' && $request->status === 'delivered') {
            $order->payment_status = 'paid';
        }

        $order->save();

        return redirect()->route('delivery.dashboard')
            ->with('success', 'Order status updated successfully');
    }

    public function updateLocation(Request $request)
    {

        $user = auth()->user();

        $user->update([
            'latitude' => $request->latitude,
            'longitude' => $request->longitude
        ]);

        return response()->json(['success' => true]);

    }
}