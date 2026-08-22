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
  default: () => <div>Loading...</div>,
}))

vi.mock('../../../components/ui/Badge', () => ({
  default: ({ children }) => <span>{children}</span>,
}))

vi.mock('../../../utils/format', () => ({
  formatRupiah: (v) => `Rp${(v || 0).toLocaleString('id-ID')}`,
  formatDateTime: (v) => v || '—',
  cx: (...args) => args.filter(Boolean).join(' '),
}))

const mockOrders = [
  { id: 'ORD-001', status: 'pending', total: 150000, payment_status: 'pending', user: { name: 'Budi' }, created_at: '2026-08-22' },
  { id: 'ORD-002', status: 'completed', total: 250000, payment_status: 'paid', user: { name: 'Sari' }, created_at: '2026-08-21' },
]

import AdminPayments from '../Payments'

function renderPayments() {
  return render(
    <MemoryRouter>
      <AdminPayments />
    </MemoryRouter>
  )
}

describe('Admin Payments Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetOrders.mockReturnValue(new Promise(() => {}))
    renderPayments()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders page title after loading', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderPayments()

    await waitFor(() => {
      expect(screen.getByText(/monitor pembayaran/i)).toBeInTheDocument()
    })
  })

  it('shows payment orders', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderPayments()

    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument()
    })

    expect(screen.getByText('ORD-002')).toBeInTheDocument()
  })

  it('shows customer names', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderPayments()

    await waitFor(() => {
      expect(screen.getByText('Budi')).toBeInTheDocument()
    })

    expect(screen.getByText('Sari')).toBeInTheDocument()
  })

  it('shows payment status badges', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderPayments()

    await waitFor(() => {
      expect(screen.getByText(/dibayar/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/pending/i)).toBeInTheDocument()
  })

  it('shows order amounts', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderPayments()

    await waitFor(() => {
      expect(screen.getByText(/150\.000/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/250\.000/i)).toBeInTheDocument()
  })

  it('shows table headers', async () => {
    mockGetOrders.mockResolvedValue({ data: mockOrders })
    renderPayments()

    await waitFor(() => {
      expect(screen.getByText('Pesanan')).toBeInTheDocument()
    })

    expect(screen.getByText('Pembeli')).toBeInTheDocument()
    expect(screen.getByText('Jumlah')).toBeInTheDocument()
    expect(screen.getByText('Status Bayar')).toBeInTheDocument()
  })
})
