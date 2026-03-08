@extends('layouts.delivery')

@section('content')

<style>

.dashboard-header{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:25px;
}

.dashboard-title{
font-size:22px;
font-weight:600;
}

.card{
background:#fff;
border-radius:10px;
padding:18px;
margin-bottom:18px;
box-shadow:0 2px 6px rgba(0,0,0,0.1);
}

.order-row{
display:flex;
justify-content:space-between;
align-items:center;
flex-wrap:wrap;
margin-bottom:10px;
}

.order-id{
font-weight:600;
font-size:16px;
}

.status{
padding:4px 10px;
border-radius:20px;
font-size:12px;
font-weight:600;
}

.status-active{
background:#dbeafe;
color:#1e40af;
}

.status-delivered{
background:#dcfce7;
color:#166534;
}

.address-box{
background:#f9fafb;
padding:10px;
border-radius:6px;
margin-top:10px;
font-size:14px;
}

.map-btn{
display:inline-block;
margin-top:8px;
background:#2563eb;
color:#fff;
padding:6px 10px;
border-radius:6px;
text-decoration:none;
font-size:13px;
}

.map-btn:hover{
background:#1d4ed8;
}

select{
margin-top:10px;
padding:6px;
border-radius:5px;
border:1px solid #ddd;
}

.location-btn{
background:#16a34a;
color:#fff;
border:none;
padding:8px 12px;
border-radius:6px;
cursor:pointer;
}

.location-btn:hover{
background:#15803d;
}

.section-title{
font-size:18px;
font-weight:600;
margin:20px 0 10px;
}

</style>


<div class="dashboard-header">

<div class="dashboard-title">
Welcome, {{ auth()->user()->name }}
</div>

<button onclick="updateLocation()" class="location-btn">
📍 Update My Location
</button>

</div>


@if(session('success'))
<div class="card" style="background:#dcfce7;color:#166534;">
{{ session('success') }}
</div>
@endif


<div class="section-title">Active Orders</div>

@forelse($activeOrders as $order)

<div class="card">

<div class="order-row">

<div class="order-id">
Order #{{ $order->id }}
</div>

<div class="status status-active">
{{ ucfirst(str_replace('_',' ',$order->status)) }}
</div>

</div>

<strong>Total:</strong> ₹ {{ $order->total_amount }}

@if($order->address)

<div class="address-box">

<strong>{{ $order->address->name }}</strong><br>

📞 {{ $order->address->phone }}<br>

📍 {{ $order->address->address }},
{{ $order->address->city }} -
{{ $order->address->pincode }}

@if($order->address->latitude && $order->address->longitude)

<br>

<a target="_blank"
href="https://www.google.com/maps?q={{ $order->address->latitude }},{{ $order->address->longitude }}"
class="map-btn">

Open in Google Maps

</a>

@endif

</div>

@endif


<form method="POST"
action="{{ route('delivery.orders.updateStatus',$order->id) }}">
@csrf

<select name="status" onchange="this.form.submit()">

<option value="">Change Status</option>

<option value="out_for_delivery"
{{ $order->status=='out_for_delivery'?'selected':'' }}>
Out for Delivery
</option>

<option value="delivered">
Delivered
</option>

</select>

</form>

</div>

@empty

<div class="card">
No active orders.
</div>

@endforelse



<div class="section-title">Completed Orders</div>

@forelse($completedOrders as $order)

<div class="card">

<div class="order-row">

<div class="order-id">
Order #{{ $order->id }}
</div>

<div class="status status-delivered">
Delivered
</div>

</div>

<strong>Total:</strong> ₹ {{ $order->total_amount }}

</div>

@empty

<div class="card">
No completed orders.
</div>

@endforelse



<script>

function updateLocation(){

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(function(position){

fetch("{{ route('delivery.location.update') }}",{

method:"POST",

headers:{
"Content-Type":"application/json",
"X-CSRF-TOKEN":"{{ csrf_token() }}"
},

body:JSON.stringify({

latitude:position.coords.latitude,
longitude:position.coords.longitude

})

}).then(()=>{

alert("Location Updated");

});

});

}else{

alert("Geolocation not supported");

}

}

</script>

@endsection