<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function deliveryRequests()
    {
        $deliveries = User::where('role','delivery')->get();

        return view('admin.delivery_requests', compact('deliveries'));
    }


    public function approveDelivery($id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'is_approved' => 1
        ]);

        return back()->with('success','Delivery partner approved successfully');
    }


    public function suspendDelivery($id)
    {
        $delivery = User::findOrFail($id);

        $delivery->update([
            'is_active' => 0
        ]);

        return back()->with('success','Delivery partner suspended');
    }


    public function activateDelivery($id)
    {
        $delivery = User::findOrFail($id);

        $delivery->update([
            'is_active' => 1
        ]);

        return back()->with('success','Delivery partner activated');
    }


    public function deleteDelivery($id)
    {
        $delivery = User::findOrFail($id);

        $delivery->delete();

        return back()->with('success','Delivery partner deleted');
    }

}