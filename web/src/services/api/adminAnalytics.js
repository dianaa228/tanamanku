import { api, apiMode, mockResponse, delay } from './client'

// ===== Mock Data =====

const mockAdminAnalytics = {
  overview: {
    totalUsers: 1248,
    usersGrowth: 15.2,
    totalSellers: 86,
    sellersGrowth: 8.5,
    totalProducts: 2340,
    productsGrowth: 12.1,
    totalRevenue: 125000000,
    revenueGrowth: 18.7,
    totalOrders: 892,
    ordersGrowth: 14.3,
    activeToday: 342,
    newToday: 18,
  },

  userGrowth: [
    { month: 'Mar', users: 680, sellers: 42 },
    { month: 'Apr', users: 750, sellers: 48 },
    { month: 'Mei', users: 820, sellers: 55 },
    { month: 'Jun', users: 890, sellers: 60 },
    { month: 'Jul', users: 1050, sellers: 72 },
    { month: 'Agu', users: 1248, sellers: 86 },
  ],

  revenueByMonth: [
    { month: 'Mar', revenue: 8500000, orders: 62 },
    { month: 'Apr', revenue: 9200000, orders: 68 },
    { month: 'Mei', revenue: 10500000, orders: 75 },
    { month: 'Jun', revenue: 9800000, orders: 70 },
    { month: 'Jul', revenue: 11800000, orders: 85 },
    { month: 'Agu', revenue: 12500000, orders: 92 },
  ],

  topSellers: [
    { name: 'Nursery Hijau Lestari', revenue: 42500000, orders: 156, products: 12, rating: 4.8 },
    { name: 'Toko Tanaman Jakarta', revenue: 28000000, orders: 98, products: 8, rating: 4.6 },
    { name: 'Green Thumb Store', revenue: 18500000, orders: 72, products: 15, rating: 4.7 },
    { name: 'Urban Garden Shop', revenue: 12000000, orders: 45, products: 6, rating: 4.5 },
    { name: 'Plant Paradise', revenue: 8500000, orders: 32, products: 10, rating: 4.4 },
  ],

  topCategories: [
    { name: 'Tanaman Hias', products: 450, revenue: 52000000, percentage: 41.6 },
    { name: 'Pupuk & Nutrisi', products: 320, revenue: 28000000, percentage: 22.4 },
    { name: 'Pot & Dekorasi', products: 280, revenue: 18000000, percentage: 14.4 },
    { name: 'Media Tanam', products: 180, revenue: 12000000, percentage: 9.6 },
    { name: 'Alat Berkebun', products: 150, revenue: 8000000, percentage: 6.4 },
    { name: 'Benih & Bibit', products: 120, revenue: 5000000, percentage: 4.0 },
  ],

  recentActivity: [
    { type: 'user_register', message: 'Pengguna baru mendaftar', detail: 'Rina Tanaman', time: '5 menit lalu', icon: '👤' },
    { type: 'order', message: 'Pesanan baru dibuat', detail: 'ORD-2026-0821-001', time: '12 menit lalu', icon: '📦' },
    { type: 'seller_register', message: 'Seller baru bergabung', detail: 'Green Leaf Store', time: '25 menit lalu', icon: '🏪' },
    { type: 'product_add', message: 'Produk baru ditambahkan', detail: 'Kaktus Golden Barrel', time: '1 jam lalu', icon: '🌱' },
    { type: 'order_complete', message: 'Pesanan selesai', detail: 'ORD-2026-0820-045', time: '1 jam lalu', icon: '✅' },
    { type: 'review', message: 'Review baru diterima', detail: '⭐⭐⭐⭐⭐ Monstera Deliciosa', time: '2 jam lalu', icon: '⭐' },
    { type: 'exchange', message: 'Plant exchange selesai', detail: 'Aloe Vera ↔ Echeveria', time: '3 jam lalu', icon: '🔄' },
    { type: 'service', message: 'Booking jasa baru', detail: 'Landscaping - Jabodetabek', time: '4 jam lalu', icon: '🔧' },
  ],

  systemHealth: {
    apiUptime: 99.8,
    avgResponseTime: 145,
    errorRate: 0.3,
    activeConnections: 128,
    storageUsed: 45.2,
    storageTotal: 100,
  },

  ordersByStatus: [
    { status: 'completed', count: 520, percentage: 58.3 },
    { status: 'shipped', count: 120, percentage: 13.4 },
    { status: 'processing', count: 85, percentage: 9.5 },
    { status: 'pending', count: 62, percentage: 6.9 },
    { status: 'cancelled', count: 55, percentage: 6.2 },
    { status: 'refunded', count: 50, percentage: 5.6 },
  ],

  dailyOrders: [
    { date: '2026-08-14', orders: 28 },
    { date: '2026-08-15', orders: 35 },
    { date: '2026-08-16', orders: 32 },
    { date: '2026-08-17', orders: 42 },
    { date: '2026-08-18', orders: 38 },
    { date: '2026-08-19', orders: 30 },
    { date: '2026-08-20', orders: 45 },
  ],
}

// ===== API =====

export const adminAnalyticsApi = {
  getAnalytics: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/admin/analytics')
      return { success: true, message: 'Analytics dimuat', data: res.data?.data || res.data }
    }
    await delay()
    return { success: true, message: 'Analytics dimuat', data: mockAdminAnalytics }
  },
}
