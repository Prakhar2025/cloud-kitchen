@extends('admin.layout')

@section('content')

<h2 class="mb-4">Admin Dashboard</h2>

{{-- ================= BASIC STATS ================= --}}
<div class="row g-3">

    <div class="col-12 col-md-6 mb-3">
        <div class="card text-center">
            <div class="card-body">
                <h6>Total Orders</h6>
                <h2>{{ $totalOrders }}</h2>
            </div>
        </div>
    </div>

    <div class="col-12 col-md-6 mb-3">
        <div class="card text-center">
            <div class="card-body">
                <h6>Today’s Orders</h6>
                <h2>{{ $todayOrders }}</h2>
            </div>
        </div>
    </div>

    <div class="col-12 col-md-6 mb-3">
        <div class="card text-center">
            <div class="card-body">
                <h6>Total Revenue</h6>
                <h2>₹ {{ number_format($totalRevenue, 2) }}</h2>
            </div>
        </div>
    </div>

    <div class="col-12 col-md-6 mb-3">
        <div class="card text-center">
            <div class="card-body">
                <h6>Today’s Revenue</h6>
                <h2>₹ {{ number_format($todayRevenue, 2) }}</h2>
            </div>
        </div>
    </div>

</div>

{{-- ================= PERIOD REVENUE ================= --}}
<div class="row g-3 mt-4">

    <div class="col-12 col-md-4 mb-3">
        <div class="card text-center border-primary">
            <div class="card-body">
                <h6>Weekly Revenue</h6>
                <h3>₹ {{ number_format($weeklyRevenue, 2) }}</h3>

                <a href="{{ route('admin.reports.weekly') }}"
                   class="btn btn-sm btn-outline-primary mt-2">
                    Generate Weekly Report
                </a>
            </div>
        </div>
    </div>

    <div class="col-12 col-md-4 mb-3">
        <div class="card text-center border-success">
            <div class="card-body">
                <h6>Monthly Revenue</h6>
                <h3>₹ {{ number_format($monthlyRevenue, 2) }}</h3>

                <a href="{{ route('admin.reports.monthly') }}"
                   class="btn btn-sm btn-outline-success mt-2">
                    Generate Monthly Report
                </a>
            </div>
        </div>
    </div>

    <div class="col-12 col-md-4 mb-3">
        <div class="card text-center border-danger">
            <div class="card-body">
                <h6>Yearly Revenue</h6>
                <h3>₹ {{ number_format($yearlyRevenue, 2) }}</h3>

                <a href="{{ route('admin.reports.yearly') }}"
                   class="btn btn-sm btn-outline-danger mt-2">
                    Generate Yearly Report
                </a>
            </div>
        </div>
    </div>

</div>

{{-- ================= ORDER STATUS ================= --}}
<div class="row g-3 mt-4">

    <div class="col-12 col-md-4">
        <div class="card text-center bg-warning">
            <div class="card-body">
                <h6>Pending Orders</h6>
                <h2>{{ $pendingOrders }}</h2>
            </div>
        </div>
    </div>

    <div class="col-12 col-md-4">
        <div class="card text-center bg-success text-white">
            <div class="card-body">
                <h6>Delivered Orders</h6>
                <h2>{{ $deliveredOrders }}</h2>
            </div>
        </div>
    </div>

    <div class="col-12 col-md-4">
        <div class="card text-center bg-danger text-white">
            <div class="card-body">
                <h6>Cancelled Orders</h6>
                <h2>{{ $cancelledOrders }}</h2>
            </div>
        </div>
    </div>

</div>

@endsection
