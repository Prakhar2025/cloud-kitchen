<!DOCTYPE html>
<html>
<head>
    <title>Delivery Panel</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            background: #f1f5f9;
        }

        .sidebar {
            width: 250px;
            height: 100vh;
            background: #0f172a;
            color: white;
            position: fixed;
            padding-top: 25px;
        }

        .sidebar h2 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 20px;
            font-weight: 600;
        }

        .sidebar a {
            display: block;
            padding: 12px 25px;
            color: #cbd5e1;
            text-decoration: none;
            transition: 0.3s;
        }

        .sidebar a:hover {
            background: #1e293b;
            color: white;
        }

        .active-link {
            background: #2563eb;
            color: white !important;
        }

        .content {
            margin-left: 250px;
            padding: 30px;
        }

        .topbar {
            background: white;
            padding: 15px 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.05);
            margin-bottom: 20px;
        }

        .status {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
        }

        .status-active {
            background: #facc15;
            color: #854d0e;
        }

        .status-delivered {
            background: #22c55e;
            color: white;
        }

        select {
            padding: 8px;
            border-radius: 6px;
            border: 1px solid #ccc;
            margin-top: 10px;
        }

        .logout-btn {
            background: #ef4444;
            border: none;
            padding: 8px 14px;
            color: white;
            border-radius: 6px;
            cursor: pointer;
        }
    </style>
</head>

<body>

<div class="sidebar">
    <h2>🚚 Delivery</h2>

   <a href="{{ route('delivery.dashboard') }}" 
   class="{{ request()->routeIs('delivery.dashboard') ? 'active-link' : '' }}">
    Dashboard
</a>

<a href="{{ route('delivery.myOrders') }}"
   class="{{ request()->routeIs('delivery.myOrders') ? 'active-link' : '' }}">
    My Orders
</a>
    <a href="#">Earnings</a>
</div>

<div class="content">

    <div class="topbar">
        <div><strong>Delivery Dashboard</strong></div>

        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button class="logout-btn">Logout</button>
        </form>
    </div>

    <div style="margin-top: 30px;">
        @yield('content')
    </div>

</div>

</body>
</html>