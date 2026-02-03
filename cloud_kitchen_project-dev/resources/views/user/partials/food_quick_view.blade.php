<div class="row g-0">

    {{-- LEFT IMAGE --}}
    <div class="col-md-6">
        <img src="{{ asset('uploads/foods/'.$food->image) }}"
             class="img-fluid w-100"
             style="height:100%;object-fit:cover">
    </div>

    {{-- RIGHT DETAILS --}}
    <div class="col-md-6 p-4">

        <h3 class="mb-1">{{ $food->name }}</h3>

        <span class="badge {{ $food->type == 'veg' ? 'bg-success' : 'bg-danger' }}">
            {{ ucfirst($food->type) }}
        </span>

        {{-- ⭐ RATING SUMMARY --}}
        <div class="mt-2">
            @if($totalRatings > 0)
                <span class="fw-semibold text-warning">
                    ⭐ {{ number_format($avgRating, 1) }}/5
                </span>
                <small class="text-muted">
                    ({{ $totalRatings }} reviews)
                </small>
            @else
                <small class="text-muted">No ratings yet</small>
            @endif
        </div>

        <p class="mt-3 text-muted">
            {{ $food->description }}
        </p>

        <h4 class="fw-bold">₹ {{ $food->price }}</h4>

        {{-- CART --}}
        <div class="mt-3">
            <div class="btn-group">
                <a href="{{ route('cart.decrease', $food->id) }}"
                   class="btn btn-outline-danger">➖</a>

                <span class="btn btn-light">{{ $qty }}</span>

                <a href="{{ route('cart.add', $food->id) }}"
                   class="btn btn-outline-success">➕</a>
            </div>
        </div>

        {{-- USER REVIEWS --}}
        @if($food->ratings->count())
            <hr>
            <h6 class="mb-3">Customer Reviews</h6>

            <div style="max-height:180px;overflow-y:auto">
                @foreach($food->ratings as $rating)
                    <div class="mb-3 border-bottom pb-2">
                        <strong>{{ $rating->user->name }}</strong><br>

                        <span class="text-warning">
                            @for($i = 1; $i <= 5; $i++)
                                {{ $i <= $rating->rating ? '★' : '☆' }}
                            @endfor
                        </span>

                        @if($rating->review)
                            <p class="mb-0 small text-muted">
                                {{ $rating->review }}
                            </p>
                        @endif
                    </div>
                @endforeach
            </div>
        @endif

        {{-- RELATED FOODS --}}
        @if($relatedFoods->count())
            <hr>
            <h5 class="mb-3">You might also like</h5>

            <div class="row">
                @foreach($relatedFoods as $item)
                    <div class="col-md-4 mb-3">
                        <div class="card h-100 shadow-sm"
                             onclick="openFoodModal({{ $item->id }})"
                             style="cursor:pointer">

                            <img src="{{ asset('uploads/foods/'.$item->image) }}"
                                 class="card-img-top"
                                 style="height:120px;object-fit:cover">

                            <div class="card-body p-2 text-center">
                                <small class="fw-semibold">{{ $item->name }}</small>
                                <div>₹ {{ $item->price }}</div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        @endif

    </div>
</div>
