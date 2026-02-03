<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FoodItem;
use App\Models\Category;

class FoodItemController extends Controller
{
    public function index()
    {
        $foods = FoodItem::with('category')->latest()->get();
        return view('admin.foods.index', compact('foods'));
    }

    public function create()
    {
        $categories = Category::where('status', 1)->get();
        return view('admin.foods.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'type' => 'required|in:veg,non-veg',
            'image' => 'nullable|image|mimes:jpg,jpeg,png',
        ]);

        $imageName = null;

        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('uploads/foods'), $imageName);
        }

        FoodItem::create([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'type' => $request->type,
            'image' => $imageName,
            'is_available' => 1,
        ]);

        return redirect()->route('admin.foods.index')
            ->with('success', 'Food item added successfully');
    }

    public function edit($id)
    {
        $food = FoodItem::findOrFail($id);
        $categories = Category::where('status', 1)->get();
        return view('admin.foods.edit', compact('food', 'categories'));
    }

    public function update(Request $request, $id)
    {
        $food = FoodItem::findOrFail($id);

        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'type' => 'required|in:veg,non-veg',
            'image' => 'nullable|image|mimes:jpg,jpeg,png',
        ]);

        $imageName = $food->image;

        if ($request->hasFile('image')) {
            if ($food->image && file_exists(public_path('uploads/foods/' . $food->image))) {
                unlink(public_path('uploads/foods/' . $food->image));
            }

            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('uploads/foods'), $imageName);
        }

        $food->update([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'type' => $request->type,
            'image' => $imageName,
        ]);

        return redirect()->route('admin.foods.index')
            ->with('success', 'Food updated successfully');
    }

    public function destroy($id)
    {
        $food = FoodItem::findOrFail($id);

        if ($food->image && file_exists(public_path('uploads/foods/' . $food->image))) {
            unlink(public_path('uploads/foods/' . $food->image));
        }

        $food->delete();

        return redirect()->back()
            ->with('success', 'Food deleted successfully');
    }

    public function toggleStatus($id)
    {
        $food = FoodItem::findOrFail($id);
        $food->is_available = !$food->is_available;
        $food->save();

        return redirect()->back()
            ->with('success', 'Food availability updated');
    }

}
