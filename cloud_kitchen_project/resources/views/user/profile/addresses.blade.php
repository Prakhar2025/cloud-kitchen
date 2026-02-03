@extends('user.layout')

@section('content')

<h3 class="mb-4">Saved Delivery Addresses</h3>

@if($addresses->count())

    @foreach($addresses as $address)
        <div class="card mb-3">
            <div class="card-body">

                {{-- TOP ROW: NAME + EDIT BUTTON --}}
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <p class="fw-bold mb-0">
                        {{ $address->name }}
                    </p>

                    <a href="{{ route('user.addresses.edit', $address->id) }}"
                       class="btn btn-sm btn-outline-primary">
                        Edit
                    </a>
                </div>

                <p class="mb-1">📞 {{ $address->phone }}</p>

                <p class="mb-0">
                    📍 {{ $address->address }},
                    {{ $address->city }} - {{ $address->pincode }}
                </p>

            </div>
        </div>
    @endforeach

@else
    <p>No delivery addresses saved yet.</p>
@endif

@endsection
