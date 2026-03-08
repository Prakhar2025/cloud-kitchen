@extends('admin.layout')

@section('content')

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
<th>Assign Delivery</th>
</tr>
</thead>

<tbody>

@foreach($orders as $order)

<tr>

<td>{{ $loop->iteration }}</td>

<td>#{{ $order->id }}</td>

<td>
{{ $order->user->name }} <br>
<small class="text-muted">{{ $order->user->email }}</small>
</td>

<td>

@if($order->address)

<strong>{{ $order->address->name }}</strong><br>
{{ $order->address->phone }}<br>

<small>
{{ $order->address->address }},
{{ $order->address->city }} -
{{ $order->address->pincode }}
</small>

@if($order->address->latitude && $order->address->longitude)

<br>

<a target="_blank"
href="https://www.google.com/maps?q={{ $order->address->latitude }},{{ $order->address->longitude }}"
class="text-primary">

📍 View Customer Location

</a>

@endif

@endif


{{-- DELIVERY BOY TRACKING --}}
@if($order->deliveryBoy && $order->deliveryBoy->latitude)

<br><br>

<strong>Delivery Partner:</strong><br>

{{ $order->deliveryBoy->name }}

<br>

<a target="_blank"
href="https://www.google.com/maps?q={{ $order->deliveryBoy->latitude }},{{ $order->deliveryBoy->longitude }}"
class="text-success">

🚚 Track Delivery Boy

</a>

@endif

</td>

<td>₹ {{ $order->total_amount }}</td>

<td>

<span class="badge bg-info">
{{ strtoupper($order->payment_method) }}
</span>

<br>

<span class="badge {{ $order->payment_status=='paid'?'bg-success':'bg-warning' }}">
{{ ucfirst($order->payment_status) }}
</span>

</td>


<td>

@if($order->status=='cancelled')

<span class="badge bg-danger">Cancelled</span>

@elseif($order->status=='delivered')

<span class="badge bg-success">Delivered</span>

@else

<form method="POST"
action="{{ route('admin.orders.updateStatus',$order->id) }}">
@csrf

<select name="status"
class="form-select form-select-sm"
onchange="this.form.submit()">

<option value="pending"
{{ $order->status=='pending'?'selected':'' }}>
Pending
</option>

<option value="accepted"
{{ $order->status=='accepted'?'selected':'' }}>
Accepted
</option>

<option value="preparing"
{{ $order->status=='preparing'?'selected':'' }}>
Preparing
</option>

</select>

</form>

@endif

</td>


<td>

<form method="POST"
action="{{ route('admin.orders.assignDelivery',$order->id) }}">
@csrf

<select name="delivery_boy_id"
class="form-select form-select-sm"
onchange="this.form.submit()">

<option value="">-- Select --</option>

@foreach($deliveryBoys as $boy)

<option value="{{ $boy->id }}"
{{ $order->delivery_boy_id==$boy->id?'selected':'' }}>

{{ $boy->name }}

</option>

@endforeach

</select>

</form>

</td>

</tr>

<tr>

<td colspan="8">

<strong>Order Items:</strong>

<ul>

@foreach($order->items as $item)

<li>

{{ $item->food_name }}
— Qty: {{ $item->quantity }}
— ₹ {{ $item->price }}

</li>

@endforeach

</ul>

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