@extends('user.layout')

@section('content')

<style>

.order-status{
    font-size:12px;
    padding:6px 12px;
    border-radius:20px;
    line-height:1;
    height:auto;
    display:inline-flex;1
    align-items:center;
}

.order-card{
    border-radius:10px;
}

.delivery-box{
    background:#f8f9fa;
    border-radius:8px;
}

</style>

<h3 class="mb-4">My Orders</h3>

@if($orders->count())

@foreach($orders as $order)

<div class="card mb-4 order-card">

<div class="card-header d-flex justify-content-between align-items-center">

<div>
<strong>Order #{{ $order->id }}</strong><br>
<small class="text-muted">
{{ $order->created_at->format('d M Y h:i A') }}
</small>
</div>

<span class="badge order-status
@if($order->status=='pending') bg-warning
@elseif($order->status=='accepted') bg-primary
@elseif($order->status=='preparing') bg-info
@elseif($order->status=='out_for_delivery') bg-primary
@elseif($order->status=='delivered') bg-success
@elseif($order->status=='cancelled') bg-danger
@endif">

{{ ucwords(str_replace('_',' ',$order->status)) }}

</span>

</div>


<div class="card-body">

<p class="mb-1">
<strong>Total Amount:</strong> ₹ {{ $order->total_amount }}
</p>
 
<p class="mb-1">
<strong>Payment:</strong> {{ strtoupper($order->payment_method) }}
</p>

<p class="mb-3">
<strong>Payment Status:</strong>

<span class="badge {{ $order->payment_status=='paid'?'bg-success':'bg-warning' }}">
{{ ucfirst($order->payment_status) }}
</span>

</p>


{{-- DELIVERY PARTNER --}}
@if($order->deliveryBoy)

<div class="border p-3 mb-3 delivery-box">

<h6 class="mb-2">🚚 Delivery Partner</h6>

<p class="mb-1">
<strong>Name:</strong>
{{ $order->deliveryBoy->name }}
</p>

@if($order->deliveryBoy->phone)

<p class="mb-2">

<strong>Phone:</strong>

<a href="tel:{{ $order->deliveryBoy->phone }}">
{{ $order->deliveryBoy->phone }}
</a>

</p>

@endif


@if($order->deliveryBoy->latitude)

<a target="_blank"
href="https://www.google.com/maps?q={{ $order->deliveryBoy->latitude }},{{ $order->deliveryBoy->longitude }}"
class="btn btn-sm btn-primary">

Track Delivery

</a>

@endif

</div>

@else

@if($order->status!='cancelled')

<div class="alert alert-secondary p-2">

🚚 Delivery partner will be assigned soon.

</div>

@endif

@endif



<h6 class="mb-2">Order Items</h6>

<ul class="mb-3">

@foreach($order->items as $item)

<li>

{{ $item->food_name }}

— Qty: {{ $item->quantity }}

— ₹ {{ $item->price }}

</li>

@endforeach

</ul>


<div class="d-flex gap-2 flex-wrap">

<a href="{{ route('user.order.invoice',$order->id) }}"
class="btn btn-outline-primary btn-sm">

View Invoice

</a>


@if($order->status=='pending')

<form method="POST"
action="{{ route('user.order.cancel',$order->id) }}"
style="display:inline">

@csrf

<button class="btn btn-danger btn-sm">

Cancel

</button>

</form>

@endif

</div>

</div>

</div>

@endforeach

@else

<p>You have not placed any orders yet.</p>

<a href="{{ route('menu') }}"
class="btn btn-primary">

Order Now

</a>

@endif

@endsection