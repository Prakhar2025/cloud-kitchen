<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\FoodItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = Cart::where('user_id', auth()->id())
            ->with('foodItem')
            ->get();
            
        $subtotal = $cartItems->sum(function($item) {
            return $item->foodItem->price * $item->quantity;
        });

        return response()->json([
            'success' => true,
            'data' => [
                'items' => $cartItems,
                'subtotal' => $subtotal
            ]
        ]);
    }

    public function add($id)
    {
        $foodItem = FoodItem::findOrFail($id);
        
        $cart = Cart::where('user_id', auth()->id())
            ->where('food_item_id', $id)
            ->first();

        if ($cart) {
            $cart->increment('quantity');
        } else {
            Cart::create([
                'user_id' => auth()->id(),
                'food_item_id' => $id,
                'quantity' => 1
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart'
        ]);
    }

    public function decrease($id)
    {
        $cart = Cart::where('user_id', auth()->id())
            ->where('food_item_id', $id)
            ->first();

        if ($cart) {
            if ($cart->quantity > 1) {
                $cart->decrement('quantity');
            } else {
                $cart->delete();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Item quantity updated'
        ]);
    }

    public function remove($id)
    {
        Cart::where('user_id', auth()->id())
            ->where('food_item_id', $id)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart'
        ]);
    }
}
