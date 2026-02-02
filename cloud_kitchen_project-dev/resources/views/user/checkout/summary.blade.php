@extends('user.layout')

@section('content')

    <div class="container">

        <h3 class="mb-4">Order Summary</h3>

        <div class="card mb-4">
            <div class="card-body">

                <h5 class="mb-3">Delivery Details</h5>

                <!-- <h5>Delivery Details</h5> -->
                <p>
                    {{ $address->name }}<br>
                    {{ $address->phone }}<br>
                    {{ $address->address }}, {{ $address->city }} - {{ $address->pincode }}
                </p>

                <hr>

                <h5>Payment Method</h5>
                <p>{{ strtoupper($paymentMethod) }}</p>

                <hr>

                <h5>Order Items</h5>
                <ul>
                    @foreach($cartItems as $item)
                        <li>
                            {{ $item->food->name }} × {{ $item->quantity }}
                            — ₹ {{ $item->food->price * $item->quantity }}
                        </li>
                    @endforeach
                </ul>

                <hr>

                <h5>Total Amount</h5>
                <p class="fw-bold">₹ {{ $total }}</p>

                <div class="text-end">
                    <form method="POST" action="{{ route('order.place') }}">
                        @csrf

                        {{-- VERY IMPORTANT --}}
                        <input type="hidden" name="address_id" value="{{ $address->id }}">
                        <input type="hidden" name="payment_method" value="{{ $paymentMethod }}">

                        <button type="submit" class="btn btn-success">
                            Place Order
                        </button>
                    </form>

                </div>

            </div>
        </div>

    </div>

@endsection