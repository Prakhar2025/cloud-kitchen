@extends('user.layout')

@section('content')

<h4 class="mb-3">Notifications</h4>

@if($notifications->count() > 0)
    @foreach($notifications as $note)
        <div class="alert alert-info">
            {{ $note->message }}
        </div>
    @endforeach
@else
    <p>No notifications yet.</p>
@endif

@endsection
