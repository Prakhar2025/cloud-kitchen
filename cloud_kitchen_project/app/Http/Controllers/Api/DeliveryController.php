<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class DeliveryController extends Controller
{
    /**
     * Get delivery dashboard data (active orders, completed count)
     */
    public function dashboard(Request $request)
    {
        $deliveryId = $request->user()->id;

        $activeOrders = Order::with('address')
            ->where('delivery_boy_id', $deliveryId)
            ->whereIn('status', ['accepted', 'preparing', 'out_for_delivery'])
            ->latest()
            ->get();

        $completedOrdersCount = Order::where('delivery_boy_id', $deliveryId)
            ->where('status', 'delivered')
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'active_orders' => $activeOrders,
                'total_delivered' => $completedOrdersCount
            ]
        ]);
    }

    /**
     * Get delivery order history
     */
    public function history(Request $request)
    {
        $deliveryId = $request->user()->id;

        $orders = Order::with('address')
            ->where('delivery_boy_id', $deliveryId)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'orders' => $orders
            ]
        ]);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::where('id', $id)
            ->where('delivery_boy_id', $request->user()->id)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found or not assigned to you'
            ], 404);
        }

        $request->validate([
            'status' => 'required|in:out_for_delivery,delivered'
        ]);

        $order->status = $request->status;

        if ($order->payment_method === 'cod' && $request->status === 'delivered') {
            $order->payment_status = 'paid';
        }

        $order->save();

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'data' => [
                'order' => $order
            ]
        ]);
    }

    /**
     * Update delivery location
     */
    public function updateLocation(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric'
        ]);

        $user = $request->user();

        $user->update([
            'latitude' => $request->latitude,
            'longitude' => $request->longitude
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Location updated successfully'
        ]);
    }
}
