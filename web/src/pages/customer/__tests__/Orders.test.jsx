import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// Mock all dependencies before importing Orders
vi.mock('../../../services/api/orders', () => ({
  ordersApi: {
    getOrders: vi.fn().mockResolvedValue({
      success: true,
      data: [
        { id: 'ORD-001', date: '2026-08-10T09:15:00', status: 'shipped', items: [{ name: 'Monstera', emoji: '🌿', gradient: 'from-green-400', qty: 1, price: 145000 }], total: 160000 },
        { id: 'ORD-002', date: '2026-08-05T13:40:00', status: 'completed', items: [{ name: 'Pakcoy', emoji: '🥬', gradient: 'from-green-400', qty: 1, price: 25000 }], total: 40000 },
        { id: 'ORD-003', date: '2026-07-28T10:05:00', status: 'pending', items: [{ name: 'Pupuk', emoji: '🧪', gradient: 'from-sky-300', qty: 1, price: 30000 }], total: 45000 },
      ],
    }),
  },
}))

vi.mock('../../../context/CartContext', () => ({
  useCart: () => ({ items: [], count: 0, subtotal: 0 }),
}))
vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}))
vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: null, isAuthenticated: false }),
}))

import Orders from '../Orders'

function renderOrders() {
  return render(
    <MemoryRouter>
      <Orders />
    </MemoryRouter>
  )
}

describe('Orders Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading initially', () => {
    renderOrders()
    expect(screen.getByText(/memuat data/i)).toBeInTheDocument()
  })

  it('renders page title after loading', async () => {
    renderOrders()
    await waitFor(() => {
      expect(screen.getByText(/pesanan saya/i)).toBeInTheDocument()
    })
  })

  it('renders filter tabs', async () => {
    renderOrders()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /semua/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /menunggu/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /dikirim/i })).toBeInTheDocument()
    })
  })

  it('renders orders after loading', async () => {
    renderOrders()
    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument()
      expect(screen.getByText('ORD-002')).toBeInTheDocument()
    })
  })

  it('renders subtitle text', async () => {
    renderOrders()
    await waitFor(() => {
      expect(screen.getByText(/pantau status belanja/i)).toBeInTheDocument()
    })
  })

  it('filters by status tab', async () => {
    const user = userEvent.setup()
    renderOrders()
    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /selesai/i }))

    expect(screen.getByText('ORD-002')).toBeInTheDocument()
    expect(screen.queryByText('ORD-001')).not.toBeInTheDocument()
  })

  it('shows empty state for tab with no orders', async () => {
    const user = userEvent.setup()
    renderOrders()
    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /dibatalkan/i }))

    expect(screen.getByText(/belum ada pesanan/i)).toBeInTheDocument()
  })

  it('shows order status badge', async () => {
    renderOrders()
    await waitFor(() => {
      expect(screen.getByText(/dalam pengiriman/i)).toBeInTheDocument()
    })
  })

  it('shows order total', async () => {
    renderOrders()
    await waitFor(() => {
      expect(screen.getByText(/160.*000/)).toBeInTheDocument()
    })
  })

  it('renders order links', async () => {
    renderOrders()
    await waitFor(() => {
      const links = screen.getAllByRole('link')
      const orderLink = links.find(l => l.getAttribute('href')?.includes('/orders/'))
      expect(orderLink).toBeInTheDocument()
    })
  })

  it('switches back to all tab', async () => {
    const user = userEvent.setup()
    renderOrders()
    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /dikirim/i }))
    expect(screen.queryByText('ORD-002')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /semua/i }))
    expect(screen.getByText('ORD-001')).toBeInTheDocument()
    expect(screen.getByText('ORD-002')).toBeInTheDocument()
  })
})
