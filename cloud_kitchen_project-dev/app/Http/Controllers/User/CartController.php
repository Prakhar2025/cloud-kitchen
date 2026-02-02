<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\FoodItem;

class CartController extends Controller
{
    // Add to cart
    public function add($foodId)
    {
        $food = FoodItem::findOrFail($foodId);

        $cart = Cart::where('user_id', auth()->id())
            ->where('food_item_id', $foodId)
            ->first();

        if ($cart) {
            // If already in cart, increase quantity
            $cart->increment('quantity');
        } else {
            // Add new item
            Cart::create([
                'user_id' => auth()->id(),
                'food_item_id' => $foodId,
                'quantity' => 1,
            ]);
        }

        return redirect()->back()->with('success', 'Food added to cart');
    }

    // View cart
    public function index()
    {
        $cartItems = Cart::with('food')
            ->where('user_id', auth()->id())
            ->get();

        return view('user.cart', compact('cartItems'));
    }

    // Remove item
    public function remove($id)
    {
        Cart::where('id', $id)
            ->where('user_id', auth()->id())
            ->delete();

        return redirect()->back()->with('success', 'Item removed from cart');
    }

    public function decrease($foodId)
{
    $cart = Cart::where('user_id', auth()->id())
        ->where('food_item_id', $foodId)
        ->first();

    if ($cart) {
        if ($cart->quantity > 1) {
            $cart->decrement('quantity');
        } else {
            $cart->delete();
        }
    }

    return redirect()->back();
}

}
