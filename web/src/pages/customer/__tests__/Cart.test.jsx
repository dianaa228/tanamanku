import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// Mock all contexts and APIs
const mockShowToast = vi.fn()
vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

// Mock CartContext with controllable state
let mockCartItems = []
let mockCartCount = 0
let mockCartSubtotal = 0
const mockUpdateQty = vi.fn().mockResolvedValue({})
const mockRemoveItem = vi.fn().mockResolvedValue({})
const mockClearCart = vi.fn().mockResolvedValue({})

vi.mock('../../../context/CartContext', () => ({
  useCart: () => ({
    items: mockCartItems,
    count: mockCartCount,
    subtotal: mockCartSubtotal,
    updateQty: mockUpdateQty,
    removeItem: mockRemoveItem,
    clearCart: mockClearCart,
  }),
}))

import Cart from '../Cart'

function renderCart() {
  return render(
    <MemoryRouter>
      <Cart />
    </MemoryRouter>
  )
}

describe('Cart Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCartItems = []
    mockCartCount = 0
    mockCartSubtotal = 0
  })

  it('shows empty state when cart is empty', () => {
    renderCart()
    expect(screen.getByText(/keranjangmu masih kosong/i)).toBeInTheDocument()
  })

  it('shows explore link in empty state', () => {
    renderCart()
    const link = screen.getByRole('link', { name: /mulai belanja/i })
    expect(link).toHaveAttribute('href', '/explore')
  })

  it('renders cart with items', () => {
    mockCartItems = [
      { lineId: '1', name: 'Monstera', slug: 'monstera', price: 50000, qty: 2, variant: 'Standard', emoji: '🌿', gradient: 'from-green-400' },
    ]
    mockCartCount = 2
    mockCartSubtotal = 100000

    renderCart()

    expect(screen.getByText('Keranjang Belanja 🛒')).toBeInTheDocument()
    expect(screen.getByText('2 item dalam keranjang')).toBeInTheDocument()
    expect(screen.getByText('Monstera')).toBeInTheDocument()
  })

  it('shows subtotal and shipping in summary', () => {
    mockCartItems = [
      { lineId: '1', name: 'Rose', slug: 'rose', price: 30000, qty: 3, variant: 'Red', emoji: '🌹', gradient: 'from-red-400' },
    ]
    mockCartCount = 3
    mockCartSubtotal = 90000

    renderCart()

    // Check summary section has the right labels
    expect(screen.getByText(/subtotal/i)).toBeInTheDocument()
    expect(screen.getByText(/ongkir/i)).toBeInTheDocument()
    expect(screen.getByText('Ringkasan Belanja')).toBeInTheDocument()
  })

  it('shows checkout link', () => {
    mockCartItems = [
      { lineId: '1', name: 'Test', slug: 'test', price: 10000, qty: 1, variant: 'A', emoji: '🌱', gradient: 'from-green-300' },
    ]
    mockCartCount = 1
    mockCartSubtotal = 10000

    renderCart()

    const checkoutLink = screen.getByRole('link', { name: /lanjut checkout/i })
    expect(checkoutLink).toHaveAttribute('href', '/checkout')
  })

  it('shows continue shopping link', () => {
    mockCartItems = [
      { lineId: '1', name: 'Test', slug: 'test', price: 10000, qty: 1, variant: 'A', emoji: '🌱', gradient: 'from-green-300' },
    ]
    mockCartCount = 1
    mockCartSubtotal = 10000

    renderCart()

    const continueLink = screen.getByRole('link', { name: /lanjut belanja/i })
    expect(continueLink).toHaveAttribute('href', '/explore')
  })

  it('shows product links', () => {
    mockCartItems = [
      { lineId: '1', name: 'Aloe Vera', slug: 'aloe-vera', price: 25000, qty: 1, variant: 'Small', emoji: '🌵', gradient: 'from-green-200' },
    ]
    mockCartCount = 1
    mockCartSubtotal = 25000

    renderCart()

    const productLink = screen.getByRole('link', { name: /aloe vera/i })
    expect(productLink).toHaveAttribute('href', '/product/aloe-vera')
  })

  it('shows quantity buttons', () => {
    mockCartItems = [
      { lineId: '1', name: 'Test', slug: 'test', price: 10000, qty: 2, variant: 'A', emoji: '🌱', gradient: 'from-green-300' },
    ]
    mockCartCount = 2
    mockCartSubtotal = 20000

    renderCart()

    expect(screen.getByRole('button', { name: /kurangi jumlah/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tambah jumlah/i })).toBeInTheDocument()
  })

  it('shows remove button', () => {
    mockCartItems = [
      { lineId: '1', name: 'Test', slug: 'test', price: 10000, qty: 1, variant: 'A', emoji: '🌱', gradient: 'from-green-300' },
    ]
    mockCartCount = 1
    mockCartSubtotal = 10000

    renderCart()

    expect(screen.getByRole('button', { name: /hapus/i })).toBeInTheDocument()
  })

  it('shows clear cart button', () => {
    mockCartItems = [
      { lineId: '1', name: 'Test', slug: 'test', price: 10000, qty: 1, variant: 'A', emoji: '🌱', gradient: 'from-green-300' },
    ]
    mockCartCount = 1
    mockCartSubtotal = 10000

    renderCart()

    expect(screen.getByText('Kosongkan')).toBeInTheDocument()
  })

  it('displays item variant', () => {
    mockCartItems = [
      { lineId: '1', name: 'Test', slug: 'test', price: 10000, qty: 1, variant: 'Premium', emoji: '🌱', gradient: 'from-green-300' },
    ]
    mockCartCount = 1
    mockCartSubtotal = 10000

    renderCart()

    expect(screen.getByText(/premium/i)).toBeInTheDocument()
  })

  it('displays item quantity', () => {
    mockCartItems = [
      { lineId: '1', name: 'Test', slug: 'test', price: 10000, qty: 5, variant: 'A', emoji: '🌱', gradient: 'from-green-300' },
    ]
    mockCartCount = 5
    mockCartSubtotal = 50000

    renderCart()

    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders summary with all sections', () => {
    mockCartItems = [
      { lineId: '1', name: 'A', slug: 'a', price: 50000, qty: 2, variant: 'X', emoji: '🌿', gradient: 'from-green-400' },
      { lineId: '2', name: 'B', slug: 'b', price: 30000, qty: 1, variant: 'Y', emoji: '🌹', gradient: 'from-red-400' },
    ]
    mockCartCount = 3
    mockCartSubtotal = 130000

    renderCart()

    // Check both items are rendered
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    // Check summary structure
    expect(screen.getByText('Ringkasan Belanja')).toBeInTheDocument()
  })
})
