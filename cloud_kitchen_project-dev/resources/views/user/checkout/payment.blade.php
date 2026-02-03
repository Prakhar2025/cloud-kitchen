@extends('user.layout')

@section('content')

<div class="container">

    <h3 class="mb-4">Payment Method</h3>

    <form method="POST" action="{{ route('checkout.payment.store') }}">
        @csrf
        <div class="card mb-4">
    <div class="card-body">
        <h6>Deliver To</h6>
        <p class="mb-0">
            {{ $address->name }} ({{ $address->phone }})<br>
            {{ $address->address }}, {{ $address->city }} - {{ $address->pincode }}
        </p>
    </div>
</div>


        <div class="card">
            <div class="card-body">

                <div class="form-check mb-3">
                    <input class="form-check-input"
                           type="radio"
                           name="payment_method"
                           value="cod"
                           id="cod"
                           checked>
                    <label class="form-check-label" for="cod">
                        Cash on Delivery
                    </label>
                </div>

                <div class="form-check mb-3">
                    <input class="form-check-input"
                           type="radio"
                           name="payment_method"
                           value="online"
                           id="online">
                    <label class="form-check-label" for="online">
                        Online Payment (Coming Soon)
                    </label>
                </div>

                <div class="alert alert-info">
                    💡 Online payment will be enabled in the next version.
                </div>

                <div class="text-end">
                    <button type="submit" class="btn btn-primary">
                        Continue to Summary →
                    </button>
                </div>

            </div>
        </div>

    </form>

</div>

@endsection
