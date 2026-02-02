<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Reset Password</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

    <style>
        body {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
        }

        .auth-card {
            max-width: 460px;
            width: 100%;
            background: #fff;
            border-radius: 14px;
            padding: 35px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .auth-icon {
            width: 64px;
            height: 64px;
            background: rgba(44, 83, 100, 0.15);
            color: #2c5364;
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
            color: #777;
        }

        .eye-icon:hover {
            color: #000;
        }

        .form-group {
            position: relative;
            margin-bottom: 18px;
        }

        .btn-reset {
            height: 48px;
            border-radius: 10px;
            font-weight: 600;
            background: linear-gradient(135deg, #0f2027, #2c5364);
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
        <i class="bi bi-shield-lock-fill"></i>
    </div>

    <h4 class="fw-bold text-center mb-2">Reset Password</h4>
    <p class="text-muted text-center mb-4">
        Create a new password for your account
    </p>

    <form method="POST" action="{{ route('password.store') }}">
        @csrf

        <!-- TOKEN -->
        <input type="hidden" name="token" value="{{ $request->route('token') }}">

        <!-- EMAIL -->
        <div class="form-group">
            <i class="bi bi-envelope input-icon"></i>
            <input type="email"
                   name="email"
                   value="{{ old('email', $request->email) }}"
                   class="form-control @error('email') is-invalid @enderror"
                   placeholder="Email address"
                   required autofocus>

            @error('email')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <!-- PASSWORD -->
        <div class="form-group">
            <i class="bi bi-lock input-icon"></i>
            <input type="password"
                   id="password"
                   name="password"
                   class="form-control @error('password') is-invalid @enderror"
                   placeholder="New password"
                   required>

            <i class="bi bi-eye-slash eye-icon"
               id="togglePassword"
               onclick="togglePassword('password','togglePassword')"></i>

            @error('password')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>

        <!-- CONFIRM PASSWORD -->
        <div class="form-group">
            <i class="bi bi-lock-fill input-icon"></i>
            <input type="password"
                   id="password_confirmation"
                   name="password_confirmation"
                   class="form-control"
                   placeholder="Confirm new password"
                   required>

            <i class="bi bi-eye-slash eye-icon"
               id="toggleConfirmPassword"
               onclick="togglePassword('password_confirmation','toggleConfirmPassword')"></i>
        </div>

        <button type="submit" class="btn btn-reset w-100 text-white">
            Reset Password
        </button>

        <div class="text-center mt-3">
            <a href="{{ route('login') }}" class="text-decoration-none">
                ← Back to Login
            </a>
        </div>

    </form>

</div>

<script>
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("bi-eye-slash");
        icon.classList.add("bi-eye");
    } else {
        input.type = "password";
        icon.classList.remove("bi-eye");
        icon.classList.add("bi-eye-slash");
    }
}
</script>

</body>
</html>
