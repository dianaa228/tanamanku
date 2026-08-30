import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetProducts = vi.fn()
const mockGetCategories = vi.fn()
const mockGetPosts = vi.fn()
const mockGetNurseries = vi.fn()

vi.mock('../../../services/api/products', () => ({
  productsApi: {
    getProducts: (...args) => mockGetProducts(...args),
    getCategories: (...args) => mockGetCategories(...args),
  },
}))

vi.mock('../../../services/api/community', () => ({
  communityApi: {
    getPosts: (...args) => mockGetPosts(...args),
  },
}))

vi.mock('../../../services/api/nursery', () => ({
  nurseryApi: {
    getNurseries: (...args) => mockGetNurseries(...args),
  },
}))

vi.mock('../../../utils/format', () => ({
  cx: (...classes) => classes.filter(Boolean).join(' '),
}))

vi.mock('../../../components/ui/Button', () => ({
  default: ({ children, to }) => (to ? <a href={to}>{children}</a> : <button>{children}</button>),
}))

vi.mock('../../../components/product/ProductCard', () => ({
  default: ({ product }) => <div data-testid="product-card">{product.name}</div>,
}))

vi.mock('../../../components/product/ProductVisual', () => ({
  default: ({ emoji }) => <div>{emoji}</div>,
}))

import Home from '../Home'

const mockProducts = [
  { id: 1, name: 'Monstera Deliciosa', slug: 'monstera', price: 85000, emoji: '🪴', gradient: 'from-green-400' },
  { id: 2, name: 'Aloe Vera', slug: 'aloe-vera', price: 25000, emoji: '🌵', gradient: 'from-green-300' },
]

const mockCategories = [
  { slug: 'tanaman-hias', name: 'Tanaman Hias', icon: '🪴', count: 5 },
  { slug: 'sayuran-herbal', name: 'Sayuran & Herbal', icon: '🥬', count: 3 },
  { slug: 'buah', name: 'Buah', icon: '🍓', count: 4 },
  { slug: 'kaktus-premium', name: 'Kaktus Premium', icon: '🌵', count: 6 },
]

const mockPosts = [
  {
    id: 1,
    author: 'Rina',
    avatar: '👩',
    content: 'Kebun tomatku sudah berbuah!',
    emoji: '🍅',
    gradient: 'from-red-400',
    likes: 24,
    comments: [{ id: 1 }],
  },
]

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    mockGetCategories.mockResolvedValue({ data: mockCategories })
    mockGetPosts.mockResolvedValue({ data: mockPosts })
    mockGetNurseries.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }, { id: 3 }] })
  })

  it('shows skeleton while featured products load', () => {
    mockGetProducts.mockReturnValue(new Promise(() => {}))
    renderHome()
    expect(document.querySelector('.skeleton')).toBeInTheDocument()
  })

  it('renders hero section after loading', async () => {
    renderHome()

    await waitFor(() => {
      expect(screen.getByText(/rawat tanamanmu/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/tumbuhkan/i)).toBeInTheDocument()
    expect(screen.getByText(/kebiasaan baik/i)).toBeInTheDocument()
  })

  it('shows stats derived from live data', async () => {
    renderHome()

    // categories count = 5+3+4+6 = 18  → "18+", nurseries = 3 → "3+"
    await waitFor(() => {
      expect(screen.getByText('18+')).toBeInTheDocument()
    })

    expect(screen.getByText('3+')).toBeInTheDocument()
  })

  it('renders featured products', async () => {
    renderHome()

    await waitFor(() => {
      expect(screen.getByText('Monstera Deliciosa')).toBeInTheDocument()
    })

    expect(screen.getByText('Aloe Vera')).toBeInTheDocument()
  })

  it('renders categories from API', async () => {
    renderHome()

    await waitFor(() => {
      expect(screen.getByText('Kaktus Premium')).toBeInTheDocument()
    })

    expect(screen.getByText('Sayuran & Herbal')).toBeInTheDocument()
  })

  it('falls back to curated categories when API is empty', async () => {
    mockGetCategories.mockResolvedValue({ data: [] })
    renderHome()

    await waitFor(() => {
      expect(screen.getByText('Tanaman Hias')).toBeInTheDocument()
    })

    expect(screen.getByText('Peralatan Berkebun')).toBeInTheDocument()
  })

  it('shows smart features section', async () => {
    renderHome()

    await waitFor(() => {
      expect(screen.getByText(/my garden/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/plant finder/i)).toBeInTheDocument()
    expect(screen.getByText(/plant diagnosis/i)).toBeInTheDocument()
  })

  it('renders community posts preview', async () => {
    renderHome()

    await waitFor(() => {
      expect(screen.getByText(/cerita dari para pekebun/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/kebun tomatku/i)).toBeInTheDocument()
  })

  it('shows CTA section', async () => {
    renderHome()

    await waitFor(() => {
      expect(screen.getByText(/siap mengubah/i)).toBeInTheDocument()
    })
  })
})