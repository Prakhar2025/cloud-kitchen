<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\UserAddress;


class CheckoutController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }


    public function placeOrder(Request $request)
    {
        if (!session()->has('checkout.address_id') || !session()->has('checkout.payment_method')) {
            return redirect()->route('checkout.address');
        }

        DB::beginTransaction();

        try {
            $address = UserAddress::where('id', session('checkout.address_id'))
                ->where('user_id', auth()->id())
                ->firstOrFail();

            $cartItems = Cart::with('food')
                ->where('user_id', auth()->id())
                ->get();

            if ($cartItems->isEmpty()) {
                return redirect()->route('cart.index');
            }

            $total = 0;
            foreach ($cartItems as $item) {
                $total += $item->food->price * $item->quantity;
            }

            $order = Order::create([
                'user_id' => auth()->id(),
                'address_id' => session('checkout.address_id'),
                // 'delivery_name' => $address->name,
                // 'delivery_phone' => $address->phone,
                // 'delivery_address' => $address->address,
                // 'delivery_city' => $address->city,
                // 'delivery_pincode' => $address->pincode,
                'total_amount' => $total,
                'payment_method' => session('checkout.payment_method'),
                'payment_status' => session('checkout.payment_method') === 'cod' ? 'unpaid' : 'pending',
                'status' => 'pending',
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'food_item_id' => $item->food->id,
                    'food_name' => $item->food->name,
                    'quantity' => $item->quantity,
                    'price' => $item->food->price,
                ]);
            }

            Cart::where('user_id', auth()->id())->delete();

            session()->forget('checkout');

            DB::commit();

            return redirect()->route('user.orders.index')
                ->with('success', 'Order placed successfully');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Something went wrong');
        }
    }
    public function success()
    {
        return view('user.order_success');
    }

    public function address()
    {
        return view('user.checkout.address');
    }

    // public function storeAddress(Request $request)
    // {
    //     $request->validate([
    //         'delivery_name' => 'required|string',
    //         'delivery_phone' => 'required|string',
    //         'delivery_address' => 'required|string',
    //         'delivery_city' => 'required|string',
    //         'delivery_pincode' => 'required|string',
    //     ]);

    //     session([
    //         'checkout.address' => [
    //             'delivery_name' => $request->delivery_name,
    //             'delivery_phone' => $request->delivery_phone,
    //             'delivery_address' => $request->delivery_address,
    //             'delivery_city' => $request->delivery_city,
    //             'delivery_pincode' => $request->delivery_pincode,
    //         ]
    //     ]);

    //     return redirect()->route('checkout.payment');
    // }


    public function payment()
    {
        if (!session()->has('checkout.address_id')) {
            return redirect()->route('checkout.address')
                ->with('error', 'Please select a delivery address.');
        }

        $address = UserAddress::where('id', session('checkout.address_id'))
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return view('user.checkout.payment', compact('address'));
    }
    public function storePayment(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|in:cod,online'
        ]);

        session(['checkout.payment_method' => $request->payment_method]);

        return redirect()->route('checkout.summary');
    }


    public function summary()
    {
        if (!session()->has('checkout.address_id') || !session()->has('checkout.payment_method')) {
            return redirect()->route('checkout.address');
        }

        $address = UserAddress::where('id', session('checkout.address_id'))
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $cartItems = Cart::with('food')
            ->where('user_id', auth()->id())
            ->get();

        $total = 0;
        foreach ($cartItems as $item) {
            $total += $item->food->price * $item->quantity;
        }

        $paymentMethod = session('checkout.payment_method');

        return view('user.checkout.summary', compact(
            'address',
            'cartItems',
            'total',
            'paymentMethod'
        ));
    }



}
