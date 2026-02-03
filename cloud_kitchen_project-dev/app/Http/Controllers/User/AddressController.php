<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = auth()->user()->addresses;

        return view('user.checkout.address', compact('addresses'));
    }

    public function select(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:user_addresses,id'
        ]);

        $address = UserAddress::where('id', $request->address_id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        session(['checkout.address_id' => $address->id]);

        return redirect()->route('checkout.payment');
    }

    public function store(Request $request)
    {
        $request->validate([
            'label'        => 'nullable|string',
            'name'         => 'required|string',
            'phone'        => 'required|string',
            'city'         => 'required|string',
            'pincode'      => 'required|string',
            'latitude'     => 'required',
            'longitude'    => 'required',
        ]);

        // 🔥 Build full address like Swiggy
        $fullAddress = implode(', ', array_filter([
            $request->house_no,
            $request->building_name,
            $request->street_name,
            $request->landmark,
        ]));

        $address = UserAddress::create([
            'user_id'        => auth()->id(),
            'label'          => $request->label,
            'name'           => $request->name,
            'phone'          => $request->phone,
            'house_no'       => $request->house_no,
            'building_name'  => $request->building_name,
            'street_name'    => $request->street_name,
            'landmark'       => $request->landmark,
            'address'        => $fullAddress,
            'city'           => $request->city,
            'pincode'        => $request->pincode,
            'latitude'       => $request->latitude,
            'longitude'      => $request->longitude,
        ]);

        session(['checkout.address_id' => $address->id]);

        return redirect()->route('checkout.payment');
    }
}

