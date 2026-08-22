import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetAnalytics = vi.fn()

vi.mock('../../../services/api/adminAnalytics', () => ({
  adminAnalyticsApi: {
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
    totalUsers: 500,
    totalSellers: 25,
    totalProducts: 150,
    totalRevenue: 50000000,
    activeToday: 120,
    newToday: 8,
    totalOrders: 250,
    ordersGrowth: 20,
    usersGrowth: 15,
    sellersGrowth: 10,
    productsGrowth: 12,
    revenueGrowth: 25,
  },
  userGrowth: [
    { month: 'Jan', users: 100, sellers: 5 },
    { month: 'Feb', users: 150, sellers: 8 },
  ],
  revenueByMonth: [
    { month: 'Jan', revenue: 10000000 },
    { month: 'Feb', revenue: 15000000 },
  ],
  topSellers: [
    { name: 'Green Thumb', orders: 50, revenue: 5000000, rating: 4.8 },
  ],
  topCategories: [
    { name: 'Tanaman Hias', percentage: 45, products: 60, revenue: 22500000 },
  ],
  recentActivity: [
    { icon: '🛒', message: 'Pesanan baru', detail: 'ORD-001', time: '5 menit lalu' },
  ],
  systemHealth: {
    apiUptime: 99.9,
    avgResponseTime: 120,
    errorRate: 0.1,
    activeConnections: 45,
    storageUsed: 2.5,
    storageTotal: 10,
  },
  ordersByStatus: [
    { status: 'completed', count: 200 },
    { status: 'pending', count: 30 },
  ],
  dailyOrders: [
    { date: '2026-08-16', orders: 15 },
    { date: '2026-08-17', orders: 20 },
  ],
}

import AdminAnalytics from '../Analytics'

function renderAnalytics() {
  return render(
    <MemoryRouter>
      <AdminAnalytics />
    </MemoryRouter>
  )
}

describe('Admin Analytics Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetAnalytics.mockReturnValue(new Promise(() => {}))
    renderAnalytics()
    expect(screen.getByText(/memuat analytics platform/i)).toBeInTheDocument()
  })

  it('renders page title after loading', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/platform analytics/i)).toBeInTheDocument()
    })
  })

  it('shows overview stats', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText('Total Pengguna')).toBeInTheDocument()
    })

    expect(screen.getByText('Total Seller')).toBeInTheDocument()
    expect(screen.getByText('Total Produk')).toBeInTheDocument()
    expect(screen.getByText('Total Pendapatan')).toBeInTheDocument()
  })

  it('shows quick stats', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText('120')).toBeInTheDocument() // activeToday
    })

    expect(screen.getByText('8')).toBeInTheDocument() // newToday
    expect(screen.getByText('250')).toBeInTheDocument() // totalOrders
  })

  it('shows user growth chart', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/pertumbuhan pengguna/i)).toBeInTheDocument()
    })
  })

  it('shows revenue chart', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/pendapatan bulanan/i)).toBeInTheDocument()
    })
  })

  it('shows top sellers', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/top sellers/i)).toBeInTheDocument()
    })

    expect(screen.getByText('Green Thumb')).toBeInTheDocument()
  })

  it('shows top categories', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/kategori teratas/i)).toBeInTheDocument()
    })

    expect(screen.getByText('Tanaman Hias')).toBeInTheDocument()
  })

  it('shows system health', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/system health/i)).toBeInTheDocument()
    })

    expect(screen.getByText('99.9%')).toBeInTheDocument()
    expect(screen.getByText('120ms')).toBeInTheDocument()
  })

  it('shows daily orders chart', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/pesanan harian/i)).toBeInTheDocument()
    })
  })

  it('shows recent activity', async () => {
    mockGetAnalytics.mockResolvedValue({ data: mockAnalyticsData })
    renderAnalytics()

    await waitFor(() => {
      expect(screen.getByText(/aktivitas terbaru/i)).toBeInTheDocument()
    })

    expect(screen.getByText('Pesanan baru')).toBeInTheDocument()
  })
})
