import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../../context/CartContext', () => ({
  useCart: () => ({
    items: [
      { lineId: '1', name: 'Monstera', slug: 'monstera', price: 145000, qty: 1, variant: '60cm', emoji: '🌿', gradient: 'from-green-400', productId: 1, stock: 12 },
    ],
    count: 1, subtotal: 145000,
    clearCart: vi.fn().mockResolvedValue({}),
  }),
}))

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 1, name: 'Rina', email: 'rina@test.com',
      address: { label: 'Rumah', recipient: 'Rina', phone: '0812', street: 'Jl. Senopati', city: 'Jakarta Selatan', province: 'DKI Jakarta', postalCode: '12190' },
    },
    isAuthenticated: true,
  }),
}))

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}))

vi.mock('../../../services/api/orders', () => ({
  ordersApi: { createOrder: vi.fn().mockResolvedValue({ success: true, data: { id: 'ORD-TEST-001', status: 'pending' } }) },
}))

vi.mock('../../../services/api/payment', () => ({
  createPayment: vi.fn().mockResolvedValue({ success: true, data: { token: 'mock-token', order_id: 'ORD-TEST-001' } }),
  processPayment: vi.fn().mockResolvedValue({ status_code: '200' }),
  PAYMENT_METHODS: [
    { id: 'bank_transfer', name: 'Transfer Bank', icon: '🏦', desc: 'BCA, BRI, BNI, Mandiri' },
    { id: 'echannel', name: 'Virtual Account', icon: '🏧', desc: 'Semua bank VA' },
    { id: 'gopay', name: 'GoPay', icon: '💚', desc: 'Bayar dengan GoPay' },
    { id: 'shopeepay', name: 'ShopeePay', icon: '🛒', desc: 'Bayar dengan ShopeePay' },
    { id: 'qris', name: 'QRIS', icon: '📱', desc: 'Scan QR dari semua e-wallet' },
    { id: 'indomaret', name: 'Indomaret', icon: '🏪', desc: 'Bayar di Indomaret' },
    { id: 'alfamart', name: 'Alfamart', icon: '🏬', desc: 'Bayar di Alfamart' },
    { id: 'credit_card', name: 'Kartu Kredit', icon: '💳', desc: 'Visa, Mastercard, JCB' },
  ],
}))

import Checkout from '../Checkout'

function renderCheckout() {
  return render(
    <MemoryRouter>
      <Checkout />
    </MemoryRouter>
  )
}

describe('Checkout Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders checkout title', () => {
    renderCheckout()
    expect(screen.getByText(/checkout/i)).toBeInTheDocument()
  })

  it('renders address section with user address', () => {
    renderCheckout()
    expect(screen.getByText(/alamat pengiriman/i)).toBeInTheDocument()
    expect(screen.getByText(/rumah.*rina/i)).toBeInTheDocument()
  })

  it('renders shipping section', () => {
    renderCheckout()
    expect(screen.getByText(/metode pengiriman/i)).toBeInTheDocument()
  })

  it('renders payment section', () => {
    renderCheckout()
    expect(screen.getByText(/metode pembayaran/i)).toBeInTheDocument()
    expect(screen.getByText(/transfer bank/i)).toBeInTheDocument()
  })

  it('renders order summary', () => {
    renderCheckout()
    expect(screen.getByText(/ringkasan pesanan/i)).toBeInTheDocument()
    expect(screen.getByText('Monstera')).toBeInTheDocument()
  })

  it('renders subtotal label', () => {
    renderCheckout()
    expect(screen.getByText(/subtotal/i)).toBeInTheDocument()
  })

  it('renders summary heading', () => {
    renderCheckout()
    expect(screen.getByText('Ringkasan Pesanan')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    renderCheckout()
    expect(screen.getByRole('button', { name: /bayar dengan midtrans/i })).toBeInTheDocument()
  })

  it('renders note input', () => {
    renderCheckout()
    expect(screen.getByPlaceholderText(/catatan untuk penjual/i)).toBeInTheDocument()
  })

  it('renders security notice', () => {
    renderCheckout()
    expect(screen.getByText(/transaksi aman via midtrans/i)).toBeInTheDocument()
  })
})
