import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../../context/CartContext', () => ({
  useCart: vi.fn(),
}))

vi.mock('../../../utils/format', () => ({
  cx: (...classes) => classes.filter(Boolean).join(' '),
}))

import { useCart } from '../../../context/CartContext'
import MobileNavigation from '../MobileNavigation'

function renderMobileNav(cartCount = 0) {
  useCart.mockReturnValue({ count: cartCount })

  return render(
    <MemoryRouter>
      <MobileNavigation />
    </MemoryRouter>,
  )
}

describe('MobileNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all navigation items', () => {
    renderMobileNav()
    expect(screen.getByText('Beranda')).toBeInTheDocument()
    expect(screen.getByText('Jelajahi')).toBeInTheDocument()
    expect(screen.getByText('Exchange')).toBeInTheDocument()
    expect(screen.getByText('Jasa')).toBeInTheDocument()
    expect(screen.getByText('Kebunku')).toBeInTheDocument()
    expect(screen.getByText('Keranjang')).toBeInTheDocument()
  })

  it('renders navigation icons', () => {
    renderMobileNav()
    expect(screen.getByText('🏠')).toBeInTheDocument()
    expect(screen.getByText('🌿')).toBeInTheDocument()
    expect(screen.getByText('🔄')).toBeInTheDocument()
    expect(screen.getByText('🔧')).toBeInTheDocument()
    expect(screen.getByText('🪴')).toBeInTheDocument()
    expect(screen.getByText('🛒')).toBeInTheDocument()
  })

  it('shows cart count badge when count > 0', () => {
    renderMobileNav(5)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows 9+ when cart count exceeds 9', () => {
    renderMobileNav(15)
    expect(screen.getByText('9+')).toBeInTheDocument()
  })

  it('hides cart badge when count is 0', () => {
    renderMobileNav(0)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('renders 6 navigation items in grid', () => {
    renderMobileNav()
    const grid = screen.getByRole('navigation')
    expect(grid).toBeInTheDocument()
    // 6 NavLink items
    const links = grid.querySelectorAll('a')
    expect(links.length).toBe(6)
  })
})
