<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\UserAddress;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index()
    {
        return view('user.profile.index');
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = auth()->user();
        $user->name = $request->name;
        if($request->has('phone')){
            $user->phone = $request->phone;
        }
        $user->save();

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    public function addresses()
    {
        $addresses = UserAddress::where('user_id', auth()->id())
            ->latest()
            ->get();

        return view('user.profile.addresses', compact('addresses'));
    }

    public function edit($id)
    {
        $address = UserAddress::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return view('user.profile.edit_address', compact('address'));
    }

    public function update(Request $request, $id)
    {
        

        $request->validate([
            'name' => 'required',
            'phone' => 'required',
            'address' => 'required',
            'city' => 'required',
            'pincode' => 'required',
        ]);

        UserAddress::where('id', $id)
            ->where('user_id', auth()->id())
            ->update($request->only(
                'name',
                'phone',
                'address',
                'city',
                'pincode'
            ));

        return redirect()->route('user.addresses.index')
            ->with('success', 'Address updated successfully');
    }

   public function delete($id)
{
    $address = UserAddress::where('id', $id)
        ->where('user_id', auth()->id())
        ->firstOrFail();

    // Check if address is used in any order
    if ($address->orders()->exists()) {
        return back()->with('error', 'This address is used in an order and cannot be deleted.');
    }

    $address->delete();

    return back()->with('success', 'Address deleted successfully');
}

}
