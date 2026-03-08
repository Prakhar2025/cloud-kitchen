@extends('layouts.delivery')

@section('content')

<h2 style="margin-bottom:20px;">My Orders</h2>

@forelse($orders as $order)
    <div class="card">

        <strong>Order #{{ $order->id }}</strong><br>
        ₹ {{ $order->total_amount }}<br>

        <span class="status 
            {{ $order->status == 'delivered' ? 'status-delivered' : 'status-active' }}">
            {{ ucfirst(str_replace('_',' ',$order->status)) }}
        </span>

        @if($order->address)
            <hr style="margin:15px 0;">
            {{ $order->address->name }}<br>
            {{ $order->address->address }},
            {{ $order->address->city }}
        @endif

    </div>
@empty
    <div class="card">No orders found.</div>
@endforelse

@endsection