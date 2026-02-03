<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;


class ReportController extends Controller
{
    public function weekly()
    {
        $orders = Order::where('status', 'delivered')
            ->whereBetween('created_at', [
                Carbon::now()->startOfWeek(),
                Carbon::now()->endOfWeek()
            ])
            ->get();

        return view('admin.reports.weekly', compact('orders'));
    }

    public function monthly()
    {
        $orders = Order::where('status', 'delivered')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->get();

        return view('admin.reports.monthly', compact('orders'));
    }

    public function yearly()
    {
        $orders = Order::where('status', 'delivered')
            ->whereYear('created_at', now()->year)
            ->get();

        return view('admin.reports.yearly', compact('orders'));
    }

    public function weeklyPdf()
    {
        $orders = Order::where('status', 'delivered')
            ->whereBetween('created_at', [
                Carbon::now()->startOfWeek(),
                Carbon::now()->endOfWeek()
            ])->get();

        $totalRevenue = $orders->sum('total_amount');

        $pdf = Pdf::loadView('admin.reports.pdf.weekly', compact('orders', 'totalRevenue'));

        return $pdf->download('weekly-revenue-report.pdf');
    }

    public function monthlyPdf()
    {
        $orders = Order::where('status', 'delivered')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->get();

        $totalRevenue = $orders->sum('total_amount');

        $pdf = PDF::loadView(
            'admin.reports.pdf.monthly',
            compact('orders', 'totalRevenue')
        );

        return $pdf->download('monthly-revenue-report.pdf');
    }

    public function yearlyPdf()
    {
        $orders = Order::where('status', 'delivered')
            ->whereYear('created_at', now()->year)
            ->get();

        $totalRevenue = $orders->sum('total_amount');

        $pdf = PDF::loadView(
            'admin.reports.pdf.yearly',
            compact('orders', 'totalRevenue')
        );

        return $pdf->download('yearly-revenue-report.pdf');
    }


}
