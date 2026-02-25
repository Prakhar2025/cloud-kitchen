<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     * Automatically marks all as read when fetched
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $notifications = Notification::where('user_id', auth()->id())
            ->latest()
            ->get();

        // Mark all notifications as read when user views them
        Notification::where('user_id', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }

    /**
     * Mark all notifications as read for the authenticated user
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAsRead()
    {
        $updated = Notification::where('user_id', auth()->id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Notifications marked as read',
            'updated_count' => $updated
        ]);
    }
}
