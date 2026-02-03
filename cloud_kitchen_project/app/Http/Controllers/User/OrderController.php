<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Order;
use App\Models\Rating;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $orders = Order::with('items')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return view('user.orders.index', compact('orders'));
    }

    public function cancel($id)
{
    $order = Order::where('id', $id)
        ->where('user_id', auth()->id())
        ->where('status', 'pending')
        ->firstOrFail();

    $order->update([
        'status' => 'cancelled'
    ]);

    return redirect()->back()
        ->with('success', 'Order cancelled successfully.');
}

public function invoice($id)
{
    $order = Order::with('items')
        ->where('id', $id)
        ->where('user_id', auth()->id())
        ->firstOrFail();

    return view('user.orders.invoice', compact('order'));
}

public function downloadInvoice($id)
{
    $order = Order::with('items')
        ->where('id', $id)
        ->where('user_id', auth()->id())
        ->firstOrFail();

    $pdf = Pdf::loadView('user.orders.invoice_pdf', compact('order'));

    return $pdf->download('invoice-order-' . $order->id . '.pdf');
}



public function rate(Request $request, Order $order)
{
    if ($order->user_id !== auth()->id()) {
        abort(403);
    }

    if ($order->status !== 'delivered') {
        return back()->with('error', 'Order not delivered yet.');
    }

    $request->validate([
        'stars' => 'required|integer|min:1|max:5',
        'review' => 'nullable|string|max:500',
    ]);

    // ✅ Get food_id correctly
    $foodItemId = $order->items()->value('food_item_id');

    if (!$foodItemId) {
        return back()->with('error', 'Unable to rate. Food item missing.');
    }

    // ✅ CHECK IF ALREADY RATED (IMPORTANT)
    $alreadyRated = Rating::where('user_id', auth()->id())
        ->where('order_id', $order->id)
        ->where('food_item_id', $foodItemId)
        ->exists();

    if ($alreadyRated) {
        return back()->with('error', 'You have already rated this order.');
    }

    // ✅ SAFE TO INSERT
    Rating::create([
        'order_id' => $order->id,
        'user_id' => auth()->id(),
        'food_item_id' => $foodItemId,
        'rating' => $request->stars,
        'review' => $request->review,
    ]);

    return back()->with('success', 'Thanks for rating!');
}





}
