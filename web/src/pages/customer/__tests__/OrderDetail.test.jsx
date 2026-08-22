import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mockGetOrder = vi.fn()
const mockCancelOrder = vi.fn()
const mockShowToast = vi.fn()

vi.mock('../../../services/api/orders', () => ({
  ordersApi: {
    getOrder: (...args) => mockGetOrder(...args),
    cancelOrder: (...args) => mockCancelOrder(...args),
  },
}))

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

vi.mock('../../../components/ui/Loading', () => ({
  default: () => <div>Loading...</div>,
}))

vi.mock('../../../components/ui/Button', () => ({
  default: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}))

vi.mock('../../../components/ui/Badge', () => ({
  default: ({ children }) => <span>{children}</span>,
}))

vi.mock('../../../components/product/ProductVisual', () => ({
  default: ({ emoji }) => <div>{emoji}</div>,
}))

vi.mock('../../../utils/format', () => ({
  formatRupiah: (v) => `Rp${(v || 0).toLocaleString('id-ID')}`,
  formatDateTime: (v) => v || '—',
  formatDate: (v) => v || '—',
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
  ORDER_FLOW: ['pending', 'processing', 'shipped', 'completed'],
}))

const mockOrder = {
  id: 'ORD-001',
  status: 'pending',
  date: '2026-08-22T10:00:00Z',
  items: [
    { id: 1, name: 'Monstera Deliciosa', slug: 'monstera', qty: 1, price: 135000, emoji: '🪴', variant: 'Standard', productId: 1 },
  ],
  payment: { method: 'Transfer Bank BCA', reference: 'INV-001' },
  shipment: { courier: 'JNE Reguler', tracking: '—', eta: '3-5 hari' },
  address: { label: 'Rumah', recipient: 'Budi', street: 'Jl. Sudirman 123', district: 'Setiabudi', city: 'Jakarta Selatan', province: 'DKI Jakarta', postalCode: '12190' },
  subtotal: 135000,
  shippingCost: 15000,
  discount: 0,
  total: 150000,
}

import OrderDetail from '../OrderDetail'

function renderOrderDetail() {
  return render(
    <MemoryRouter initialEntries={['/orders/ORD-001']}>
      <Routes>
        <Route path="/orders/:id" element={<OrderDetail />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('OrderDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetOrder.mockReturnValue(new Promise(() => {}))
    renderOrderDetail()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders order ID after loading', async () => {
    mockGetOrder.mockResolvedValue({ data: mockOrder })
    renderOrderDetail()

    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument()
    })
  })

  it('shows order items', async () => {
    mockGetOrder.mockResolvedValue({ data: mockOrder })
    renderOrderDetail()

    await waitFor(() => {
      expect(screen.getByText('Monstera Deliciosa')).toBeInTheDocument()
    })
  })

  it('shows order total', async () => {
    mockGetOrder.mockResolvedValue({ data: mockOrder })
    renderOrderDetail()

    await waitFor(() => {
      expect(screen.getByText(/150\.000/i)).toBeInTheDocument()
    })
  })

  it('shows payment method', async () => {
    mockGetOrder.mockResolvedValue({ data: mockOrder })
    renderOrderDetail()

    await waitFor(() => {
      expect(screen.getByText(/transfer bank bca/i)).toBeInTheDocument()
    })
  })
})
