<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice PDF</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background: #f2f2f2; }
    </style>
</head>
<body>

<h3>Order Invoice</h3>

<p><strong>Order ID:</strong> {{ $order->id }}</p>
<p><strong>Date:</strong> {{ $order->created_at->format('d M Y') }}</p>
<p><strong>Status:</strong> {{ ucfirst($order->status) }}</p>
<p><strong>Payment:</strong> {{ strtoupper($order->payment_method) }}</p>

<hr>

<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Food</th>
            <th>Qty</th>
            <th>Price</th>
        </tr>
    </thead>
    <tbody>
        @foreach($order->items as $item)
        <tr>
            <td>{{ $loop->iteration }}</td>
            <td>{{ $item->food_name }}</td>
            <td>{{ $item->quantity }}</td>
            <td>₹ {{ $item->price }}</td>
        </tr>
        @endforeach
    </tbody>
</table>

<h4 style="text-align:right">Total: ₹ {{ $order->total_amount }}</h4>

<p>Thank you for ordering!</p>

</body>
</html>
