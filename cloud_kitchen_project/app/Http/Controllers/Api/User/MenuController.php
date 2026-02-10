<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\FestivalBanner;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        $type = request('type');   // veg | non-veg | null
        $search = request('search'); // search text | null
        
        $banners = FestivalBanner::where('is_active', 1)
            ->where(function($q) {
                $q->whereNull('start_date')->orWhere('start_date', '<=', now());
            })
            ->where(function($q) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', now());
            })
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

        return response()->json([
            'success' => true,
            'data' => [
                'banners' => $banners,      // Festival banners for carousel
                'categories' => $categories  // Food categories with items
            ]
        ]);
    }
}
