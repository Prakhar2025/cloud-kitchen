@extends('user.layout')

@section('content')

<h3 class="mb-4">Your Cart</h3>

@if($cartItems->count() > 0)

    @php $total = 0; @endphp

    <div class="card mb-4">
        <div class="card-body p-0">

            {{-- ✅ RESPONSIVE TABLE WRAPPER --}}
            <div class="table-responsive">

                <table class="table table-bordered mb-0 align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Sr.No.</th>
                            <th>Food</th>

                            {{-- hide on mobile --}}
                            <th class="d-none d-md-table-cell">Price</th>

                            <th>Qty</th>

                            {{-- hide on mobile --}}
                            <th class="d-none d-md-table-cell">Subtotal</th>

                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        @foreach($cartItems as $item)
                            @php
                                $subtotal = $item->food->price * $item->quantity;
                                $total += $subtotal;
                            @endphp

                            <tr>
                                <td>{{ $loop->iteration }}</td>

                                <td>
                                    <strong>{{ $item->food->name }}</strong>

                                    {{-- show price + subtotal only on mobile --}}
                                    <div class="d-md-none small text-muted">
                                        ₹ {{ $item->food->price }} × {{ $item->quantity }}
                                        = ₹ {{ $subtotal }}
                                    </div>
                                </td>

                                {{-- DESKTOP ONLY --}}
                                <td class="d-none d-md-table-cell">
                                    ₹ {{ $item->food->price }}
                                </td>

                                <td>
                                    {{ $item->quantity }}
                                </td>

                                {{-- DESKTOP ONLY --}}
                                <td class="d-none d-md-table-cell">
                                    ₹ {{ $subtotal }}
                                </td>

                                <td>
                                    <button class="btn btn-sm btn-danger"
                                        onclick="event.preventDefault();
                                        if(confirm('Remove this item?')){
                                            document.getElementById('remove-{{ $item->id }}').submit();
                                        }">
                                        Remove
                                    </button>

                                    <form id="remove-{{ $item->id }}"
                                          method="POST"
                                          action="{{ route('cart.remove', $item->id) }}"
                                          class="d-none">
                                        @csrf
                                        @method('DELETE')
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

            </div>
        </div>
    </div>

    {{-- CART SUMMARY --}}
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <h5 class="mb-0">Total: ₹ {{ $total }}</h5>

        <a href="{{ route('checkout.address') }}" class="btn btn-success btn-lg">
            Buy Now →
        </a>
    </div>

@else
    <div class="alert alert-info">
        Your cart is empty.
    </div>

    <a href="{{ route('menu') }}" class="btn btn-primary">
        Go to Menu
    </a>
@endif

@endsection
