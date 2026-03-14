@extends('user.layout')

@section('content')

<h3>My Profile</h3>

<div class="card mt-3">
    <div class="card-body">
        
        @if(session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        <form action="{{ route('user.profile.update') }}" method="POST">
            @csrf
            
            <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" name="name" class="form-control" value="{{ old('name', auth()->user()->name) }}" required>
                @error('name') <small class="text-danger">{{ $message }}</small> @enderror
            </div>
            
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" value="{{ auth()->user()->email }}" disabled>
                <small class="text-muted">Email cannot be changed.</small>
            </div>

            <div class="mb-3">
                <label class="form-label">Phone Number</label>
                <input type="text" name="phone" class="form-control" value="{{ old('phone', auth()->user()->phone) }}">
                @error('phone') <small class="text-danger">{{ $message }}</small> @enderror
            </div>
            
            <div class="mb-3">
                <p><strong>Member Since:</strong> {{ auth()->user()->created_at->format('d M Y') }}</p>
            </div>

            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>

    </div>
</div>

@endsection
