import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetProducts = vi.fn()
const mockGetPosts = vi.fn()

vi.mock('../../../services/api/products', () => ({
  productsApi: {
    getProducts: (...args) => mockGetProducts(...args),
  },
}))

vi.mock('../../../services/api/community', () => ({
  communityApi: {
    getPosts: (...args) => mockGetPosts(...args),
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
  })

  it('shows skeleton while featured products load', () => {
    mockGetProducts.mockReturnValue(new Promise(() => {}))
    mockGetPosts.mockReturnValue(new Promise(() => {}))
    renderHome()
    expect(document.querySelector('.skeleton')).toBeInTheDocument()
  })

  it('renders hero section after loading', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    mockGetPosts.mockResolvedValue({ data: mockPosts })
    renderHome()

    await waitFor(() => {
      expect(screen.getByText(/rawat tanamanmu/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/tumbuhkan/i)).toBeInTheDocument()
    expect(screen.getByText(/kebiasaan baik/i)).toBeInTheDocument()
  })

  it('shows stats in hero section', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    mockGetPosts.mockResolvedValue({ data: mockPosts })
    renderHome()

    await waitFor(() => {
      expect(screen.getByText('500+')).toBeInTheDocument()
    })

    expect(screen.getByText('120+')).toBeInTheDocument()
    expect(screen.getAllByText('10rb+').length).toBeGreaterThanOrEqual(1)
  })

  it('renders featured products', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    mockGetPosts.mockResolvedValue({ data: mockPosts })
    renderHome()

    await waitFor(() => {
      expect(screen.getByText('Monstera Deliciosa')).toBeInTheDocument()
    })

    expect(screen.getByText('Aloe Vera')).toBeInTheDocument()
  })

  it('renders categories', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    mockGetPosts.mockResolvedValue({ data: mockPosts })
    renderHome()

    await waitFor(() => {
      expect(screen.getByText('Tanaman Hias')).toBeInTheDocument()
    })

    expect(screen.getByText('Sayuran & Herbal')).toBeInTheDocument()
    expect(screen.getByText('Media Tanam')).toBeInTheDocument()
  })

  it('shows smart features section', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    mockGetPosts.mockResolvedValue({ data: mockPosts })
    renderHome()

    await waitFor(() => {
      expect(screen.getByText(/my garden/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/plant finder/i)).toBeInTheDocument()
    expect(screen.getByText(/plant diagnosis/i)).toBeInTheDocument()
  })

  it('renders community posts preview', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    mockGetPosts.mockResolvedValue({ data: mockPosts })
    renderHome()

    await waitFor(() => {
      expect(screen.getByText(/cerita dari para pekebun/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/kebun tomatku/i)).toBeInTheDocument()
  })

  it('shows CTA section', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    mockGetPosts.mockResolvedValue({ data: mockPosts })
    renderHome()

    await waitFor(() => {
      expect(screen.getByText(/siap mengubah/i)).toBeInTheDocument()
    })
  })
})