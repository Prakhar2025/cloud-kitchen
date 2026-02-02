@extends('admin.layout')

@section('content')

<h3 class="mb-4">Edit Food Item</h3>

<div class="card">
    <div class="card-body">

        <form method="POST"
              action="{{ route('admin.foods.update', $food->id) }}"
              enctype="multipart/form-data">
            @csrf

            <div class="mb-3">
                <label>Category</label>
                <select name="category_id" class="form-control">
                    @foreach($categories as $cat)
                        <option value="{{ $cat->id }}"
                            {{ $food->category_id == $cat->id ? 'selected' : '' }}>
                            {{ $cat->name }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div class="mb-3">
                <label>Food Name</label>
                <input type="text"
                       name="name"
                       value="{{ $food->name }}"
                       class="form-control">
            </div>

            <div class="mb-3">
                <label>Description</label>
                <textarea name="description"
                          class="form-control">{{ $food->description }}</textarea>
            </div>

            <div class="mb-3">
                <label>Price</label>
                <input type="number"
                       name="price"
                       value="{{ $food->price }}"
                       class="form-control">
            </div>

            <div class="mb-3">
                <label>Type</label>
                <select name="type" class="form-control">
                    <option value="veg" {{ $food->type == 'veg' ? 'selected' : '' }}>
                        Veg
                    </option>
                    <option value="non-veg" {{ $food->type == 'non-veg' ? 'selected' : '' }}>
                        Non-Veg
                    </option>
                </select>
            </div>

            <div class="mb-3">
                <label>Food Image</label>
                <input type="file" name="image" class="form-control">
            </div>

            <button class="btn btn-primary">Update</button>
            <a href="{{ route('admin.foods.index') }}" class="btn btn-secondary">
                Back
            </a>
        </form>

    </div>
</div>

@endsection
