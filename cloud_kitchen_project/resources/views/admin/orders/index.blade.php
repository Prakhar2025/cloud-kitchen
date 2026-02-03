@extends('admin.layout')

@section('content')

<style>
/* ================= MOBILE RESPONSIVE (NO HORIZONTAL SCROLL) ================= */
@media (max-width: 768px) {

    html, body {
        overflow-x: hidden !important;
        width: 100%;
    }

    .container,
    .container-fluid,
    .row,
    [class*="col-"] {
        max-width: 100% !important;
        overflow-x: hidden !important;
    }

    table {
        width: 100% !important;
        table-layout: fixed;
        border: 0;
    }

    table thead {
        display: none;
    }

    table tr {
        display: block;
        margin-bottom: 16px;
        background: #fff;
        border: 1px solid #dee2e6;
        border-radius: 10px;
        padding: 12px;
    }

    table td {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border: none;
        padding: 6px 0;
        font-size: 14px;
        word-break: break-word;
    }

    table td::before {
        content: attr(data-label);
        font-weight: 600;
        color: #495057;
        margin-right: 10px;
        white-space: nowrap;
    }

    table td:last-child {
        justify-content: flex-end;
    }

    ul {
        padding-left: 18px;
    }

    select {
        width: 100%;
    }
}
</style>

<h3 class="mb-4">Orders</h3>

@if($orders->count())

<div class="card">
    <div class="card-body p-0">

        <table class="table table-bordered mb-0">
            <thead class="table-light">
                <tr>
                    <th>Sr.No.</th>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Delivery Address</th>
                    <th>Total Amount</th>
                    <th>Payment</th>
                    <th>Order Status</th>
                </tr>
            </thead>

            <tbody>
                @foreach($orders as $order)

                {{-- MAIN ORDER ROW --}}
                <tr>
                    <td data-label="Sr.No.">{{ $loop->iteration }}</td>

                    <td data-label="Order ID">#{{ $order->id }}</td>

                    <td data-label="User">
                        {{ $order->user->name }}<br>
                        <small class="text-muted">{{ $order->user->email }}</small>
                    </td>

                    <td data-label="Delivery Address">
                        @if($order->address)
                            <strong>{{ $order->address->name }}</strong><br>
                            {{ $order->address->phone }}<br>
                            <small>
                                {{ $order->address->address }},
                                {{ $order->address->city }} - {{ $order->address->pincode }}
                            </small>

                            @if($order->address->latitude && $order->address->longitude)
                                <div class="mt-1">
                                    <a target="_blank"
                                       href="https://www.google.com/maps?q={{ $order->address->latitude }},{{ $order->address->longitude }}"
                                       class="text-primary">
                                        📍 View Location
                                    </a>
                                </div>
                            @endif
                        @else
                            <span class="text-muted">Address not available</span>
                        @endif
                    </td>

                    <td data-label="Total Amount">₹ {{ $order->total_amount }}</td>

                    <td data-label="Payment">
                        <span class="badge bg-info">
                            {{ strtoupper($order->payment_method) }}
                        </span><br>

                        <span class="badge {{ $order->payment_status === 'paid' ? 'bg-success' : 'bg-warning' }}">
                            {{ ucfirst($order->payment_status) }}
                        </span>
                    </td>

                    <td data-label="Order Status">
                        @if($order->status === 'cancelled')
                            <span class="badge bg-danger">Cancelled</span>
                        @else
                            <form method="POST"
                                  action="{{ route('admin.orders.updateStatus', $order->id) }}">
                                @csrf
                                <select name="status"
                                        class="form-select form-select-sm"
                                        onchange="this.form.submit()">
                                    <option value="pending" {{ $order->status === 'pending' ? 'selected' : '' }}>Pending</option>
                                    <option value="accepted" {{ $order->status === 'accepted' ? 'selected' : '' }}>Accepted</option>
                                    <option value="preparing" {{ $order->status === 'preparing' ? 'selected' : '' }}>Preparing</option>
                                    <option value="out_for_delivery" {{ $order->status === 'out_for_delivery' ? 'selected' : '' }}>Out for Delivery</option>
                                    <option value="delivered" {{ $order->status === 'delivered' ? 'selected' : '' }}>Delivered</option>
                                </select>
                            </form>
                        @endif
                    </td>
                </tr>

                {{-- ORDER ITEMS --}}
                <tr>
                    <td colspan="7" data-label="Order Items">
                        <strong>Order Items:</strong>
                        <ul class="mb-2">
                            @foreach($order->items as $item)
                                <li>
                                    {{ $item->food_name }}
                                    — Qty: {{ $item->quantity }}
                                    — ₹ {{ $item->price }}
                                </li>
                            @endforeach
                        </ul>

                        {{-- ⭐ RATINGS & REVIEWS --}}
                        @if($order->ratings->count())
                            <div class="mt-3">
                                <strong class="text-primary">Ratings & Reviews:</strong>

                                @foreach($order->ratings as $rating)
                                    <div class="border rounded p-2 mt-2">
                                        <strong>{{ $rating->food->name ?? 'Food Item' }}</strong><br>

                                        <span class="text-warning">
                                            @for($i=1; $i<=5; $i++)
                                                {{ $i <= $rating->rating ? '★' : '☆' }}
                                            @endfor
                                        </span>

                                        <small class="text-muted">
                                            by {{ $rating->user->name }}
                                        </small>

                                        @if($rating->review)
                                            <p class="mb-0 mt-1">
                                                "{{ $rating->review }}"
                                            </p>
                                        @endif
                                    </div>
                                @endforeach
                            </div>
                        @else
                            <small class="text-muted d-block mt-2">
                                No rating given by user.
                            </small>
                        @endif
                    </td>
                </tr>

                @endforeach
            </tbody>
        </table>

    </div>
</div>

@else
    <p>No orders found.</p>
@endif

@endsection
