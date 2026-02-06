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
            'address_id' => 'required|exists:user_addresses,id',
            'payment_method' => 'required|in:cod,online',
            'subtotal' => 'required|numeric|min:0',
            'gst_amount' => 'required|numeric|min:0',
            'delivery_charge' => 'required|numeric|min:0',
            'payment_processing_fee' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
        ]);

        $address = UserAddress::where('id', $request->address_id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $cartItems = Cart::where('user_id', auth()->id())->with('foodItem')->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Cart is empty'
            ], 400);
        }

        // Calculate and verify subtotal from cart items
        $calculatedSubtotal = $cartItems->sum(function($item) {
            return $item->foodItem->price * $item->quantity;
        });

        // Verify client calculations match server calculations (security check)
        if (abs($calculatedSubtotal - $request->subtotal) > 0.01) {
            return response()->json([
                'success' => false,
                'message' => 'Subtotal mismatch. Please refresh and try again.'
            ], 400);
        }

        // Verify GST calculation (18%)
        $calculatedGst = round($calculatedSubtotal * 0.18, 2);
        if (abs($calculatedGst - $request->gst_amount) > 0.01) {
            return response()->json([
                'success' => false,
                'message' => 'GST calculation mismatch. Please refresh and try again.'
            ], 400);
        }

        // Verify total calculation
        $calculatedTotal = $calculatedSubtotal + $request->gst_amount + $request->delivery_charge + $request->payment_processing_fee;
        if (abs($calculatedTotal - $request->total_amount) > 0.01) {
            return response()->json([
                'success' => false,
                'message' => 'Total amount mismatch. Please refresh and try again.'
            ], 400);
        }

        try {
            DB::beginTransaction();

            $order = Order::create([
                'user_id' => auth()->id(),
                'address_id' => $address->id,
                'subtotal' => $request->subtotal,
                'gst_amount' => $request->gst_amount,
                'delivery_charge' => $request->delivery_charge,
                'payment_processing_fee' => $request->payment_processing_fee,
                'total_amount' => $request->total_amount,
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
                'status' => 'pending',
                'order_date' => now()
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'food_item_id' => $item->food_item_id,
                    'food_name' => $item->foodItem->name,
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
