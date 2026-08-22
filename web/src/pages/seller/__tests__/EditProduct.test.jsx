import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

const mockGetProducts = vi.fn()
const mockUpdateProduct = vi.fn()
const mockGetCategories = vi.fn()

vi.mock('../../../services/api/seller', () => ({
  sellerApi: {
    getProducts: (...args) => mockGetProducts(...args),
    updateProduct: (...args) => mockUpdateProduct(...args),
  },
}))

vi.mock('../../../services/api/products', () => ({
  productsApi: {
    getCategories: (...args) => mockGetCategories(...args),
  },
}))

vi.mock('../../../components/ui/Loading', () => ({
  default: () => <div>Loading...</div>,
}))

vi.mock('../../../components/ui/Button', () => ({
  default: ({ children, to, type }) => to ? <a href={to}>{children}</a> : <button type={type}>{children}</button>,
}))

const mockProducts = [
  { id: 1, name: 'Monstera Deliciosa', description: 'Tanaman hias populer', price: 85000, stock: 10, category: { id: 1 }, care_level: 'mudah', is_active: true },
]

const mockCategories = [
  { id: 1, name: 'Tanaman Hias', icon: '🪴' },
]

import EditProduct from '../EditProduct'

function renderEditProduct() {
  return render(
    <MemoryRouter initialEntries={['/seller/products/1/edit']}>
      <Routes>
        <Route path="/seller/products/:id/edit" element={<EditProduct />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Seller EditProduct Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetProducts.mockResolvedValue({ data: mockProducts })
    mockGetCategories.mockResolvedValue({ data: mockCategories })
  })

  it('shows loading state initially', () => {
    mockGetProducts.mockReturnValue(new Promise(() => {}))
    mockGetCategories.mockReturnValue(new Promise(() => {}))
    renderEditProduct()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders page title after loading', async () => {
    renderEditProduct()

    await waitFor(() => {
      expect(screen.getByText(/edit produk/i)).toBeInTheDocument()
    })
  })

  it('shows product name in form', async () => {
    renderEditProduct()

    await waitFor(() => {
      expect(screen.getByDisplayValue('Monstera Deliciosa')).toBeInTheDocument()
    })
  })

  it('shows product description', async () => {
    renderEditProduct()

    await waitFor(() => {
      expect(screen.getByDisplayValue('Tanaman hias populer')).toBeInTheDocument()
    })
  })

  it('shows save button', async () => {
    renderEditProduct()

    await waitFor(() => {
      expect(screen.getByText(/simpan perubahan/i)).toBeInTheDocument()
    })
  })

  it('shows cancel link', async () => {
    renderEditProduct()

    await waitFor(() => {
      const cancelLink = screen.getByText(/batal/i)
      expect(cancelLink).toHaveAttribute('href', '/seller/products')
    })
  })

  it('shows active checkbox', async () => {
    renderEditProduct()

    await waitFor(() => {
      expect(screen.getByText(/aktif di marketplace/i)).toBeInTheDocument()
    })
  })
})
