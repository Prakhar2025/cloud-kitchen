@extends('user.layout')

@section('content')

<h3 class="mb-4">My Orders</h3>

@if($orders->count() > 0)

    @foreach($orders as $order)
        <div class="card mb-4">

            {{-- CARD HEADER --}}
            <div class="card-header d-flex justify-content-between align-items-center">
                <div>
                    <strong>Order #{{ $order->id }}</strong><br>
                    <small class="text-muted">
                        {{ $order->created_at->format('d M Y, h:i A') }}
                    </small>
                </div>

                <div class="d-flex gap-2 align-items-center">

                    {{-- ORDER STATUS --}}
                    <span class="badge 
                        @if($order->status == 'pending') bg-warning
                        @elseif($order->status == 'accepted') bg-primary
                        @elseif($order->status == 'preparing') bg-info
                        @elseif($order->status == 'delivered') bg-success
                        @elseif($order->status == 'cancelled') bg-danger
                        @else bg-secondary
                        @endif">
                        {{ ucfirst($order->status) }}
                    </span>

                    {{-- CANCEL BUTTON --}}
                    @if($order->status === 'pending')
                        <form method="POST"
                              action="{{ route('user.order.cancel', $order->id) }}"
                              onsubmit="return confirm('Are you sure you want to cancel this order?')">
                            @csrf
                            <button class="btn btn-sm btn-danger">
                                Cancel
                            </button>
                        </form>
                    @endif

                </div>
            </div>

            {{-- CARD BODY --}}
            <div class="card-body">

                <p class="mb-1">
                    <strong>Total Amount:</strong> ₹ {{ $order->total_amount }}
                </p>

                <p class="mb-1">
                    <strong>Payment Method:</strong>
                    {{ strtoupper($order->payment_method) }}
                </p>

                <p class="mb-3">
                    <strong>Payment Status:</strong>
                    <span class="badge {{ $order->payment_status == 'paid' ? 'bg-success' : 'bg-warning' }}">
                        {{ ucfirst($order->payment_status) }}
                    </span>
                </p>

                {{-- ORDER ITEMS --}}
                <h6>Order Items:</h6>
                <ul class="mb-3">
                    @foreach($order->items as $item)
                        <li>
                            {{ $item->food_name }}
                            — Qty: {{ $item->quantity }}
                            — ₹ {{ $item->price }}
                        </li>
                    @endforeach
                </ul>

                {{-- ACTION BUTTONS --}}
                <div class="d-flex gap-2 flex-wrap">

                    <a href="{{ route('user.order.invoice', $order->id) }}"
                       class="btn btn-sm btn-outline-primary">
                        View Invoice
                    </a>

                    {{-- RATE ORDER (ONLY AFTER DELIVERY) --}}
                    @if($order->status === 'delivered')

                        @if(!$order->rating)
                            <button class="btn btn-sm btn-warning"
                                    data-bs-toggle="modal"
                                    data-bs-target="#rateOrderModal{{ $order->id }}">
                                ⭐ Rate Order
                            </button>
                        @else
                            <span class="badge bg-success">
                                Rated: {{ $order->rating->stars }} ⭐
                            </span>
                        @endif

                    @endif

                </div>

            </div>
        </div>

        {{-- ================= RATE ORDER MODAL ================= --}}
        @if($order->status === 'delivered' && !$order->rating)
        <div class="modal fade" id="rateOrderModal{{ $order->id }}" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">

                    <form method="POST" action="{{ route('user.order.rate', $order->id) }}">
                        @csrf

                        <div class="modal-header">
                            <h5 class="modal-title">Rate Order #{{ $order->id }}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div class="modal-body">

                            {{-- STAR RATING --}}
                            <label class="form-label">Rating</label>
                            <select name="stars" class="form-select mb-3" required>
                                <option value="">Select Rating</option>
                                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                                <option value="4">⭐⭐⭐⭐ Good</option>
                                <option value="3">⭐⭐⭐ Average</option>
                                <option value="2">⭐⭐ Poor</option>
                                <option value="1">⭐ Very Bad</option>
                            </select>

                            {{-- REVIEW --}}
                            <label class="form-label">Review (optional)</label>
                            <textarea name="review"
                                      class="form-control"
                                      rows="3"
                                      placeholder="Write your experience..."></textarea>

                        </div>

                        <div class="modal-footer">
                            <button class="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                            <button class="btn btn-success">
                                Submit Rating
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </div>
        @endif

    @endforeach

@else
    <p>You have not placed any orders yet.</p>
    <a href="{{ route('menu') }}" class="btn btn-primary">
        Order Now
    </a>
@endif

@endsection
