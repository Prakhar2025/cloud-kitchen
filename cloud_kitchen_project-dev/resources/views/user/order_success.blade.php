<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Order Placed</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<nav class="navbar navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand" href="{{ route('menu') }}">
            Our Restaurant
        </a>
    </div>
</nav>

<div class="container mt-5 text-center">
    <h2 class="text-success mb-3">🎉 Order Placed Successfully!</h2>

    <p class="mb-4">
        Thank you for your order.  
        Your food is being prepared.
    </p>

    <a href="{{ route('menu') }}" class="btn btn-primary">
        Back to Menu
    </a>
</div>

</body>
</html>
