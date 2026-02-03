@extends('admin.layout')

@section('content')

<h3 class="mb-4">📅 Weekly Revenue Report</h3>

<a href="{{ route('admin.dashboard') }}" class="btn btn-secondary mb-3">
    ← Back to Dashboard
</a>

  <a href="{{ route('admin.reports.weekly.pdf') }}"
       class="btn btn-primary mb-3">
        📄 Download Weekly PDF
    </a>


<div class="card">
    <div class="card-body p-0">
        <table class="table table-bordered mb-0">
            <thead>
                <tr>
                    <th>Sr. No.</th>
                    <!-- <th>Order ID</th> -->
                    <th>Total Amount</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                @forelse($orders as $order)
                    <tr>
                        <td>{{ $loop->iteration }}</td>
                        <!-- <td>{{ $order->id }}</td> -->
                        <td>₹ {{ number_format($order->total_amount, 2) }}</td>
                        <td>{{ $order->created_at->format('d M Y') }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                            No orders found for this week
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>

@endsection
