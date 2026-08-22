import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetAnalytics = vi.fn()

vi.mock('../../../services/api/analytics', () => ({
  analyticsApi: {
    getAnalytics: (...args) => mockGetAnalytics(...args),
  },
}))

vi.mock('../../../components/ui/Loading', () => ({
  default: ({ label }) => <div>{label || 'Loading...'}</div>,
}))

vi.mock('../../../utils/format', () => ({
  formatRupiah: (v) => `Rp${(v || 0).toLocaleString('id-ID')}`,
  cx: (...args) => args.filter(Boolean).join(' '),
}))

const mockAnalyticsData = {
  overview: {
    totalRevenue: 10000000,
    totalOrders: 50,
    conversionRate: 3.5,
    avgOrderValue: 200000,
    revenueGrowth: 15,
    ordersGrowth: 20,
    conversionGrowth: 5,
    avgOrderGrowth: 8,
  },
  revenueTrend: [
    { date: '2026-08-01', revenue: 500000, orders: 5 },
    { date: '2026-08-02', revenue: 750000, orders: 7 },
  ],
  orderStatusBreakdown: [
    { status: 'completed', label: 'Selesai', count: 30, color: '#22c55e' },
    { status: 'pending', label: 'Menunggu', count: 10, color: '#f59e0b' },
  ],
  categoryPerformance: [
    { name: 'Tanaman Hias', revenue: 5000000, orders: 25, growth: 15 },
  ],
  topProducts: [
    { name: 'Monstera', sold: 20, revenue: 1700000, trend: 'up' },
  ],
  customerInsights: {
    newVsRepeat: [
      { count: 35, percentage: 70 },
      { count: 15, percentage: 30 },
    ],
    topCities: [{ city: 'Jakarta', orders: 20 }],
    avgRating: 4.8,
    totalReviews: 45,
  },
  peakHours: [
    { hour: '09:00', orders: 10 },
    { hour: '10:00', orders: 15 },
    { hour: '11:00', orders: 12 },
  ],
  monthlyComparison: [
    { month: 'Jul', revenue: 8000000 },
    { month: 'Agu', revenue: 10000000 },
  ],
}

import SellerAnalytics from '../Analytics'

function renderAnalytics() {
  return render(
    <MemoryRouter>
      <SellerAnalytics />
    </MemoryRouter>
  )
}

describe('Seller Analytics Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetAnalytics.mockReturnValue(new Promise(() => {}))
    renderAnalytics()
    expect(screen.getByText(/memuat analytics/i)).toBeInTheDocument()
  })

  it('renders page title after loading', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/analytics/i)).toBeInTheDocument()
    })
  })

  it('shows overview stats', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText('Total Pendapatan')).toBeInTheDocument()
    })

    expect(screen.getByText('Total Pesanan')).toBeInTheDocument()
    expect(screen.getByText('Conversion Rate')).toBeInTheDocument()
    expect(screen.getByText('Avg Order Value')).toBeInTheDocument()
  })

  it('shows revenue trend chart', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/tren pendapatan/i)).toBeInTheDocument()
    })
  })

  it('shows order status breakdown', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/status pesanan/i)).toBeInTheDocument()
    })
  })

  it('shows category performance', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/performa kategori/i)).toBeInTheDocument()
    })

    expect(screen.getByText('Tanaman Hias')).toBeInTheDocument()
  })

  it('shows top products', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/produk terlaris/i)).toBeInTheDocument()
    })

    expect(screen.getByText('Monstera')).toBeInTheDocument()
  })

  it('shows peak hours', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/jam ramai pesanan/i)).toBeInTheDocument()
    })
  })

  it('shows monthly comparison', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/perbandingan bulanan/i)).toBeInTheDocument()
    })
  })

  it('shows customer insights', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/insight pelanggan/i)).toBeInTheDocument()
    })
  })

  it('shows period filter buttons', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/7 hari/i)).toBeInTheDocument()
    })

    expect(screen.getAllByText(/30 hari/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/3 bulan/i)).toBeInTheDocument()
  })
})
