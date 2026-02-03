@extends('admin.layout')

@section('content')

<h3 class="mb-4">Add Food Item</h3>

<div class="card">
    <div class="card-body">

        <form method="POST"
              action="{{ route('admin.foods.store') }}"
              enctype="multipart/form-data">
            @csrf

            <div class="mb-3">
                <label>Category</label>
                <select name="category_id" class="form-control" required>
                    <option value="">Select Category</option>
                    @foreach($categories as $cat)
                        <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                    @endforeach
                </select>
            </div>

            <div class="mb-3">
                <label>Food Name</label>
                <input type="text" name="name" class="form-control" required>
            </div>

            <div class="mb-3">
                <label>Description</label>
                <textarea name="description" class="form-control"></textarea>
            </div>

            <div class="mb-3">
                <label>Price</label>
                <input type="number" name="price" class="form-control" required>
            </div>

            <div class="mb-3">
                <label>Type</label>
                <select name="type" class="form-control" required>
                    <option value="">Select</option>
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                </select>
            </div>

            <div class="mb-3">
                <label>Food Image</label>
                <input type="file" name="image" class="form-control">
            </div>

            <button class="btn btn-primary">Add Food</button>
            <a href="{{ route('admin.foods.index') }}" class="btn btn-secondary">
                Back
            </a>
        </form>

    </div>
</div>

@endsection
