<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Cart;
use App\Models\FestivalBanner;
use Carbon\Carbon;
use App\Models\FoodItem;
class MenuController extends Controller
{
    public function index()
    {
        $type = request('type');   // veg | non-veg | null
        $search = request('search'); // search text | null
        $festivalBanners = FestivalBanner::where('is_active', 1)
            ->latest()
            ->get();

        $categories = Category::where('status', 1)
            ->with([
                'foodItems' => function ($query) use ($type, $search) {

                    $query->where('is_available', 1)
                        ->withAvg('ratings', 'rating')
                        ->withCount('ratings');

                    if ($type) {
                        $query->where('type', $type);
                    }

                    if ($search) {
                        $query->where(function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                                ->orWhere('description', 'like', "%{$search}%");
                        });
                    }
                }

            ])
            ->get();

        $cartItems = auth()->check()
            ? Cart::where('user_id', auth()->id())->get()->keyBy('food_item_id')
            : collect();

        $cartCount = auth()->check()
            ? Cart::where('user_id', auth()->id())->sum('quantity')
            : 0;

        return view('user.menu', compact('categories', 'cartItems', 'festivalBanners', 'cartCount'));
    }

    public function category(Category $category)
    {
        $type = request('type');

        $category->load([
            'foodItems' => function ($query) use ($type) {

                $query->where('is_available', 1);

                if ($type) {
                    $query->where('type', $type);
                }
            }
        ]);

        // show only selected category
        $categories = collect([$category]);

        $cartItems = auth()->check()
            ? Cart::where('user_id', auth()->id())->get()->keyBy('food_item_id')
            : collect();

        return view('user.menu', compact('categories', 'cartItems'));
    }

    public function ajaxCategory(Category $category)
    {
        $type = request('type'); // veg | non-veg | null

        $category->load([
            'foodItems' => function ($query) use ($type) {
                $query->where('is_available', 1);

                if ($type) {
                    $query->where('type', $type);
                }
            }
        ]);

        $categories = collect([$category]);

        $cartItems = auth()->check()
            ? Cart::where('user_id', auth()->id())->get()->keyBy('food_item_id')
            : collect();

        return view('user.partials.menu_results', compact('categories', 'cartItems'));
    }



   public function foodQuickView(FoodItem $food)
{
    // Load ratings with user info
    $food->load([
        'ratings.user'
    ]);

    // Rating summary
    $avgRating = $food->ratings()->avg('rating');
    $totalRatings = $food->ratings()->count();

    // Related foods
    $relatedFoods = FoodItem::where('category_id', $food->category_id)
        ->where('id', '!=', $food->id)
        ->where('is_available', 1)
        ->limit(6)
        ->get();

    // Cart quantity
    $qty = auth()->check()
        ? Cart::where('user_id', auth()->id())
            ->where('food_item_id', $food->id)
            ->value('quantity')
        : 0;

    return view('user.partials.food_quick_view', compact(
        'food',
        'relatedFoods',
        'qty',
        'avgRating',
        'totalRatings'
    ));
}


}
