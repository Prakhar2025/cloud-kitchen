<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Forgot Password</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

    <style>
        body {
            min-height: 100vh;
            background: linear-gradient(135deg, #1d2671, #c33764);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
        }

        .auth-card {
            max-width: 420px;
            width: 100%;
            background: #fff;
            border-radius: 14px;
            padding: 35px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.18);
        }

        .auth-icon {
            width: 64px;
            height: 64px;
            background: rgba(195, 55, 100, 0.15);
            color: #c33764;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 28px;
            margin: 0 auto 15px;
        }

        .form-control {
            height: 48px;
            border-radius: 10px;
            padding-left: 42px;
        }

        .input-icon {
            position: absolute;
            top: 50%;
            left: 14px;
            transform: translateY(-50%);
            color: #999;
        }

        .form-group {
            position: relative;
            margin-bottom: 18px;
        }

        .btn-reset {
            height: 48px;
            border-radius: 10px;
            font-weight: 600;
            background: linear-gradient(135deg, #1d2671, #c33764);
            border: none;
        }

        .btn-reset:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>

<div class="auth-card">

    <div class="auth-icon">
        <i class="bi bi-lock-fill"></i>
    </div>

    <h4 class="fw-bold text-center mb-2">Forgot Password</h4>
    <p class="text-muted text-center mb-4">
        Enter your email and we’ll send you a password reset link.
    </p>

    {{-- SUCCESS MESSAGE --}}
    @if (session('status'))
        <div class="alert alert-success text-center">
            {{ session('status') }}
        </div>
    @endif

    {{-- FORM --}}
    <form method="POST" action="{{ route('password.email') }}">
        @csrf

        <div class="form-group">
            <i class="bi bi-envelope input-icon"></i>
            <input type="email"
                   name="email"
                   value="{{ old('email') }}"
                   class="form-control @error('email') is-invalid @enderror"
                   placeholder="Email address"
                   required autofocus>

            @error('email')
                <div class="invalid-feedback">
                    {{ $message }}
                </div>
            @enderror
        </div>

        <button type="submit" class="btn btn-reset w-100 text-white">
            Send Password Reset Link
        </button>

        <div class="text-center mt-3">
            <a href="{{ route('login') }}" class="text-decoration-none">
                ← Back to Login
            </a>
        </div>
    </form>

</div>

</body>
</html>
