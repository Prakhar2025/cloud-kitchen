@extends('user.layout')

@section('content')

<h3 class="mb-4">{{ $categories[0]->name }}</h3>

<div class="row">

@foreach($categories[0]->foodItems as $food)

@php
    $qty = $cartItems[$food->id]->quantity ?? 0;
@endphp

<div class="col-md-3 mb-4">
    <div class="card h-100 shadow-sm">

        @if($food->image)
            <img src="{{ asset('uploads/foods/'.$food->image) }}"
                 class="card-img-top"
                 style="height:180px;object-fit:cover">
        @endif

        <div class="card-body">
            <h6>{{ $food->name }}</h6>
            <p class="small text-muted">{{ $food->description }}</p>

            <p class="fw-bold">₹ {{ $food->price }}</p>

            <span class="badge {{ $food->type == 'veg' ? 'bg-success' : 'bg-danger' }}">
                {{ ucfirst($food->type) }}
            </span>

            <div class="mt-2">
                <a href="{{ route('cart.add', $food->id) }}"
                   class="btn btn-sm btn-outline-success">
                   Add
                </a>
            </div>
        </div>

    </div>
</div>

@endforeach

</div>

@endsection
