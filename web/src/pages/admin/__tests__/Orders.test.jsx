import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetOrders = vi.fn()

vi.mock('../../../services/api/admin', () => ({
  adminApi: {
    getOrders: (...args) => mockGetOrders(...args),
  },
}))

vi.mock('../../../components/ui/Loading', () => ({
  default: ({ label }) => <div>{label || 'Loading...'}</div>,
}))

vi.mock('../../../components/ui/Badge', () => ({
  default: ({ children }) => <span>{children}</span>,
}))

vi.mock('../../../utils/format', () => ({
  formatRupiah: (v) => `Rp${(v || 0).toLocaleString('id-ID')}`,
  formatDateTime: (v) => v || '—',
  cx: (...args) => args.filter(Boolean).join(' '),
}))

vi.mock('../../../types/constants', () => ({
  ORDER_STATUS: {
    pending: { label: 'Menunggu', icon: '⏳', badge: 'bg-amber-100 text-amber-800' },
    processing: { label: 'Diproses', icon: '📦', badge: 'bg-sky-100 text-sky-700' },
    shipped: { label: 'Dikirim', icon: '🚚', badge: 'bg-violet-100 text-violet-700' },
    completed: { label: 'Selesai', icon: '✅', badge: 'bg-leaf-100 text-leaf-700' },
    cancelled: { label: 'Batal', icon: '❌', badge: 'bg-rose-100 text-rose-700' },
  },
}))

const mockOrders = [
  { id: 'ORD-001', status: 'pending', total: 150000, payment_status: 'pending', user: { name: 'Budi' }, store: { name: 'Green Thumb' }, created_at: '2026-08-22' },
  { id: 'ORD-002', status: 'completed', total: 250000, payment_status: 'paid', user: { name: 'Sari' }, store: { name: 'Taman Segar' }, created_at: '2026-08-21' },
]

import AdminOrders from '../Orders'

function renderOrders() {
  return render(
    <MemoryRouter>
      <AdminOrders />
    </MemoryRouter>
  )
}

describe('Admin Orders Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetOrders.mockReturnValue(new Promise(() => {}))
    renderOrders()
    expect(screen.getByText(/memuat pesanan/i)).toBeInTheDocument()
  })

  it('renders orders after loading', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument()
    })

    expect(screen.getByText('ORD-002')).toBeInTheDocument()
  })

  it('shows filter tabs', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const tabLabels = buttons.map(b => b.textContent).filter(t => t)
      // Check for tab filter buttons with count
      expect(tabLabels.some(t => /menunggu/i.test(t))).toBe(true)
      expect(tabLabels.some(t => /diproses/i.test(t))).toBe(true)
      expect(tabLabels.some(t => /dikirim/i.test(t))).toBe(true)
      expect(tabLabels.some(t => /selesai/i.test(t))).toBe(true)
    })
  })

  it('shows customer names', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText('Budi')).toBeInTheDocument()
    })

    expect(screen.getByText('Sari')).toBeInTheDocument()
  })

  it('shows store names', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText('Green Thumb')).toBeInTheDocument()
    })

    expect(screen.getByText('Taman Segar')).toBeInTheDocument()
  })

  it('shows order totals', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText(/150\.000/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/250\.000/i)).toBeInTheDocument()
  })

  it('shows payment status badges', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText(/pending/i)).toBeInTheDocument()
    })

    expect(screen.getAllByText(/dibayar/i).length).toBeGreaterThanOrEqual(1)
  })

  it('shows table headers', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText('Pesanan')).toBeInTheDocument()
    })

    expect(screen.getByText('Pembeli')).toBeInTheDocument()
    expect(screen.getByText('Toko')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('shows empty state when no orders', async () => {
    mockGetOrders.mockResolvedValue({ data: [] })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText(/tidak ada pesanan/i)).toBeInTheDocument()
    })
  })

  it('shows search input', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/cari id pesanan/i)).toBeInTheDocument()
    })
  })

  it('shows stats cards', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText('Total Pesanan')).toBeInTheDocument()
    })

    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
  })
})
