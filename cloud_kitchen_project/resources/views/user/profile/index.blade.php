@extends('user.layout')

@section('content')

<h3>My Profile</h3>

<div class="card mt-3">
    <div class="card-body">
        <p><strong>Name:</strong> {{ auth()->user()->name }}</p>
        <p><strong>Email:</strong> {{ auth()->user()->email }}</p>
        <p><strong>Member Since:</strong> {{ auth()->user()->created_at->format('d M Y') }}</p>
    </div>
</div>

@endsection
