<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Panel</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background-color: #f8f9fa;
            overflow-x: hidden; /* 🔴 VERY IMPORTANT */
        }

        /* ===== NAVBAR HEIGHT FIX ===== */
        .navbar {
            height: 56px;
        }

        /* ===== SIDEBAR (DESKTOP) ===== */
        .sidebar {
            background-color: #212529;
            min-height: calc(100vh - 56px);
            padding-top: 10px;
        }

        .sidebar a {
            color: #ffffff;
            text-decoration: none;
            display: block;
            padding: 12px 16px;
        }

        .sidebar a:hover,
        .sidebar a.active {
            background-color: #0d6efd;
        }

        /* ===== MAIN CONTENT ===== */
        .admin-content {
            padding-top: 20px;
        }

        /* ===== MOBILE FIX ===== */
        @media (max-width: 767px) {

            /* Sidebar becomes drawer */
            .sidebar {
                position: fixed;
                top: 56px;
                left: -260px;
                width: 260px;
                height: calc(100vh - 56px);
                z-index: 1050;
                transition: left 0.3s ease;
            }

            .sidebar.show {
                left: 0;
            }

            /* Content always below navbar */
            .admin-content {
                padding-top: 80px;
            }
        }
    </style>
</head>

<body>

<!-- 🔝 TOP NAVBAR -->
<nav class="navbar navbar-dark bg-dark fixed-top">
    <div class="container-fluid">

        <!-- ☰ TOGGLE (Mobile only) -->
        <button class="btn btn-outline-light d-md-none"
                id="sidebarToggle">
            ☰
        </button>

        <span class="navbar-brand ms-2">Food Admin Panel</span>

        <!-- LOGOUT -->
        <form method="POST" action="{{ route('logout') }}" class="ms-auto">
            @csrf
            <button class="btn btn-danger btn-sm">
                Logout
            </button>
        </form>
    </div>
</nav>

<!-- 🔽 PAGE WRAPPER -->
<div class="container-fluid" style="padding-top:56px;">
    <div class="row">

        <!-- ⬅️ SIDEBAR -->
        <div id="adminSidebar" class="col-md-2 sidebar p-0">
            <h5 class="text-white text-center py-3">Admin Menu</h5>

            <a href="{{ route('admin.dashboard') }}"
               class="{{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
                📊 Dashboard
            </a>

            <a href="{{ route('admin.categories.index') }}"
               class="{{ request()->routeIs('admin.categories.*') ? 'active' : '' }}">
                📁 Categories
            </a>

            <a href="{{ route('admin.foods.index') }}"
               class="{{ request()->routeIs('admin.foods.*') ? 'active' : '' }}">
                🍽 Food Items
            </a>

            <a href="{{ route('admin.festival_banners.index') }}"
               class="{{ request()->routeIs('admin.festival_banners.*') ? 'active' : '' }}">
                🎉 Festival Specials
            </a>

            <a href="{{ route('admin.orders.index') }}"
               class="{{ request()->routeIs('admin.orders.*') ? 'active' : '' }}">
                📦 Orders
            </a>

             <a href="{{ route('admin.delivery.requests') }}"
                    class="{{ request()->routeIs('admin.delivery.requests') ? 'active' : '' }}">
                    🚚 Delivery Requests
                </a>
        </div>

        <!-- 👉 MAIN CONTENT -->
        <div class="col-md-10 ms-auto p-4 admin-content">
            @yield('content')
        </div>

    </div>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- ✅ SIDEBAR TOGGLE -->
<script>
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar   = document.getElementById('adminSidebar');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }
</script>

</body>
</html>
