<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>User Panel</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background-color: #f8f9fa;
            overflow-x: hidden;
        }

        /* ================= NAVBAR SPACER FIX ================= */
        .navbar-spacer {
            height: var(--navbar-height, 56px);
        }

        /* ================= SIDEBAR ================= */
        .sidebar {
            position: fixed;
            top: var(--navbar-height, 56px);
            left: 0;
            width: 240px;
            height: calc(100vh - var(--navbar-height, 56px));
            background: #212529;
            overflow-y: auto;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            z-index: 1040;
        }

        .sidebar.show {
            transform: translateX(0);
        }

        .sidebar a {
            color: #fff;
            text-decoration: none;
            display: block;
            padding: 12px 16px;
        }

        .sidebar a:hover,
        .sidebar a.active {
            background: #0d6efd;
        }

        /* ================= PAGE CONTENT ================= */
        .page-content {
            padding: 20px;
            transition: margin-left 0.3s ease;
        }

        @media (min-width: 992px) {
            .page-content.shift {
                margin-left: 240px;
            }
        }

        /* ================= USER AVATAR ================= */
        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #0d6efd;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
        }

        /* ================= SEARCH ================= */
        .search-box {
            position: relative;
            width: 100%;
        }

        .search-box input {
            border-radius: 25px;
            padding-left: 42px;
            height: 38px;
            border: none;
            box-shadow: 0 3px 10px rgba(0,0,0,.2);
        }

        .search-box span {
            position: absolute;
            top: 50%;
            left: 14px;
            transform: translateY(-50%);
            color: #6c757d;
        }

        /* Mobile search full width */
        @media (max-width: 768px) {
            .navbar form {
                width: 100% !important;
                margin-top: 10px;
            }
        }
    </style>
</head>

<body>

@php
    $unreadCount = auth()->check()
        ? auth()->user()->notifications()->where('is_read', false)->count()
        : 0;

    $user = auth()->user();
    $userInitial = $user ? strtoupper(substr($user->name, 0, 1)) : '';
@endphp

{{-- ================= NAVBAR ================= --}}
<nav id="mainNavbar" class="navbar navbar-dark bg-dark fixed-top px-3">
    <div class="container-fluid flex-wrap d-flex align-items-center">

        {{-- LEFT --}}
        <div class="d-flex align-items-center gap-2">
            @auth
                <button id="sidebarToggle" class="btn btn-sm btn-outline-light">
                    ☰
                </button>
            @endauth

            <a class="navbar-brand mb-0" href="{{ route('menu') }}">
                Our Restaurant
            </a>
        </div>

        {{-- SEARCH --}}
        <form action="{{ route('menu') }}" method="GET"
              class="mx-auto my-2 my-lg-0"
              style="width:40%;">
            <div class="search-box">
                <span>🔍</span>
                <input type="text"
                       name="search"
                       value="{{ request('search') }}"
                       class="form-control form-control-sm text-center"
                       placeholder="Search delicious food...">
            </div>
        </form>

        {{-- RIGHT --}}
        <div class="d-flex align-items-center gap-2 flex-wrap">

            <a href="{{ route('cart.index') }}" class="btn btn-sm btn-warning">
                🛒 Cart
            </a>

            @auth
                <a href="{{ route('user.notifications') }}"
                   class="btn btn-sm btn-outline-light position-relative">
                    🔔
                    @if($unreadCount > 0)
                        <span class="position-absolute top-0 start-100 translate-middle badge bg-danger">
                            {{ $unreadCount }}
                        </span>
                    @endif
                </a>

                <div class="dropdown">
                    <button class="btn btn-sm btn-outline-light dropdown-toggle d-flex align-items-center gap-2"
                            data-bs-toggle="dropdown">
                        <div class="user-avatar">{{ $userInitial }}</div>
                        <span class="d-none d-md-inline">{{ $user->name }}</span>
                    </button>

                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="{{ route('user.profile.index') }}">👤 My Profile</a></li>
                        <li><a class="dropdown-item" href="{{ route('user.addresses.index') }}">📍 Saved Addresses</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                            <a class="dropdown-item text-danger"
                               href="{{ route('logout') }}"
                               onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                🚪 Logout
                            </a>
                        </li>
                    </ul>
                </div>

                <form id="logout-form" method="POST" action="{{ route('logout') }}" class="d-none">
                    @csrf
                </form>
            @endauth

            @guest
                <a href="{{ route('login') }}" class="btn btn-sm btn-outline-light">Login</a>
            @endguest
        </div>
    </div>
</nav>

{{-- ✅ NAVBAR SPACER (KEY FIX) --}}
<div class="navbar-spacer"></div>

{{-- ================= SIDEBAR ================= --}}
@auth
<div id="userSidebar" class="sidebar">
    <a href="{{ route('menu') }}">🍽 Menu</a>
    <a href="{{ route('cart.index') }}">🛒 My Cart</a>
    <a href="{{ route('user.orders.index') }}">📦 My Orders</a>
    <a href="{{ route('user.notifications') }}">🔔 Notifications</a>
    <hr class="text-secondary">
    <a href="{{ route('user.profile.index') }}">👤 My Profile</a>
    <a href="{{ route('user.addresses.index') }}">📍 Saved Addresses</a>
</div>
@endauth

{{-- ================= PAGE CONTENT ================= --}}
<div id="pageContent" class="page-content">
    @include('components.flash')
    @yield('content')
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<script>
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar   = document.getElementById('userSidebar');
    const content   = document.getElementById('pageContent');
    const navbar    = document.getElementById('mainNavbar');
    const spacer    = document.querySelector('.navbar-spacer');

    function updateNavbarHeight() {
        const height = navbar.offsetHeight;
        document.documentElement.style.setProperty('--navbar-height', height + 'px');
        spacer.style.height = height + 'px';
    }

    window.addEventListener('load', updateNavbarHeight);
    window.addEventListener('resize', updateNavbarHeight);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('show');
            content.classList.toggle('shift');
        });
    }
</script>

</body>
</html>
