import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetDashboard = vi.fn()

vi.mock('../../../services/api/admin', () => ({
  adminApi: {
    getDashboard: (...args) => mockGetDashboard(...args),
  },
}))

vi.mock('../../../components/ui/Loading', () => ({
  default: () => <div>Loading...</div>,
}))

vi.mock('../../../utils/format', () => ({
  formatRupiah: (v) => `Rp${(v || 0).toLocaleString('id-ID')}`,
  cx: (...args) => args.filter(Boolean).join(' '),
}))

const mockDashboardData = {
  stats: {
    gmv: 50000000,
    totalOrders: 250,
    totalProducts: 150,
    totalUsers: 500,
    newUsersThisMonth: 45,
  },
  userGrowth: [
    { date: '2026-08-01', count: 10 },
    { date: '2026-08-08', count: 15 },
    { date: '2026-08-15', count: 20 },
  ],
}

import AdminReports from '../Reports'

function renderReports() {
  return render(
    <MemoryRouter>
      <AdminReports />
    </MemoryRouter>
  )
}

describe('Admin Reports Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetDashboard.mockReturnValue(new Promise(() => {}))
    renderReports()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders page title after loading', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderReports()

    await waitFor(() => {
      expect(screen.getByText(/laporan & analitik platform/i)).toBeInTheDocument()
    })
  })

  it('shows GMV stat', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderReports()

    await waitFor(() => {
      expect(screen.getByText(/total pendapatan platform/i)).toBeInTheDocument()
    })
  })

  it('shows total transactions', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderReports()

    await waitFor(() => {
      expect(screen.getByText(/total transaksi/i)).toBeInTheDocument()
    })

    expect(screen.getByText('250')).toBeInTheDocument()
  })

  it('shows new users stat', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderReports()

    await waitFor(() => {
      expect(screen.getByText(/pengguna baru bulan ini/i)).toBeInTheDocument()
    })

    expect(screen.getByText('45')).toBeInTheDocument()
  })

  it('shows user growth chart', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderReports()

    await waitFor(() => {
      expect(screen.getByText(/pertumbuhan pengguna mingguan/i)).toBeInTheDocument()
    })
  })

  it('shows domain breakdown', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderReports()

    await waitFor(() => {
      expect(screen.getByText('Marketplace')).toBeInTheDocument()
    })

    expect(screen.getByText('Komersial')).toBeInTheDocument()
    expect(screen.getByText('Komunitas')).toBeInTheDocument()
  })
})
