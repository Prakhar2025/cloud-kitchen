@foreach($categories as $category)

    @if($category->foodItems->count() > 0)

        <h5 class="mb-3 border-bottom pb-1">
            {{ $category->name }}
        </h5>

        <div class="row mb-4">

            @foreach($category->foodItems as $food)

                @php
                    $qty = $cartItems[$food->id]->quantity ?? 0;
                @endphp

                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">

                        @if($food->image)
                            <img src="{{ asset('uploads/foods/'.$food->image) }}"
                                 class="card-img-top"
                                 style="height:200px;object-fit:cover">
                        @endif

                        <div class="card-body d-flex flex-column">
                            <h5>{{ $food->name }}</h5>

                            <p class="text-muted small">
                                {{ $food->description }}
                            </p>

                            <div class="mt-auto">

                                <p class="fw-bold mb-1">
                                    ₹ {{ $food->price }}
                                </p>

                                <span class="badge {{ $food->type == 'veg' ? 'bg-success' : 'bg-danger' }}">
                                    {{ ucfirst($food->type) }}
                                </span>

                                <div class="mt-3 text-center">
                                    <div class="btn-group">
                                        <a href="{{ route('cart.decrease', $food->id) }}"
                                           class="btn btn-sm btn-outline-danger">➖</a>

                                        <span class="btn btn-sm btn-light">
                                            {{ $qty }}
                                        </span>

                                        <a href="{{ route('cart.add', $food->id) }}"
                                           class="btn btn-sm btn-outline-success">➕</a>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            @endforeach

        </div>

    @endif

@endforeach

@if($categories->flatMap->foodItems->count() == 0)
    <p class="text-muted">No food items found.</p>
@endif
