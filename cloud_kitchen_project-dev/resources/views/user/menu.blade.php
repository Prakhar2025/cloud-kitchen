@extends('user.layout')

@section('content')

<style>
    html { scroll-behavior: smooth; }

    .category-marquee-wrapper {
        overflow: hidden;
        width: 100%;
    }

    .category-marquee {
        display: flex;
        gap: 30px;
        width: max-content;
        animation: marqueeScroll 30s linear infinite;
    }

    .category-marquee-wrapper:hover .category-marquee {
        animation-play-state: paused;
    }

    .category-item {
        min-width: 120px;
    }

    .category-img {
        width: 80px;
        height: 80px;
        overflow: hidden;
    }

    .category-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    @keyframes marqueeScroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
    }
</style>

{{-- ================= CATEGORY STRIP ================= --}}
<div class="d-flex overflow-auto gap-4 mb-4 pb-2">
    <div class="category-marquee-wrapper mb-4">
        <div class="category-marquee">

            @foreach($categories as $category)
                <a href="{{ route('menu.category', $category->id) }}"
                   class="category-item text-decoration-none text-center text-dark">
                    <div class="rounded-circle border mx-auto mb-2 category-img">
                        <img src="{{ $category->image
                            ? asset('uploads/categories/'.$category->image)
                            : asset('images/default-category.png') }}">
                    </div>
                    <div class="small fw-semibold">
                        {{ $category->name }}
                    </div>
                </a>
            @endforeach

            {{-- duplicate --}}
            @foreach($categories as $category)
                <a href="{{ route('menu.category', $category->id) }}"
                   class="category-item text-decoration-none text-center text-dark">
                    <div class="rounded-circle border mx-auto mb-2 category-img">
                        <img src="{{ $category->image
                            ? asset('uploads/categories/'.$category->image)
                            : asset('images/default-category.png') }}">
                    </div>
                    <div class="small fw-semibold">
                        {{ $category->name }}
                    </div>
                </a>
            @endforeach

        </div>
    </div>
</div>

{{-- ================= BANNERS ================= --}}
@if(isset($festivalBanners) && $festivalBanners->count())
<div id="festivalBannerCarousel" class="carousel slide mb-4" data-bs-ride="carousel">
    <div class="carousel-inner rounded shadow-sm">
        @foreach($festivalBanners as $key => $banner)
            <div class="carousel-item {{ $key === 0 ? 'active' : '' }}">
                @if($banner->food_item_id)
                    <a href="{{ route('menu') }}#food-{{ $banner->food_item_id }}">
                @endif

                <img src="{{ asset('uploads/banners/'.$banner->image) }}"
                     class="d-block w-100"
                     style="height:420px;object-fit:cover;cursor:pointer">

                @if($banner->food_item_id)
                    </a>
                @endif
            </div>
        @endforeach
    </div>
</div>
@endif

{{-- ================= FILTER ================= --}}
<div class="mb-4 d-flex gap-2">
    <a href="{{ route('menu') }}"
       class="btn btn-sm {{ request('type') == null ? 'btn-dark' : 'btn-outline-dark' }}">
        All
    </a>
    <a href="{{ route('menu', ['type'=>'veg']) }}"
       class="btn btn-sm {{ request('type')=='veg' ? 'btn-success':'btn-outline-success' }}">
        Veg
    </a>
    <a href="{{ route('menu', ['type'=>'non-veg']) }}"
       class="btn btn-sm {{ request('type')=='non-veg' ? 'btn-danger':'btn-outline-danger' }}">
        Non-Veg
    </a>
</div>

<h3 class="mb-4">Our Menu</h3>

{{-- ================= MENU ================= --}}
@foreach($categories as $category)
@if($category->foodItems->count() > 0)

<h5 class="mb-3 border-bottom pb-1">
    {{ $category->name }}
</h5>

<div class="row mb-4">

@foreach($category->foodItems as $food)

@php
    $qty = $cartItems[$food->id]->quantity ?? 0;
    $avg = round($food->ratings_avg_rating ?? 0);
@endphp

<div class="col-md-4 mb-4">
    <div class="card h-100 shadow-sm food-card"
         onclick="openFoodModal({{ $food->id }})"
         style="cursor:pointer">

        @if($food->image)
            <img src="{{ asset('uploads/foods/'.$food->image) }}"
                 class="card-img-top"
                 style="height:200px;object-fit:cover">
        @endif

        <div class="card-body d-flex flex-column">

            <h5 class="mb-1">{{ $food->name }}</h5>

            {{-- ⭐ RATING DISPLAY --}}
            @if($food->ratings_count > 0)
                <div class="mb-1">
                    @for($i=1; $i<=5; $i++)
                        <span class="{{ $i <= $avg ? 'text-warning' : 'text-secondary' }}">★</span>
                    @endfor
                    <small class="text-muted">
                        ({{ number_format($food->ratings_avg_rating,1) }} • {{ $food->ratings_count }} reviews)
                    </small>
                </div>
            @else
                <div class="mb-1 text-muted small">
                    No ratings yet
                </div>
            @endif

            <p class="text-muted small mb-2">
                {{ $food->description }}
            </p>

            <div class="mt-auto">
                <p class="fw-bold mb-1">₹ {{ $food->price }}</p>

                <span class="badge {{ $food->type == 'veg' ? 'bg-success' : 'bg-danger' }}">
                    {{ ucfirst($food->type) }}
                </span>

                <div class="mt-3 text-center">
                    <div class="btn-group">
                        <a onclick="event.stopPropagation()"
                           href="{{ route('cart.decrease', $food->id) }}"
                           class="btn btn-sm btn-outline-success">➖</a>

                        <span class="btn btn-sm btn-light">{{ $qty }}</span>

                        <a onclick="event.stopPropagation()"
                           href="{{ route('cart.add', $food->id) }}"
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

{{-- ================= QUICK VIEW MODAL ================= --}}
<div class="modal fade" id="foodModal" tabindex="-1">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-body p-0">
                <div id="foodModalContent"></div>
            </div>
        </div>
    </div>
</div>

@endsection

<script>
function openFoodModal(foodId) {
    fetch(`/food/${foodId}`)
        .then(res => res.text())
        .then(html => {
            document.getElementById('foodModalContent').innerHTML = html;
            new bootstrap.Modal(document.getElementById('foodModal')).show();
        });
}
</script>


