@extends('admin.layout')

@section('content')

<h3 class="mb-4">Delivery Partner Management</h3>

@if(session('success'))
<div class="alert alert-success">
{{ session('success') }}
</div>
@endif

<div class="card">

<div class="card-body p-0">

<table class="table table-bordered table-striped mb-0">

<thead class="table-dark">
<tr>
<th>Sr.No.</th>
<th>Name</th>
<th>Email</th>
<th>Phone</th>
<th>Status</th>
<th>Active</th>
<th>Orders Delivered</th>
<th>Actions</th>
</tr>
</thead>

<tbody>

@forelse($deliveries as $delivery)

<tr>

<td>{{ $loop->iteration }}</td>

<td>{{ $delivery->name }}</td>

<td>{{ $delivery->email }}</td>

<td>{{ $delivery->phone }}</td>

<td>

@if($delivery->is_approved)
<span class="badge bg-success">Approved</span>
@else
<span class="badge bg-warning text-dark">Pending</span>
@endif

</td>

<td>

@if($delivery->is_active)
<span class="badge bg-success">Active</span>
@else
<span class="badge bg-danger">Suspended</span>
@endif

</td>

<td>

{{ \App\Models\Order::where('delivery_boy_id',$delivery->id)
->where('status','delivered')
->count() }}

</td>

<td>

{{-- APPROVE --}}
@if(!$delivery->is_approved)

<form method="POST"
action="{{ route('admin.delivery.approve',$delivery->id) }}"
style="display:inline;">
@csrf
<button class="btn btn-success btn-sm">Approve</button>
</form>

@endif


{{-- SUSPEND / ACTIVATE --}}

@if($delivery->is_active)

<form method="POST"
action="{{ route('admin.delivery.suspend',$delivery->id) }}"
style="display:inline;">
@csrf
<button class="btn btn-warning btn-sm">Suspend</button>
</form>

@else

<form method="POST"
action="{{ route('admin.delivery.activate',$delivery->id) }}"
style="display:inline;">
@csrf
<button class="btn btn-primary btn-sm">Activate</button>
</form>

@endif


{{-- DELETE --}}

<form method="POST"
action="{{ route('admin.delivery.delete',$delivery->id) }}"
style="display:inline;"
onsubmit="return confirm('Delete this delivery partner?')">

@csrf
@method('DELETE')

<button class="btn btn-danger btn-sm">Delete</button>

</form>

</td>

</tr>

@empty

<tr>
<td colspan="8" class="text-center">
No delivery partners found
</td>
</tr>

@endforelse

</tbody>

</table>

</div>

</div>

@endsection