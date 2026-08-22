import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetProducts = vi.fn()
const mockDeleteProduct = vi.fn()
vi.mock('../../../services/api/seller', () => ({
  sellerApi: {
    getProducts: (...args) => mockGetProducts(...args),
    deleteProduct: (...args) => mockDeleteProduct(...args),
  },
}))

vi.mock('../../../utils/format', () => ({
  formatRupiah: (v) => `Rp${(v || 0).toLocaleString('id-ID')}`,
  cx: (...classes) => classes.filter(Boolean).join(' '),
}))

vi.mock('../../../services/api/normalizers', () => ({
  visualFor: () => ({ emoji: '🌿', gradient: 'from-green-400' }),
}))

vi.mock('../../../components/ui/Loading', () => ({ default: () => <div>Loading...</div> }))
vi.mock('../../../components/ui/Badge', () => ({ default: ({ children }) => <span>{children}</span> }))
vi.mock('../../../components/ui/EmptyState', () => ({ default: ({ title }) => <div>{title}</div> }))
vi.mock('../../../components/ui/Button', () => ({ default: ({ children, to }) => to ? <a href={to}>{children}</a> : <button>{children}</button> }))

import SellerProducts from '../Products'

const mockProducts = [
  { id: 1, name: 'Monstera Deliciosa', price: 150000, stock: 10, is_active: true, category: { name: 'Tanaman Hias' } },
  { id: 2, name: 'Aloe Vera', price: 50000, stock: 25, is_active: true, category: { name: 'Sukulen' } },
  { id: 3, name: 'Lidah Mertua', price: 35000, stock: 0, is_active: false, category: { name: 'Tanaman Hias' } },
]

function renderProducts() {
  return render(
    <MemoryRouter>
      <SellerProducts />
    </MemoryRouter>
  )
}

describe('Seller Products Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.confirm = vi.fn(() => true)
  })

  it('shows loading state', () => {
    mockGetProducts.mockReturnValue(new Promise(() => {}))
    renderProducts()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders product list after loading', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    renderProducts()

    await waitFor(() => {
      expect(screen.getByText('Monstera Deliciosa')).toBeInTheDocument()
    })

    expect(screen.getByText('Aloe Vera')).toBeInTheDocument()
    expect(screen.getByText('Lidah Mertua')).toBeInTheDocument()
  })

  it('shows search input', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    renderProducts()

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/cari produk/i)).toBeInTheDocument()
    })
  })

  it('shows add product button', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    renderProducts()

    await waitFor(() => {
      expect(screen.getByText(/tambah produk/i)).toBeInTheDocument()
    })
  })

  it('shows product prices', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    renderProducts()

    await waitFor(() => {
      expect(screen.getByText('Rp150.000')).toBeInTheDocument()
    })

    expect(screen.getByText('Rp50.000')).toBeInTheDocument()
  })

  it('shows product stock', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    renderProducts()

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument()
    })

    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('shows product status badges', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    renderProducts()

    await waitFor(() => {
      expect(screen.getAllByText(/aktif/i).length).toBeGreaterThanOrEqual(1)
    })

    expect(screen.getAllByText(/nonaktif/i).length).toBeGreaterThanOrEqual(1)
  })

  it('shows category names', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    renderProducts()

    await waitFor(() => {
      expect(screen.getAllByText('Tanaman Hias').length).toBeGreaterThanOrEqual(1)
    })

    expect(screen.getByText('Sukulen')).toBeInTheDocument()
  })

  it('shows edit links', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    renderProducts()

    await waitFor(() => {
      const editLinks = screen.getAllByText(/edit/i)
      expect(editLinks.length).toBeGreaterThan(0)
    })
  })

  it('shows delete buttons', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    renderProducts()

    await waitFor(() => {
      const deleteButtons = screen.getAllByText(/hapus/i)
      expect(deleteButtons.length).toBeGreaterThan(0)
    })
  })

  it('shows empty state when no products', async () => {
    mockGetProducts.mockResolvedValue({ data: [] })
    renderProducts()

    await waitFor(() => {
      expect(screen.getByText(/belum ada produk/i)).toBeInTheDocument()
    })
  })

  it('add product links to create page', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    renderProducts()

    await waitFor(() => {
      const link = screen.getByText(/tambah produk/i)
      expect(link).toHaveAttribute('href', '/seller/products/create')
    })
  })

  it('shows table headers', async () => {
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    renderProducts()

    await waitFor(() => {
      expect(screen.getByText('Produk')).toBeInTheDocument()
    })

    expect(screen.getByText('Harga')).toBeInTheDocument()
    expect(screen.getByText('Stok')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Aksi')).toBeInTheDocument()
  })
})
