<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index()
    {
        $addresses = UserAddress::where('user_id', auth()->id())->get();

        return response()->json([
            'success' => true,
            'data' => $addresses
        ]);
    }

    public function store(Request $request)
    {
        // Accept both old format (address_line1, zip_code) and new format (address, pincode)
        $validated = $request->validate([
            'label' => 'nullable|string',
            'name' => 'required|string',
            'phone' => 'required|string',
            // Accept either format
            'address' => 'nullable|string',
            'address_line1' => 'nullable|string',
            'address_line2' => 'nullable|string',
            'state' => 'nullable|string',
            'city' => 'required|string',
            'pincode' => 'nullable|string',
            'zip_code' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric'
        ]);

        // Merge address fields for backward compatibility
        $addressData = [
            'user_id' => auth()->id(),
            'label' => $validated['label'] ?? null,
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'city' => $validated['city'],
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
        ];

        // Handle address field - combine old format into new format if needed
        if (!empty($validated['address'])) {
            // New format: use as-is
            $addressData['address'] = $validated['address'];
        } else {
            // Old format: combine address_line1, address_line2, state
            $addressParts = array_filter([
                $validated['address_line1'] ?? '',
                $validated['address_line2'] ?? '',
                $validated['state'] ?? ''
            ]);
            $addressData['address'] = implode(', ', $addressParts);
        }

        // Handle pincode field - accept both pincode and zip_code
        $addressData['pincode'] = $validated['pincode'] ?? $validated['zip_code'] ?? '';

        $address = UserAddress::create($addressData);

        return response()->json([
            'success' => true,
            'message' => 'Address added successfully',
            'data' => $address
        ]);
    }

    public function update(Request $request, UserAddress $address)
    {
        if ($address->user_id !== auth()->id()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        // Accept both old format (address_line1, zip_code) and new format (address, pincode)
        $validated = $request->validate([
            'label' => 'nullable|string',
            'name' => 'required|string',
            'phone' => 'required|string',
            // Accept either format
            'address' => 'nullable|string',
            'address_line1' => 'nullable|string',
            'address_line2' => 'nullable|string',
            'state' => 'nullable|string',
            'city' => 'required|string',
            'pincode' => 'nullable|string',
            'zip_code' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric'
        ]);

        // Merge address fields for backward compatibility
        $addressData = [
            'label' => $validated['label'] ?? null,
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'city' => $validated['city'],
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
        ];

        // Handle address field - combine old format into new format if needed
        if (!empty($validated['address'])) {
            // New format: use as-is
            $addressData['address'] = $validated['address'];
        } else {
            // Old format: combine address_line1, address_line2, state
            $addressParts = array_filter([
                $validated['address_line1'] ?? '',
                $validated['address_line2'] ?? '',
                $validated['state'] ?? ''
            ]);
            $addressData['address'] = implode(', ', $addressParts);
        }

        // Handle pincode field - accept both pincode and zip_code
        $addressData['pincode'] = $validated['pincode'] ?? $validated['zip_code'] ?? '';

        $address->update($addressData);

        return response()->json([
            'success' => true,
            'message' => 'Address updated successfully',
            'data' => $address
        ]);
    }

    public function destroy(UserAddress $address)
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
