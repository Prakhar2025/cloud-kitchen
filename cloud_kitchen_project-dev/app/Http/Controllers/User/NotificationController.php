<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Notification;

class NotificationController extends Controller
{
   public function index()
{
    $notifications = Notification::where('user_id', auth()->id())
        ->latest()
        ->get();

    // MARK AS READ
    Notification::where('user_id', auth()->id())
        ->where('is_read', false)
        ->update(['is_read' => true]);

    return view('user.notifications', compact('notifications'));
}

}
