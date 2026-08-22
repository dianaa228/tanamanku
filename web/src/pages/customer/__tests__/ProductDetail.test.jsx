import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

const mockProduct = {
  id: 1,
  name: 'Monstera Deliciosa',
  slug: 'monstera-deliciosa',
  price: 145000,
  originalPrice: 175000,
  rating: 4.9,
  reviewCount: 214,
  stock: 12,
  sold: 340,
  careLevel: 'mudah',
  storeName: 'Nursery Hijau',
  emoji: '🌿',
  gradient: 'from-green-400 to-emerald-700',
  tags: ['Tanaman Indoor', 'Populer'],
  description: 'Monstera ikonik dengan daun berlubang.',
  benefits: ['Membersihkan udara', 'Cocok untuk pemula'],
  variants: ['Polos 60cm', 'Polos 80cm'],
  related: [
    { id: 2, slug: 'sirih', name: 'Sirih Gading', price: 35000, rating: 4.8, sold: 1200, careLevel: 'mudah', storeName: 'KebunKita', emoji: '🍃', gradient: 'from-lime-300', originalPrice: null, reviewCount: 456, stock: 45, tags: [] },
  ],
}

const mockGetProduct = vi.fn().mockResolvedValue({ success: true, data: mockProduct })

vi.mock('../../../services/api/products', () => ({
  productsApi: {
    getProduct: (...args) => mockGetProduct(...args),
  },
}))

const mockAddItem = vi.fn().mockResolvedValue({})
vi.mock('../../../context/CartContext', () => ({
  useCart: () => ({
    items: [], count: 0, subtotal: 0,
    addItem: (...args) => mockAddItem(...args),
  }),
}))

const mockShowToast = vi.fn()
vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: null, isAuthenticated: false }),
}))

import ProductDetail from '../ProductDetail'

function renderDetail(slug = 'monstera-deliciosa') {
  return render(
    <MemoryRouter initialEntries={[`/product/${slug}`]}>
      <ProductDetail />
    </MemoryRouter>
  )
}

describe('ProductDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading initially', () => {
    renderDetail()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders product name after loading', async () => {
    renderDetail()
    await waitFor(() => {
      // Use heading role to be specific
      expect(screen.getByRole('heading', { name: 'Monstera Deliciosa' })).toBeInTheDocument()
    })
  })

  it('renders breadcrumb navigation', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Beranda')).toHaveAttribute('href', '/')
      expect(screen.getByText('Jelajahi')).toHaveAttribute('href', '/explore')
    })
  })

  it('renders product price', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/145.*000/)).toBeInTheDocument()
    })
  })

  it('renders store name', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/nursery hijau/i)).toBeInTheDocument()
    })
  })

  it('renders sold count', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/340\+ terjual/)).toBeInTheDocument()
    })
  })

  it('renders rating value', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('4.9')).toBeInTheDocument()
    })
  })

  it('renders review count', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/214 ulasan/)).toBeInTheDocument()
    })
  })

  it('renders tags', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Tanaman Indoor')).toBeInTheDocument()
      expect(screen.getByText('Populer')).toBeInTheDocument()
    })
  })

  it('renders variant buttons', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Polos 60cm')).toBeInTheDocument()
      expect(screen.getByText('Polos 80cm')).toBeInTheDocument()
    })
  })

  it('renders add to cart button', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/tambah ke keranjang/i)).toBeInTheDocument()
    })
  })

  it('renders buy now button', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/beli sekarang/i)).toBeInTheDocument()
    })
  })

  it('renders description section', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/deskripsi produk/i)).toBeInTheDocument()
      expect(screen.getByText(/ikonik dengan daun berlubang/i)).toBeInTheDocument()
    })
  })

  it('renders benefits', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Membersihkan udara')).toBeInTheDocument()
      expect(screen.getByText('Cocok untuk pemula')).toBeInTheDocument()
    })
  })

  it('renders reviews section', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/ulasan pembeli/i)).toBeInTheDocument()
    })
  })

  it('renders related products section', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/produk terkait/i)).toBeInTheDocument()
    })
  })

  it('shows login prompt when not authenticated', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/sudah punya akun/i)).toBeInTheDocument()
    })
  })

  it('renders quantity controls', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /kurangi jumlah/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /tambah jumlah/i })).toBeInTheDocument()
    })
  })

  it('shows stock info', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/stok tersedia/i)).toBeInTheDocument()
    })
  })

  it('renders shipping info cards', async () => {
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/pengiriman aman/i)).toBeInTheDocument()
      expect(screen.getByText(/garansi 7 hari/i)).toBeInTheDocument()
      expect(screen.getByText(/chat seller/i)).toBeInTheDocument()
    })
  })

  it('increments quantity on + click', async () => {
    const user = userEvent.setup()
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /tambah jumlah/i }))
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('quantity does not go below 1', async () => {
    const user = userEvent.setup()
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /kurangi jumlah/i }))
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('calls addItem when add to cart clicked', async () => {
    const user = userEvent.setup()
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/tambah ke keranjang/i)).toBeInTheDocument()
    })

    await user.click(screen.getByText(/tambah ke keranjang/i))
    expect(mockAddItem).toHaveBeenCalled()
  })
})
