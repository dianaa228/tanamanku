import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock API
const mockGetDashboard = vi.fn()
vi.mock('../../../services/api/seller', () => ({
  sellerApi: { getDashboard: (...args) => mockGetDashboard(...args) },
}))

// Mock format utils
vi.mock('../../../utils/format', () => ({
  formatRupiah: (v) => `Rp${(v || 0).toLocaleString('id-ID')}`,
  formatDateTime: (v) => v || '—',
}))

vi.mock('../../../types/constants', () => ({
  ORDER_STATUS: {
    pending: { label: 'Baru', icon: '🆕', badge: 'bg-amber-100 text-amber-800' },
    processing: { label: 'Diproses', icon: '📦', badge: 'bg-sky-100 text-sky-700' },
    shipped: { label: 'Dikirim', icon: '🚚', badge: 'bg-violet-100 text-violet-700' },
    completed: { label: 'Selesai', icon: '✅', badge: 'bg-leaf-100 text-leaf-700' },
  },
}))

import SellerDashboard from '../Dashboard'

const mockDashboardData = {
  stats: { totalSales: 5000000, totalOrders: 25, newOrders: 3, lowStock: 2 },
  recentOrders: [
    { id: 'ORD-001', status: 'pending', total: 150000, user: { name: 'Budi' }, created_at: '2026-08-22' },
    { id: 'ORD-002', status: 'processing', total: 250000, user: { name: 'Sari' }, created_at: '2026-08-21' },
  ],
  lowStockProducts: [
    { id: 1, name: 'Monstera', stock: 3 },
    { id: 2, name: 'Aloe Vera', stock: 1 },
  ],
  salesChart: [
    { date: '2026-08-16', total: 500000 },
    { date: '2026-08-17', total: 750000 },
    { date: '2026-08-18', total: 300000 },
    { date: '2026-08-19', total: 900000 },
    { date: '2026-08-20', total: 600000 },
    { date: '2026-08-21', total: 1000000 },
    { date: '2026-08-22', total: 800000 },
  ],
}

function renderDashboard() {
  return render(
    <MemoryRouter>
      <SellerDashboard />
    </MemoryRouter>
  )
}

describe('Seller Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetDashboard.mockReturnValue(new Promise(() => {}))
    renderDashboard()
    expect(screen.getByText(/memuat dashboard/i)).toBeInTheDocument()
  })

  it('renders stat cards after loading', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('Total Penjualan')).toBeInTheDocument()
    })

    expect(screen.getByText('Total Pesanan')).toBeInTheDocument()
    expect(screen.getByText('Pesanan Baru')).toBeInTheDocument()
    expect(screen.getByText('Stok Menipis')).toBeInTheDocument()
  })

  it('displays correct stat values', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('Rp5.000.000')).toBeInTheDocument()
    })

    expect(screen.getByText('25')).toBeInTheDocument() // totalOrders
    expect(screen.getByText('3')).toBeInTheDocument() // newOrders
    expect(screen.getByText('2')).toBeInTheDocument() // lowStock
  })

  it('shows sales chart section', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText(/penjualan 7 hari/i)).toBeInTheDocument()
    })
  })

  it('shows low stock section', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText(/stok menipis/i)).toBeInTheDocument()
    })

    expect(screen.getByText('Monstera')).toBeInTheDocument()
    expect(screen.getByText(/sisa 3/i)).toBeInTheDocument()
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

  it('shows inventory link for low stock products', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      const links = screen.getAllByText(/atur/i)
      expect(links.length).toBeGreaterThan(0)
    })
  })

  it('shows all low stock products', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('Monstera')).toBeInTheDocument()
    })

    expect(screen.getByText('Aloe Vera')).toBeInTheDocument()
  })

  it('shows empty state when no low stock products', async () => {
    const data = { ...mockDashboardData, lowStockProducts: [] }
    mockGetDashboard.mockResolvedValue({ data })
    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText(/semua stok aman/i)).toBeInTheDocument()
    })
  })

  it('shows orders link', async () => {
    mockGetDashboard.mockResolvedValue({ data: mockDashboardData })
    renderDashboard()

    await waitFor(() => {
      const link = screen.getByText(/lihat semua/i)
      expect(link).toHaveAttribute('href', '/seller/orders')
    })
  })
})
