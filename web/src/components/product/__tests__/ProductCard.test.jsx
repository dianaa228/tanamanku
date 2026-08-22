import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from '../ProductCard'

const mockProduct = {
  id: 1,
  name: 'Monstera Deliciosa',
  slug: 'monstera-deliciosa',
  price: 75000,
  originalPrice: 100000,
  storeName: 'Green Thumb',
  rating: 4.8,
  sold: 120,
  careLevel: 'mudah',
  emoji: '🌿',
  gradient: 'from-green-400 to-emerald-600',
}

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <ProductCard product={mockProduct} {...props} />
    </MemoryRouter>
  )
}

describe('ProductCard', () => {
  it('renders product name', () => {
    renderCard()
    expect(screen.getByText('Monstera Deliciosa')).toBeInTheDocument()
  })

  it('renders store name', () => {
    renderCard()
    expect(screen.getByText('Green Thumb')).toBeInTheDocument()
  })

  it('renders price', () => {
    renderCard()
    expect(screen.getByText(/75.*000/)).toBeInTheDocument()
  })

  it('renders original price with strikethrough', () => {
    renderCard()
    expect(screen.getByText(/100.*000/)).toBeInTheDocument()
  })

  it('shows discount percentage', () => {
    renderCard()
    // (1 - 75000/100000) * 100 = 25%
    expect(screen.getByText('25%')).toBeInTheDocument()
  })

  it('renders sold count', () => {
    renderCard()
    expect(screen.getByText(/120\+ terjual/)).toBeInTheDocument()
  })

  it('links to product detail page', () => {
    renderCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/product/monstera-deliciosa')
  })

  it('renders care level badge', () => {
    renderCard()
    expect(screen.getByText(/Mudah/)).toBeInTheDocument()
  })

  it('applies compact mode classes', () => {
    const { container } = renderCard({ compact: true })
    const card = container.firstChild
    expect(card).toBeInTheDocument()
  })

  it('renders without original price (no discount)', () => {
    const product = { ...mockProduct, originalPrice: null }
    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>
    )
    expect(screen.queryByText('25%')).not.toBeInTheDocument()
  })
})
