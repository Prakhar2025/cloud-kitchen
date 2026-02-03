<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: DejaVu Sans; }
        table { width:100%; border-collapse: collapse; }
        th, td { border:1px solid #000; padding:8px; }
        th { background:#f1f1f1; }
    </style>
</head>
<body>

<h2>Yearly Revenue Report ({{ now()->year }})</h2>

<table>
    <tr>
        <th>Sr. No.</th>
        <!-- <th>Order ID</th> -->
        <th>Amount</th>
        <th>Date</th>
    </tr>

    @foreach($orders as $order)
        <tr>
            <td>{{ $loop->iteration }}</td>
            <!-- <td>{{ $order->id }}</td> -->
            <td>₹ {{ $order->total_amount }}</td>
            <td>{{ $order->created_at->format('d-m-Y') }}</td>
        </tr>
    @endforeach
</table>

<h4>Total Yearly Revenue: ₹ {{ $totalRevenue }}</h4>

</body>
</html>
