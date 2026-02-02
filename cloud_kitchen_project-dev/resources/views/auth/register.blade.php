<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Create Account</title>
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

        .register-wrapper {
            max-width: 900px;
            width: 100%;
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .register-left {
            background: url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')
                        center/cover no-repeat;
            min-height: 100%;
        }

        .register-overlay {
            background: rgba(0,0,0,0.55);
            height: 100%;
            color: #fff;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .register-overlay h2 {
            font-weight: 700;
        }

        .register-right {
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
            color: #777;
        }

        .eye-icon:hover {
            color: #000;
        }

        .form-group {
            position: relative;
            margin-bottom: 18px;
        }

        .btn-register {
            height: 48px;
            border-radius: 10px;
            font-weight: 600;
            background: linear-gradient(135deg, #ff7a18, #ffb347);
            border: none;
        }

        .btn-register:hover {
            opacity: 0.9;
        }

        @media (max-width: 768px) {
            .register-left {
                display: none;
            }
        }
    </style>
</head>
<body>

<div class="register-wrapper row g-0">

    <!-- LEFT IMAGE SECTION -->
    <div class="col-md-6 register-left">
        <div class="register-overlay">
            <h2>Welcome 🍕</h2>
            <p class="mt-2">
                Create your account and enjoy delicious food delivered fast to your doorstep.
            </p>
        </div>
    </div>

    <!-- RIGHT FORM SECTION -->
    <div class="col-md-6 register-right">
        <h4 class="fw-bold mb-1">Create Account</h4>
        <p class="text-muted mb-4">Join us & start ordering today</p>

        <form method="POST" action="{{ route('register') }}">
            @csrf

            <!-- Name -->
            <div class="form-group">
                <i class="bi bi-person input-icon"></i>
                <input type="text"
                       name="name"
                       value="{{ old('name') }}"
                       class="form-control @error('name') is-invalid @enderror"
                       placeholder="Full Name"
                       required autofocus>
                @error('name')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <!-- Email -->
            <div class="form-group">
                <i class="bi bi-envelope input-icon"></i>
                <input type="email"
                       name="email"
                       value="{{ old('email') }}"
                       class="form-control @error('email') is-invalid @enderror"
                       placeholder="Email Address"
                       required>
                @error('email')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <!-- Password -->
            <div class="form-group">
                <i class="bi bi-lock input-icon"></i>
                <input type="password"
                       id="password"
                       name="password"
                       class="form-control @error('password') is-invalid @enderror"
                       placeholder="Password"
                       required>

                <i class="bi bi-eye-slash eye-icon"
                   id="togglePassword"
                   onclick="toggleField('password','togglePassword')"></i>

                @error('password')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
                <i class="bi bi-shield-lock input-icon"></i>
                <input type="password"
                       id="password_confirmation"
                       name="password_confirmation"
                       class="form-control"
                       placeholder="Confirm Password"
                       required>

                <i class="bi bi-eye-slash eye-icon"
                   id="toggleConfirmPassword"
                   onclick="toggleField('password_confirmation','toggleConfirmPassword')"></i>
            </div>

            <!-- Button -->
            <button type="submit" class="btn btn-register w-100 text-white">
                Create Account
            </button>

            <!-- Login -->
            <div class="text-center mt-3">
                <span class="text-muted">
                    Already have an account?
                    <a href="{{ route('login') }}">Login</a>
                </span>
            </div>
        </form>
    </div>
</div>

<script>
function toggleField(inputId, iconId) {
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
