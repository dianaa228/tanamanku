import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductFilter from '../ProductFilter'

const categories = [
  { id: 1, name: 'Tanaman Hias', slug: 'tanaman-hias', icon: '🌿', count: 25 },
  { id: 2, name: 'Media Tanam', slug: 'media-tanam', icon: '🪴', count: 12 },
]

const activeFilters = {
  search: '',
  category: '',
  care: '',
  sort: 'relevansi',
}

function renderFilter(overrides = {}) {
  return render(
    <ProductFilter
      categories={categories}
      active={activeFilters}
      onChange={vi.fn()}
      {...overrides}
    />
  )
}

describe('ProductFilter', () => {
  it('renders filter heading', () => {
    renderFilter()
    expect(screen.getByText(/kategori/i)).toBeInTheDocument()
  })

  it('renders all categories', () => {
    renderFilter()
    expect(screen.getByText(/tanaman hias/i)).toBeInTheDocument()
    expect(screen.getByText(/media tanam/i)).toBeInTheDocument()
  })

  it('renders "Semua Produk" button', () => {
    renderFilter()
    expect(screen.getByText(/semua produk/i)).toBeInTheDocument()
  })

  it('renders care level options', () => {
    renderFilter()
    expect(screen.getByText(/mudah/i)).toBeInTheDocument()
    expect(screen.getByText(/sedang/i)).toBeInTheDocument()
    expect(screen.getByText(/sulit/i)).toBeInTheDocument()
  })

  it('calls onChange when category clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderFilter({ onChange })

    await user.click(screen.getByText(/tanaman hias/i))

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'tanaman-hias' })
    )
  })

  it('calls onChange with empty category for "Semua"', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderFilter({ onChange })

    await user.click(screen.getByText(/semua produk/i))

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ category: '' })
    )
  })

  it('calls onChange when care level clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderFilter({ onChange })

    await user.click(screen.getByText(/mudah/i))

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ care: 'mudah' })
    )
  })

  it('shows category count', () => {
    renderFilter()
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('highlights active category', () => {
    renderFilter({
      active: { ...activeFilters, category: 'tanaman-hias' },
    })
    const button = screen.getByText(/tanaman hias/i).closest('button')
    expect(button.className).toContain('bg-leaf-600')
  })
})
