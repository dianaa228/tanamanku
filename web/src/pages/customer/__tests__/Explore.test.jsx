import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../../services/api/products', () => ({
  productsApi: {
    getCategories: vi.fn().mockResolvedValue({
      success: true,
      data: [
        { id: 1, slug: 'tanaman-hias', name: 'Tanaman Hias', icon: '🪴', count: 24 },
        { id: 2, slug: 'sayuran', name: 'Sayuran', icon: '🥬', count: 18 },
      ],
    }),
    getProducts: vi.fn().mockResolvedValue({
      success: true,
      data: [
        { id: 1, slug: 'monstera', name: 'Monstera', price: 145000, rating: 4.9, sold: 340, careLevel: 'mudah', storeName: 'Nursery', emoji: '🌿', gradient: 'from-green-400', originalPrice: 175000, reviewCount: 214, stock: 12, tags: ['Indoor'] },
        { id: 2, slug: 'sirih', name: 'Sirih Gading', price: 35000, rating: 4.8, sold: 1200, careLevel: 'mudah', storeName: 'KebunKita', emoji: '🍃', gradient: 'from-lime-300', originalPrice: null, reviewCount: 456, stock: 45, tags: ['Gantung'] },
      ],
    }),
  },
}))

vi.mock('../../../context/CartContext', () => ({
  useCart: () => ({ items: [], count: 0, subtotal: 0, addItem: vi.fn() }),
}))
vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}))
vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: null, isAuthenticated: false }),
}))

import Explore from '../Explore'

async function renderExplore(initialEntries = ['/explore']) {
  let result
  await act(async () => {
    result = render(
      <MemoryRouter initialEntries={initialEntries}>
        <Explore />
      </MemoryRouter>,
    )
  })
  // Flush any remaining async state updates
  await act(async () => {})
  return result
}

describe('Explore Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', async () => {
    render(
      <MemoryRouter initialEntries={['/explore']}>
        <Explore />
      </MemoryRouter>,
    )
    // Check loading before async resolves
    expect(screen.getByText(/menyiapkan produk terbaik/i)).toBeInTheDocument()
    // Wait for async to settle to avoid unhandled promise warning
    await waitFor(() => {
      expect(screen.queryByText(/menyiapkan produk terbaik/i)).not.toBeInTheDocument()
    })
  })

  it('renders page title after loading', async () => {
    await renderExplore()
    await waitFor(() => {
      expect(screen.getByText(/jelajahi katalog/i)).toBeInTheDocument()
    })
  })

  it('renders product count after loading', async () => {
    await renderExplore()
    await waitFor(() => {
      expect(screen.getByText(/2 produk ditemukan/i)).toBeInTheDocument()
    })
  })

  it('renders filter sidebar heading', async () => {
    await renderExplore()
    await waitFor(() => {
      expect(screen.getByText('🔎 Filter')).toBeInTheDocument()
    })
  })

  it('renders search input', async () => {
    await renderExplore()
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/cari tanaman/i)).toBeInTheDocument()
    })
  })

  it('renders sort controls', async () => {
    await renderExplore()
    await waitFor(() => {
      const sortElements = screen.getAllByText('Urutkan')
      expect(sortElements.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('renders products after loading', async () => {
    await renderExplore()
    await waitFor(() => {
      expect(screen.getByText('Monstera')).toBeInTheDocument()
      expect(screen.getByText('Sirih Gading')).toBeInTheDocument()
    })
  })

  it('renders categories in filter', async () => {
    await renderExplore()
    await waitFor(() => {
      expect(screen.getByText(/tanaman hias/i)).toBeInTheDocument()
      expect(screen.getByText(/sayuran/i)).toBeInTheDocument()
    })
  })

  it('shows search query in subtitle', async () => {
    await renderExplore(['/explore?q=monstera'])
    await waitFor(() => {
      expect(screen.getByText(/monstera/i)).toBeInTheDocument()
    })
  })

  it('renders product links', async () => {
    await renderExplore()
    await waitFor(() => {
      const links = screen.getAllByRole('link')
      const monsteraLink = links.find(l => l.getAttribute('href') === '/product/monstera')
      expect(monsteraLink).toBeInTheDocument()
    })
  })
})
