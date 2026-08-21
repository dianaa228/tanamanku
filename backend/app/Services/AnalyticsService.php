<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\ServiceOrder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class AnalyticsService
{
    public function getSellerAnalytics(int $storeId): array
    {
        $orders = Order::where('store_id', $storeId);
        $products = Product::where('store_id', $storeId);

        $totalRevenue = (clone $orders)->where('payment_status', 'paid')->sum('total');
        $totalOrders = (clone $orders)->count();
        $avgOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders) : 0;

        // Revenue trend (30 days)
        $revenueTrend = (clone $orders)
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->where('payment_status', 'paid')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as revenue'), DB::raw('COUNT(*) as orders'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top products
        $topProducts = (clone $products)
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.payment_status', 'paid')
            ->select('products.name', DB::raw('SUM(order_items.quantity) as sold'), DB::raw('SUM(order_items.subtotal) as revenue'))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get();

        return [
            'overview' => [
                'totalRevenue' => $totalRevenue,
                'totalOrders' => $totalOrders,
                'avgOrderValue' => $avgOrderValue,
            ],
            'revenueTrend' => $revenueTrend,
            'topProducts' => $topProducts,
        ];
    }

    public function getAdminAnalytics(): array
    {
        $totalUsers = User::count();
        $totalSellers = User::where('role', 'seller')->count();
        $totalProducts = Product::count();
        $totalRevenue = Order::where('payment_status', 'paid')->sum('total');
        $totalOrders = Order::count();

        // User growth (6 months)
        $userGrowth = User::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month_num'),
                DB::raw('COUNT(*) as users')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('year', 'month_num')
            ->orderBy('year')
            ->orderBy('month_num')
            ->get()
            ->map(function ($item) {
                $item->month = Carbon::createFromDate($item->year, $item->month_num, 1)->format('M');
                return $item;
            });

        // Top sellers
        $topSellers = User::where('role', 'seller')
            ->get(['id', 'name'])
            ->map(function ($seller) {
                $seller->orders_count = Order::where('user_id', $seller->id)
                    ->where('payment_status', 'paid')
                    ->count();
                $seller->revenue = Order::where('user_id', $seller->id)
                    ->where('payment_status', 'paid')
                    ->sum('total');
                return $seller;
            })
            ->sortByDesc('revenue')
            ->values()
            ->take(5);

        return [
            'overview' => [
                'totalUsers' => $totalUsers,
                'totalSellers' => $totalSellers,
                'totalProducts' => $totalProducts,
                'totalRevenue' => $totalRevenue,
                'totalOrders' => $totalOrders,
            ],
            'userGrowth' => $userGrowth,
            'topSellers' => $topSellers,
        ];
    }
}
