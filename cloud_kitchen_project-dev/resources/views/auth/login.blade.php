<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

    <style>
        body {
            min-height: 100vh;
            background: linear-gradient(135deg, #ff7a18, #ffb347);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
        }

        .login-wrapper {
            max-width: 900px;
            width: 100%;
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .login-left {
            background: url('https://images.unsplash.com/photo-1521305916504-4a1121188589')
                        center/cover no-repeat;
        }

        .login-overlay {
            background: rgba(0,0,0,0.55);
            height: 100%;
            color: #fff;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .login-overlay h2 {
            font-weight: 700;
        }

        .login-right {
            padding: 40px;
        }

        .form-control {
            height: 48px;
            border-radius: 10px;
            padding-left: 42px;
            padding-right: 42px;
        }

        .input-icon {
            position: absolute;
            top: 50%;
            left: 14px;
            transform: translateY(-50%);
            color: #999;
        }

        .eye-icon {
            position: absolute;
            top: 50%;
            right: 14px;
            transform: translateY(-50%);
            cursor: pointer;
            color: #999;
        }

        .eye-icon:hover {
            color: #333;
        }

        .form-group {
            position: relative;
            margin-bottom: 18px;
        }

        .btn-login {
            height: 48px;
            border-radius: 10px;
            font-weight: 600;
            background: linear-gradient(135deg, #ff7a18, #ffb347);
            border: none;
        }

        .btn-login:hover {
            opacity: 0.9;
        }

        @media (max-width: 768px) {
            .login-left {
                display: none;
            }
        }
    </style>
</head>
<body>

<div class="login-wrapper row g-0">

    <!-- LEFT IMAGE -->
    <div class="col-md-6 login-left">
        <div class="login-overlay">
            <h2>Welcome Back 🍔</h2>
            <p class="mt-2">
                Login to continue ordering your favourite meals.
            </p>
        </div>
    </div>

    <!-- RIGHT FORM -->
    <div class="col-md-6 login-right">
        <h4 class="fw-bold mb-1">Login</h4>
        <p class="text-muted mb-4">Access your account</p>

        @if(session('status'))
            <div class="alert alert-success">
                {{ session('status') }}
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}">
            @csrf

            <!-- EMAIL -->
            <div class="form-group">
                <i class="bi bi-envelope input-icon"></i>
                <input type="email"
                       name="email"
                       value="{{ old('email') }}"
                       class="form-control @error('email') is-invalid @enderror"
                       placeholder="Email Address"
                       required autofocus>
                @error('email')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <!-- PASSWORD WITH EYE ICON -->
            <div class="form-group">
                <i class="bi bi-lock input-icon"></i>

                <input type="password"
                       id="password"
                       name="password"
                       class="form-control @error('password') is-invalid @enderror"
                       placeholder="Password"
                       required>

                <i class="bi bi-eye eye-icon" id="togglePassword"></i>

                @error('password')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <!-- REMEMBER + FORGOT -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="remember" id="remember">
                    <label class="form-check-label" for="remember">
                        Remember me
                    </label>
                </div>

                @if (Route::has('password.request'))
                    <a href="{{ route('password.request') }}" class="text-decoration-none">
                        Forgot password?
                    </a>
                @endif
            </div>

            <!-- BUTTON -->
            <button type="submit" class="btn btn-login w-100 text-white">
                Login
            </button>

            <!-- REGISTER -->
            <div class="text-center mt-3">
                <span class="text-muted">
                    Don’t have an account?
                    <a href="{{ route('register') }}">Create one</a>
                </span>
            </div>
        </form>
    </div>
</div>

<!-- SHOW / HIDE PASSWORD SCRIPT -->
<script>
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');

    togglePassword.addEventListener('click', function () {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);

        this.classList.toggle('bi-eye');
        this.classList.toggle('bi-eye-slash');
    });
</script>

</body>
</html>
