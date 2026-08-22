import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ProductGrid from '../ProductGrid'

const mockProducts = [
  { id: 1, slug: 'monstera', name: 'Monstera', price: 145000, rating: 4.9, sold: 340, careLevel: 'mudah', storeName: 'Nursery', emoji: '🌿', gradient: 'from-green-400', originalPrice: 175000, reviewCount: 214, stock: 12, tags: [] },
  { id: 2, slug: 'sirih', name: 'Sirih Gading', price: 35000, rating: 4.8, sold: 1200, careLevel: 'mudah', storeName: 'KebunKita', emoji: '🍃', gradient: 'from-lime-300', originalPrice: null, reviewCount: 456, stock: 45, tags: [] },
]

function renderGrid(props = {}) {
  return render(
    <MemoryRouter>
      <ProductGrid products={mockProducts} {...props} />
    </MemoryRouter>
  )
}

describe('ProductGrid', () => {
  it('renders all products', () => {
    renderGrid()
    expect(screen.getByText('Monstera')).toBeInTheDocument()
    expect(screen.getByText('Sirih Gading')).toBeInTheDocument()
  })

  it('renders product cards as links', () => {
    renderGrid()
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(2)
  })

  it('renders empty state when no products', () => {
    renderGrid({ products: [] })
    expect(screen.getByText(/tidak ada produk/i)).toBeInTheDocument()
  })

  it('renders empty state with custom description', () => {
    renderGrid({ products: [], emptyProps: { description: 'Tidak ditemukan' } })
    expect(screen.getByText('Tidak ditemukan')).toBeInTheDocument()
  })

  it('shows clear filter button in empty state', () => {
    const onReset = vi.fn()
    renderGrid({ products: [], emptyProps: { onReset } })
    expect(screen.getByText(/bersihkan filter/i)).toBeInTheDocument()
  })

  it('calls onReset when clear filter clicked', async () => {
    const user = userEvent.setup()
    const onReset = vi.fn()
    renderGrid({ products: [], emptyProps: { onReset } })
    await user.click(screen.getByText(/bersihkan filter/i))
    expect(onReset).toHaveBeenCalled()
  })

  it('applies grid layout', () => {
    const { container } = renderGrid()
    expect(container.firstChild.className).toContain('grid')
  })
})
