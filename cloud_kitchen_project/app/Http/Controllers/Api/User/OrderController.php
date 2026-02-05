<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Cart;
use App\Models\UserAddress;  // Fixed: Changed from Address to UserAddress
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', auth()->id())
            ->with(['items.foodItem', 'address'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    public function placeOrder(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:user_addresses,id',  // Fixed: Changed from addresses to user_addresses
            'payment_method' => 'required|in:cod,online',
        ]);

        $address = UserAddress::where('id', $request->address_id)  // Fixed: Changed from Address to UserAddress
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $cartItems = Cart::where('user_id', auth()->id())->with('foodItem')->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Cart is empty'
            ], 400);
        }

        $total = $cartItems->sum(function($item) {
            return $item->foodItem->price * $item->quantity;
        });

        try {
            DB::beginTransaction();

            $order = Order::create([
                'user_id' => auth()->id(),
                'address_id' => $address->id,
                'total_amount' => $total,
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
                'status' => 'pending',
                'order_date' => now()
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'food_item_id' => $item->food_item_id,
                    'food_name' => $item->foodItem->name,  // Added: Include food name for order history
                    'quantity' => $item->quantity,
                    'price' => $item->foodItem->price
                ]);
            }

            // Clear Cart
            Cart::where('user_id', auth()->id())->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data' => $order
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to place order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function cancel(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'Cannot cancel processed order'], 400);
        }

        $order->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Order cancelled successfully'
        ]);
    }

    public function rate(Request $request, Order $order)
    {
         // Assume basic rating logic for now, expanding based on UserOrderController if needed
         // For now, let's stick to the core ordering flow.
         return response()->json(['success' => true, 'message' => 'Rating feature pending implementation']);
    }
}
