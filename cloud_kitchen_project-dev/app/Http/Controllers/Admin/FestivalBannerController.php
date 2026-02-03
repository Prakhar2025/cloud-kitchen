<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FestivalBanner;
use App\Models\FoodItem;
class FestivalBannerController extends Controller
{
    public function index()
    {
        $banners = FestivalBanner::latest()->get();
        $foodItems = FoodItem::where('is_available',1)->get();
        return view('admin.festival_banners.index', compact('banners','foodItems'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'image' => 'required|image|mimes:jpg,png,jpeg,webp|max:2048'

        ]);

        $imageName = time() . '.' . $request->image->extension();
        $request->image->move(public_path('uploads/banners'), $imageName);

        FestivalBanner::create([
            'title' => $request->title,
            'image' => $imageName,
            'food_item_id' => $request->food_item_id,
            'is_active' => 1,
        ]);

        return back()->with('success', 'Banner added');
    }

    public function edit($id)
    {
        $banner = FestivalBanner::findOrFail($id);
        $banners = FestivalBanner::latest()->get();

        return view('admin.festival_banners.index', compact('banner', 'banners'));
    }

   public function update(Request $request, $id)
{
    $banner = FestivalBanner::findOrFail($id);

    $banner->title = $request->title;
    $banner->start_date = $request->start_date;
    $banner->end_date = $request->end_date;

    if ($request->hasFile('image')) {
        if ($banner->image && file_exists(public_path('uploads/banners/'.$banner->image))) {
            unlink(public_path('uploads/banners/'.$banner->image));
        }

        $imageName = time().'.'.$request->image->extension();
        $request->image->move(public_path('uploads/banners'), $imageName);
        $banner->image = $imageName;
    }

    $banner->save();

    return back()->with('success','Banner updated');
}

    public function destroy($id)
    {
        $banner = FestivalBanner::findOrFail($id);

        if ($banner->image && file_exists(public_path('uploads/banners/' . $banner->image))) {
            unlink(public_path('uploads/banners/' . $banner->image));
        }

        $banner->delete();

        return redirect()->back()->with('success', 'Banner deleted successfully');
    }

    public function toggleStatus($id)
    {
        $banner = FestivalBanner::findOrFail($id);
        $banner->is_active = !$banner->is_active;
        $banner->save();

        return redirect()->back()->with('success', 'Banner status updated');
    }


}
