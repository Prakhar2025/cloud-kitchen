<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rating;

class RatingController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'order_id' => 'required|exists:orders,id',
        'food_item_id' => 'required|exists:food_items,id',
        'rating' => 'required|integer|min:1|max:5',
        'review' => 'nullable|string'
    ]);

    Rating::create([
        'user_id' => auth()->id(),
        'order_id' => $request->order_id,
        'food_item_id' => $request->food_item_id,
        'rating' => $request->rating,
        'review' => $request->review
    ]);

    return back()->with('success', 'Thank you for your feedback!');
}

}
