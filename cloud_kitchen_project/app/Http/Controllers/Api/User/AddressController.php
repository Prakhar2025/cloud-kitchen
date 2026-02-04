<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = Address::where('user_id', auth()->id())->get();

        return response()->json([
            'success' => true,
            'data' => $addresses
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'nullable|string',
            'name' => 'required|string',
            'phone' => 'required|string',
            'address_line1' => 'required|string',
            'address_line2' => 'nullable|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required|string'
        ]);

        $validated['user_id'] = auth()->id();

        $address = Address::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Address added successfully',
            'data' => $address
        ]);
    }

    public function update(Request $request, Address $address)
    {
        if ($address->user_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'label' => 'nullable|string',
            'name' => 'required|string',
            'phone' => 'required|string',
            'address_line1' => 'required|string',
            'address_line2' => 'nullable|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required|string'
        ]);

        $address->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Address updated successfully',
            'data' => $address
        ]);
    }

    public function destroy(Address $address)
    {
        if ($address->user_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $address->delete();

        return response()->json([
            'success' => true,
            'message' => 'Address deleted successfully'
        ]);
    }
}
