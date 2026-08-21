import { api, apiMode, mockResponse, delay } from './client'

// ===== Mock Data =====

const mockAnalytics = {
  overview: {
    totalRevenue: 4250000,
    revenueGrowth: 12.5,
    totalOrders: 28,
    ordersGrowth: 8.3,
    conversionRate: 3.2,
    conversionGrowth: -0.5,
    avgOrderValue: 151785,
    avgOrderGrowth: 4.1,
    totalCustomers: 24,
    newCustomers: 6,
    repeatRate: 35,
  },

  revenueTrend: [
    { date: '2026-07-22', revenue: 180000, orders: 2 },
    { date: '2026-07-23', revenue: 320000, orders: 3 },
    { date: '2026-07-24', revenue: 250000, orders: 2 },
    { date: '2026-07-25', revenue: 480000, orders: 5 },
    { date: '2026-07-26', revenue: 350000, orders: 3 },
    { date: '2026-07-27', revenue: 290000, orders: 2 },
    { date: '2026-07-28', revenue: 520000, orders: 4 },
    { date: '2026-07-29', revenue: 410000, orders: 3 },
    { date: '2026-07-30', revenue: 380000, orders: 3 },
    { date: '2026-07-31', revenue: 620000, orders: 5 },
    { date: '2026-08-01', revenue: 450000, orders: 4 },
    { date: '2026-08-02', revenue: 380000, orders: 3 },
    { date: '2026-08-03', revenue: 550000, orders: 4 },
    { date: '2026-08-04', revenue: 420000, orders: 3 },
    { date: '2026-08-05', revenue: 680000, orders: 6 },
    { date: '2026-08-06', revenue: 510000, orders: 4 },
    { date: '2026-08-07', revenue: 440000, orders: 3 },
    { date: '2026-08-08', revenue: 720000, orders: 6 },
    { date: '2026-08-09', revenue: 560000, orders: 5 },
    { date: '2026-08-10', revenue: 480000, orders: 4 },
    { date: '2026-08-11', revenue: 850000, orders: 7 },
    { date: '2026-08-12', revenue: 620000, orders: 5 },
    { date: '2026-08-13', revenue: 540000, orders: 4 },
    { date: '2026-08-14', revenue: 320000, orders: 3 },
    { date: '2026-08-15', revenue: 580000, orders: 5 },
    { date: '2026-08-16', revenue: 450000, orders: 4 },
    { date: '2026-08-17', revenue: 920000, orders: 8 },
    { date: '2026-08-18', revenue: 650000, orders: 5 },
    { date: '2026-08-19', revenue: 380000, orders: 3 },
    { date: '2026-08-20', revenue: 950000, orders: 8 },
  ],

  orderStatusBreakdown: [
    { status: 'completed', label: 'Selesai', count: 18, color: '#22c55e' },
    { status: 'shipped', label: 'Dikirim', count: 5, color: '#6366f1' },
    { status: 'processing', label: 'Diproses', count: 3, color: '#3b82f6' },
    { status: 'pending', label: 'Menunggu', count: 2, color: '#f59e0b' },
  ],

  categoryPerformance: [
    { name: 'Tanaman Hias', revenue: 18200000, orders: 15, products: 2, growth: 15.2 },
    { name: 'Pupuk & Nutrisi', revenue: 12600000, orders: 8, products: 1, growth: 22.1 },
    { name: 'Pot & Dekorasi', revenue: 6384000, orders: 6, products: 1, growth: 8.5 },
    { name: 'Media Tanam', revenue: 3200000, orders: 4, products: 0, growth: -5.3 },
  ],

  topProducts: [
    { name: 'Pupuk NPK Mutiara 1kg', sold: 2100, revenue: 63000000, trend: 'up' },
    { name: 'Sirih Gading Golden Pothos', sold: 1200, revenue: 42000000, trend: 'up' },
    { name: 'Monstera Deliciosa 60–80cm', sold: 340, revenue: 49300000, trend: 'stable' },
    { name: 'Pot Terakota 20cm', sold: 760, revenue: 31920000, trend: 'up' },
    { name: 'Aglonema Lipstick', sold: 210, revenue: 18690000, trend: 'down' },
  ],

  customerInsights: {
    newVsRepeat: [
      { label: 'Pembeli Baru', count: 16, percentage: 67 },
      { label: 'Pembeli Ulang', count: 8, percentage: 33 },
    ],
    topCities: [
      { city: 'Jakarta Selatan', orders: 8, revenue: 1200000 },
      { city: 'Depok', orders: 5, revenue: 750000 },
      { city: 'Jakarta Barat', orders: 4, revenue: 600000 },
      { city: 'Tangerang', orders: 3, revenue: 450000 },
      { city: 'Bekasi', orders: 2, revenue: 300000 },
    ],
    avgRating: 4.7,
    totalReviews: 42,
  },

  peakHours: [
    { hour: '08:00', orders: 2 },
    { hour: '09:00', orders: 4 },
    { hour: '10:00', orders: 6 },
    { hour: '11:00', orders: 5 },
    { hour: '12:00', orders: 3 },
    { hour: '13:00', orders: 2 },
    { hour: '14:00', orders: 4 },
    { hour: '15:00', orders: 5 },
    { hour: '16:00', orders: 3 },
    { hour: '17:00', orders: 2 },
    { hour: '18:00', orders: 1 },
  ],

  monthlyComparison: [
    { month: 'Mar', revenue: 2800000, orders: 18 },
    { month: 'Apr', revenue: 3200000, orders: 22 },
    { month: 'Mei', revenue: 3500000, orders: 24 },
    { month: 'Jun', revenue: 3100000, orders: 20 },
    { month: 'Jul', revenue: 3800000, orders: 26 },
    { month: 'Agu', revenue: 4250000, orders: 28 },
  ],
}

// ===== API =====

export const analyticsApi = {
  getAnalytics: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/seller/analytics')
      return { success: true, message: 'Analytics dimuat', data: res.data?.data || res.data }
    }
    await delay()
    return { success: true, message: 'Analytics dimuat', data: mockAnalytics }
  },
}
