@extends('user.layout')

@section('content')

<h3 class="mb-4">Select Delivery Address</h3>

{{-- ================= SAVED ADDRESSES ================= --}}
@if($addresses->count() > 0)
<form method="POST" action="{{ route('checkout.address.select') }}">
    @csrf

    @foreach($addresses as $address)
        <div class="card mb-3">
            <div class="card-body d-flex justify-content-between align-items-start">
                <div>
                    <strong>{{ $address->label ?? 'Address' }}</strong><br>
                    {{ $address->name }}<br>
                    {{ $address->phone }}<br>

                    {{ $address->address }},
                    {{ $address->city }} - {{ $address->pincode }}

                    @if($address->latitude && $address->longitude)
                        <div class="mt-2">
                            <a target="_blank"
                               href="https://www.google.com/maps?q={{ $address->latitude }},{{ $address->longitude }}"
                               class="text-primary">
                                📍 View on Google Maps
                            </a>
                        </div>
                    @endif
                </div>

                <input type="radio"
                       name="address_id"
                       value="{{ $address->id }}"
                       required>
            </div>
        </div>
    @endforeach

    <div class="text-end">
        <button class="btn btn-primary">
            Deliver Here →
        </button>
    </div>
</form>

<hr>
@endif

{{-- ================= ADD NEW ADDRESS ================= --}}
<h5 class="mb-3">Add New Address</h5>

<form method="POST" action="{{ route('checkout.address.store') }}">
@csrf

<div class="row">

    <div class="col-md-6 mb-3">
        <label>Label (Home / Office)</label>
        <input type="text" name="label" class="form-control">
    </div>

    <div class="col-md-6 mb-3">
        <label>Name</label>
        <input type="text" name="name" class="form-control" required>
    </div>

    <div class="col-md-6 mb-3">
        <label>Phone</label>
        <input type="text" name="phone" class="form-control" required>
    </div>

    <div class="col-md-12 mb-3">
        <label>Full Address</label>
        <textarea name="address"
                  id="addressInput"
                  class="form-control"
                  placeholder="Flat, Building, Landmark"
                  required></textarea>
    </div>

    <div class="col-md-6 mb-3">
        <label>City</label>
        <input type="text" name="city" class="form-control" required>
    </div>

    <div class="col-md-6 mb-3">
        <label>Pincode</label>
        <input type="text" name="pincode" class="form-control" required>
    </div>
</div>

{{-- HIDDEN COORDINATES --}}
<input type="hidden" name="latitude" id="latitude">
<input type="hidden" name="longitude" id="longitude">

<button type="button"
        class="btn btn-outline-primary mb-2"
        onclick="useCurrentLocation()">
    📍 Use My Current Location
</button>

<div class="alert alert-warning">
    Drag the pin to your exact delivery point if needed.
</div>

<div id="map" style="height:320px;border-radius:10px"></div>

<button class="btn btn-success mt-3">
    Save & Continue →
</button>

</form>

{{-- GOOGLE MAP SCRIPT --}}
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCEiyim6hjPWTJhePoAVrxrl9nbUTElG7c"></script>

<script>
let map, marker, geocoder;

function initMap(lat = 21.1458, lng = 79.0882) { // Nagpur default
    geocoder = new google.maps.Geocoder();

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 15,
    });

    marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        draggable: true,
    });

    updateLatLng(lat, lng);

    marker.addListener("dragend", function (e) {
        updateLatLng(e.latLng.lat(), e.latLng.lng());
    });
}

initMap();

function updateLatLng(lat, lng) {
    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lng;
}

function useCurrentLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;[]

        marker.setPosition({ lat, lng });
        map.setCenter({ lat, lng });
        updateLatLng(lat, lng);

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                document.getElementById("addressInput").value =
                    results[0].formatted_address;
            }
        });
    });
}

document.getElementById("addressInput").addEventListener("blur", function () {
    const address = this.value;
    if (!address) return;

    geocoder.geocode(
        { address: address + ", India" },
        (results, status) => {
            if (status === "OK") {
                const loc = results[0].geometry.location;
                marker.setPosition(loc);
                map.setCenter(loc);
                updateLatLng(loc.lat(), loc.lng());
            }
        }
    );
});
</script>

@endsection
