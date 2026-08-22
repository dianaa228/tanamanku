import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from '../CartContext'

// Mock the cart API
vi.mock('../../services/api/cart', () => ({
  cartApi: {
    fetchCart: vi.fn().mockResolvedValue({ success: true, data: { items: [] } }),
    addItem: vi.fn().mockResolvedValue({ success: true, data: { items: [] } }),
    updateQty: vi.fn().mockResolvedValue({ success: true, data: { items: [] } }),
    removeItem: vi.fn().mockResolvedValue({ success: true, data: { items: [] } }),
    clear: vi.fn().mockResolvedValue({ success: true, data: { items: [] } }),
  },
}))

vi.mock('../../services/api/client', () => ({
  apiMode: vi.fn(() => 'mock'),
  onModeChange: vi.fn(() => () => {}),
}))

// Test component
function TestComponent() {
  const { items, count, subtotal, ready } = useCart()
  return (
    <div>
      <span data-testid="ready">{ready ? 'yes' : 'no'}</span>
      <span data-testid="count">{count}</span>
      <span data-testid="subtotal">{subtotal}</span>
      <span data-testid="items-length">{items.length}</span>
    </div>
  )
}

describe('CartContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides initial empty state', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('ready')).toHaveTextContent('yes')
    })

    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('subtotal')).toHaveTextContent('0')
    expect(screen.getByTestId('items-length')).toHaveTextContent('0')
  })

  it('loads cart from API on mount', async () => {
    const { cartApi } = await import('../../services/api/cart')
    cartApi.fetchCart.mockResolvedValue({
      success: true,
      data: {
        items: [
          { lineId: '1', qty: 2, price: 50000 },
          { lineId: '2', qty: 1, price: 30000 },
        ],
      },
    })

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('3')
    })

    expect(screen.getByTestId('subtotal')).toHaveTextContent('130000')
    expect(screen.getByTestId('items-length')).toHaveTextContent('2')
  })

  it('throws when useCart is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    function BadComponent() {
      useCart()
      return null
    }

    expect(() => render(<BadComponent />)).toThrow(/useCart harus dipakai di dalam <CartProvider>/)

    consoleSpy.mockRestore()
  })

  it('sets ready to true after fetch completes', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('ready')).toHaveTextContent('yes')
    })
  })

  it('handles fetch cart failure gracefully', async () => {
    const { cartApi } = await import('../../services/api/cart')
    cartApi.fetchCart.mockRejectedValue(new Error('Network error'))

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('ready')).toHaveTextContent('yes')
    })

    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })
})
