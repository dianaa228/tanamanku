import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetDashboard = vi.fn()
vi.mock('../../../services/api/admin', () => ({
  adminApi: { getDashboard: (...args) => mockGetDashboard(...args) },
}))

vi.mock('../../../utils/format', () => ({
  formatRupiah: (v) => `Rp${(v || 0).toLocaleString('id-ID')}`,
}))

vi.mock('../../../types/constants', () => ({
  ORDER_STATUS: {
    pending: { label: 'Baru', icon: '🆕', badge: 'bg-amber-100 text-amber-800' },
    processing: { label: 'Diproses', icon: '📦', badge: 'bg-sky-100 text-sky-700' },
  },
}))

vi.mock('../../../components/ui/Loading', () => ({ default: () => <div>Loading...</div> }))
vi.mock('../../../components/ui/Badge', () => ({ default: ({ children }) => <span>{children}</span> }))

import AdminDashboard from '../Dashboard'

const mockDashboardData = {
  stats: { totalUsers: 150, totalStores: 25, totalProducts: 200, gmv: 50000000, totalOrders: 300, newUsersThisMonth: 12 },
  recentOrders: [
    { id: 'ORD-001', status: 'pending', total: 150000, user: { name: 'Budi' }, store: { name: 'Toko Hijau' } },
    { id: 'ORD-002', status: 'processing', total: 250000, user: { name: 'Sari' }, store: { name: 'Green House' } },
  ],
  userGrowth: [
    { date: '2026-08-16', count: 5 },
    { date: '2026-08-17', count: 8 },
    { date: '2026-08-18', count: 3 },
    { date: '2026-08-19', count: 10 },
    { date: '2026-08-20', count: 7 },
    { date: '2026-08-21', count: 12 },
    { date: '2026-08-22', count: 9 },
  ],
}

function renderDashboard() {
  return render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>
  )
}

describe('Admin Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    mockGetDashboard.mockReturnValue(new Promise(() => {}))
    renderDashboard()
    expect(screen.getByText(/memuat dashboard admin/i)).toBeInTheDocument()
  })

  it('renders stat cards after loading', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('Total Pengguna')).toBeInTheDocument()
    })

    expect(screen.getByText('Total Toko')).toBeInTheDocument()
    expect(screen.getByText('Total Produk')).toBeInTheDocument()
    expect(screen.getByText('GMV')).toBeInTheDocument()
  })

  it('displays correct stat values', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument()
    })

    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
  })

  it('shows user growth chart section', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText(/pertumbuhan pengguna/i)).toBeInTheDocument()
    })
  })

  it('shows summary section', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText(/ringkasan/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/pesanan bulan ini/i)).toBeInTheDocument()
    expect(screen.getByText(/pengguna baru/i)).toBeInTheDocument()
    expect(screen.getByText(/toko aktif/i)).toBeInTheDocument()
  })

  it('shows recent orders section', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText(/pesanan terbaru/i)).toBeInTheDocument()
    })

    expect(screen.getByText('ORD-001')).toBeInTheDocument()
    expect(screen.getByText('ORD-002')).toBeInTheDocument()
  })

  it('shows order store names', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText(/toko hijau/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/green house/i)).toBeInTheDocument()
  })

  it('shows GMV formatted as rupiah', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText(/rp50/i)).toBeInTheDocument()
    })
  })

  it('shows summary stats', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('300')).toBeInTheDocument() // totalOrders
    })

    expect(screen.getByText('12')).toBeInTheDocument() // newUsersThisMonth
    expect(screen.getByText('25')).toBeInTheDocument() // totalStores
  })
})
