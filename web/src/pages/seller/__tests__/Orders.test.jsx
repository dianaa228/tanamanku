import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetOrders = vi.fn()
const mockUpdateOrderStatus = vi.fn()
vi.mock('../../../services/api/seller', () => ({
  sellerApi: {
    getOrders: (...args) => mockGetOrders(...args),
    updateOrderStatus: (...args) => mockUpdateOrderStatus(...args),
  },
}))

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
    cancelled: { label: 'Dibatalkan', icon: '✖️', badge: 'bg-rose-100 text-rose-700' },
  },
}))

vi.mock('../../../components/ui/Loading', () => ({ default: () => <div>Loading...</div> }))
vi.mock('../../../components/ui/Badge', () => ({ default: ({ children }) => <span>{children}</span> }))
vi.mock('../../../components/ui/Button', () => ({ default: ({ children, onClick, size }) => <button onClick={onClick}>{children}</button> }))

import SellerOrders from '../Orders'

const mockOrders = [
  { id: 'ORD-001', status: 'pending', total: 150000, user: { name: 'Budi' }, created_at: '2026-08-22', items: [{ product: { name: 'Monstera' } }] },
  { id: 'ORD-002', status: 'processing', total: 250000, user: { name: 'Sari' }, created_at: '2026-08-21', items: [{ product: { name: 'Aloe Vera' } }] },
  { id: 'ORD-003', status: 'shipped', total: 100000, user: { name: 'Andi' }, created_at: '2026-08-20', items: [{ product: { name: 'Lidah Mertua' } }] },
  { id: 'ORD-004', status: 'completed', total: 300000, user: { name: 'Dina' }, created_at: '2026-08-19', items: [{ product: { name: 'Rose' } }] },
]

function renderOrders() {
  return render(
    <MemoryRouter>
      <SellerOrders />
    </MemoryRouter>
  )
}

describe('Seller Orders Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    mockGetOrders.mockReturnValue(new Promise(() => {}))
    renderOrders()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders orders after loading', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument()
    })

    expect(screen.getByText('ORD-002')).toBeInTheDocument()
    expect(screen.getByText('ORD-003')).toBeInTheDocument()
    expect(screen.getByText('ORD-004')).toBeInTheDocument()
  })

  it('shows all tab buttons', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /semua/i })).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /baru/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /diproses/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dikirim/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /selesai/i })).toBeInTheDocument()
  })

  it('shows order totals', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText('Rp150.000')).toBeInTheDocument()
    })

    expect(screen.getByText('Rp250.000')).toBeInTheDocument()
  })

  it('shows customer names', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText(/budi/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/sari/i)).toBeInTheDocument()
  })

  it('shows order statuses', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText(/baru/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/diproses/i)).toBeInTheDocument()
    expect(screen.getByText(/dikirim/i)).toBeInTheDocument()
    expect(screen.getByText(/selesai/i)).toBeInTheDocument()
  })

  it('shows process button for pending orders', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText(/proses pesanan/i)).toBeInTheDocument()
    })
  })

  it('shows ship button for processing orders', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText(/tandai dikirim/i)).toBeInTheDocument()
    })
  })

  it('shows deliver button for shipped orders', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText(/tandai terkirim/i)).toBeInTheDocument()
    })
  })

  it('shows product names in order items', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText('Monstera')).toBeInTheDocument()
    })

    expect(screen.getByText('Aloe Vera')).toBeInTheDocument()
  })

  it('shows empty state when no orders in tab', async () => {
    mockGetOrders.mockResolvedValue({ data: [] })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText(/tidak ada pesanan di tab ini/i)).toBeInTheDocument()
    })
  })

  it('filters orders when clicking tabs', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderOrders()

    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument()
    })

    // Click "Baru" tab to filter pending orders
    const baruTab = screen.getByRole('button', { name: /baru/i })
    baruTab.click()

    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument()
    })
  })
})
