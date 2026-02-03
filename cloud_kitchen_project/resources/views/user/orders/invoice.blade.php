@extends('user.layout')

@section('content')
    <style>
        .status-badge {
            height: 28px;
            padding: 0 12px;
            font-size: 13px;
            display: inline-flex;
            align-items: center;
        }
    </style>


    <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>Order Invoice</h3>

        <div>
            <a href="{{ route('user.orders.index') }}" class="btn btn-sm btn-secondary">
                Back to Orders
            </a>

            <a href="{{ route('user.order.invoice.pdf', $order->id) }}" class="btn btn-sm btn-success">
                Download PDF
            </a>
        </div>
    </div>

    <div class="card">
        <div class="card-body">

            {{-- STATUS --}}
            <div class="d-flex justify-content-between mb-3">
                <div>
                    <strong>Order ID:</strong> #{{ $order->id }} <br>
                    <strong>Order Date:</strong>
                    {{ $order->created_at->format('d M Y, h:i A') }}
                </div>

                <span class="badge status-badge
        @if($order->status == 'pending') bg-warning
        @elseif($order->status == 'accepted') bg-primary
        @elseif($order->status == 'preparing') bg-info
        @elseif($order->status == 'delivered') bg-success
        @elseif($order->status == 'cancelled') bg-danger
        @else bg-secondary
        @endif">
                    {{ ucfirst($order->status) }}
                </span>


            </div>

            <hr>

            {{-- PAYMENT --}}
            <div class="row mb-3">
                <div class="col-md-6">
                    <strong>Payment Method:</strong>
                    {{ strtoupper($order->payment_method) }}
                </div>
                <div class="col-md-6 text-md-end">
                    <strong>Payment Status:</strong>
                    <span class="badge {{ $order->payment_status == 'paid' ? 'bg-success' : 'bg-warning' }}">
                        {{ ucfirst($order->payment_status) }}
                    </span>
                </div>
            </div>

            {{-- DELIVERY ADDRESS --}}
            @if($order->address)
                <div class="mb-4">
                    <h6>Delivery Address</h6>
                    <p class="mb-0">
                        {{ $order->address->name }} <br>
                        {{ $order->address->phone }} <br>
                        {{ $order->address->address }},
                        {{ $order->address->city }} - {{ $order->address->pincode }}
                    </p>
                </div>
            @endif

            {{-- ITEMS --}}
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead class="table-light">
                        <tr>
                            <th>#</th>
                            <th>Food Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>

                        @php $total = 0; @endphp

                        @foreach($order->items as $item)
                            @php
                                $subtotal = $item->price * $item->quantity;
                                $total += $subtotal;
                            @endphp
                            <tr>
                                <td>{{ $loop->iteration }}</td>
                                <td>{{ $item->food_name }}</td>
                                <td>₹ {{ $item->price }}</td>
                                <td>{{ $item->quantity }}</td>
                                <td>₹ {{ $subtotal }}</td>
                            </tr>
                        @endforeach

                    </tbody>
                </table>
            </div>

            {{-- TOTAL --}}
            <div class="text-end mt-3">
                <h5>Total Amount: ₹ {{ $total }}</h5>
            </div>

            <hr>

            <p class="text-center text-muted mb-0">
                Thank you for ordering from <strong>Our Restaurant</strong>
            </p>

        </div>
    </div>

@endsection