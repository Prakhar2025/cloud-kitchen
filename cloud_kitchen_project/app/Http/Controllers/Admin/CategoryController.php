<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::latest()->get();
        return view('admin.categories.index', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imageName = null;

        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('uploads/categories'), $imageName);
        }

        Category::create([
            'name'   => $request->name,
            'image'  => $imageName,
            'status' => 1,
        ]);

        return redirect()->back()->with('success', 'Category added successfully');
    }

    public function edit($id)
    {
        $category = Category::findOrFail($id);
        $categories = Category::latest()->get();
        return view('admin.categories.index', compact('category', 'categories'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $category = Category::findOrFail($id);

        // If new image uploaded
        if ($request->hasFile('image')) {

            // delete old image if exists
            if ($category->image && file_exists(public_path('uploads/categories/' . $category->image))) {
                unlink(public_path('uploads/categories/' . $category->image));
            }

            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('uploads/categories'), $imageName);

            $category->image = $imageName;
        }

        $category->name = $request->name;
        $category->save();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully');
    }

    public function destroy($id)
    {
        Category::findOrFail($id)->delete();

        return redirect()->back()
            ->with('success', 'Category deleted successfully');
    }

    public function toggleStatus($id)
    {
        $category = Category::findOrFail($id);
        $category->status = !$category->status;
        $category->save();

        return redirect()->back()
            ->with('success', 'Category status updated');
    }
}
