<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\Carbon;


class DashboardController extends Controller
{
    public function index()
    {
        // ===== EXISTING DATA =====
        $totalOrders = Order::count();
        $todayOrders = Order::whereDate('created_at', today())->count();

        $totalRevenue = Order::where('status', 'delivered')->sum('total_amount');

        $todayRevenue = Order::where('status', 'delivered')
            ->whereDate('created_at', today())
            ->sum('total_amount');

        $pendingOrders = Order::where('status', 'pending')->count();
        $deliveredOrders = Order::where('status', 'delivered')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();

        // ===== NEW REVENUE LOGIC =====

        // Weekly Revenue
        $weeklyRevenue = Order::where('status', 'delivered')
            ->whereBetween('created_at', [
                Carbon::now()->startOfWeek(),
                Carbon::now()->endOfWeek()
            ])
            ->sum('total_amount');

        // Monthly Revenue
        $monthlyRevenue = Order::where('status', 'delivered')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_amount');

        // Yearly Revenue
        $yearlyRevenue = Order::where('status', 'delivered')
            ->whereYear('created_at', now()->year)
            ->sum('total_amount');

        return view('admin.dashboard', compact(
            'totalOrders',
            'todayOrders',
            'totalRevenue',
            'todayRevenue',
            'weeklyRevenue',
            'monthlyRevenue',
            'yearlyRevenue',
            'pendingOrders',
            'deliveredOrders',
            'cancelledOrders'
        ));
    }
}
