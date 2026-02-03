@extends('user.layout')

@section('content')

<h3 class="mb-4">Edit Delivery Address</h3>

<div class="card">
    <div class="card-body">

        <form method="POST"
              action="{{ route('user.addresses.update', $address->id) }}">
            @csrf
            @method('PUT')

            {{-- NAME --}}
            <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text"
                       name="name"
                       class="form-control"
                       value="{{ old('name', $address->name) }}"
                       required>
            </div>

            {{-- PHONE --}}
            <div class="mb-3">
                <label class="form-label">Phone</label>
                <input type="text"
                       name="phone"
                       class="form-control"
                       value="{{ old('phone', $address->phone) }}"
                       required>
            </div>

            {{-- ADDRESS --}}
            <div class="mb-3">
                <label class="form-label">Address</label>
                <textarea name="address"
                          class="form-control"
                          rows="3"
                          required>{{ old('address', $address->address) }}</textarea>
            </div>

            {{-- CITY --}}
            <div class="mb-3">
                <label class="form-label">City</label>
                <input type="text"
                       name="city"
                       class="form-control"
                       value="{{ old('city', $address->city) }}"
                       required>
            </div>

            {{-- PINCODE --}}
            <div class="mb-3">
                <label class="form-label">Pincode</label>
                <input type="text"
                       name="pincode"
                       class="form-control"
                       value="{{ old('pincode', $address->pincode) }}"
                       required>
            </div>

            {{-- BUTTONS --}}
            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-success">
                    Update Address
                </button>

                <a href="{{ route('user.addresses.index') }}"
                   class="btn btn-secondary">
                    Cancel
                </a>
            </div>

        </form>

    </div>
</div>

@endsection
