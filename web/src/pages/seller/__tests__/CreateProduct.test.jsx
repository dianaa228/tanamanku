import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockCreateProduct = vi.fn()
const mockGetCategories = vi.fn()

vi.mock('../../../services/api/seller', () => ({
  sellerApi: {
    createProduct: (...args) => mockCreateProduct(...args),
  },
}))

vi.mock('../../../services/api/products', () => ({
  productsApi: {
    getCategories: (...args) => mockGetCategories(...args),
  },
}))

vi.mock('../../../components/ui/Button', () => ({
  default: ({ children, to, type }) => to ? <a href={to}>{children}</a> : <button type={type}>{children}</button>,
}))

const mockCategories = [
  { id: 1, name: 'Tanaman Hias', icon: '🪴' },
  { id: 2, name: 'Sayuran', icon: '🥬' },
]

import CreateProduct from '../CreateProduct'

function renderCreateProduct() {
  return render(
    <MemoryRouter>
      <CreateProduct />
    </MemoryRouter>
  )
}

describe('Seller CreateProduct Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetCategories.mockResolvedValue({ data: mockCategories })
  })

  it('renders page title', async () => {
    await act(async () => {
      renderCreateProduct()
    })
    expect(screen.getByText(/tambah produk baru/i)).toBeInTheDocument()
  })

  it('renders form fields', async () => {
    await act(async () => {
      renderCreateProduct()
    })
    expect(screen.getByPlaceholderText(/monstera deliciosa/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/deskripsi produk/i)).toBeInTheDocument()
  })

  it('shows price input', async () => {
    await act(async () => {
      renderCreateProduct()
    })
    const priceInputs = screen.getAllByRole('spinbutton')
    expect(priceInputs.length).toBeGreaterThan(0)
  })

  it('shows category select', async () => {
    await act(async () => {
      renderCreateProduct()
    })
    await waitFor(() => {
      expect(screen.getByDisplayValue(/pilih kategori/i)).toBeInTheDocument()
    })
  })

  it('shows care level select', async () => {
    await act(async () => {
      renderCreateProduct()
    })
    expect(screen.getByDisplayValue(/mudah/i)).toBeInTheDocument()
  })

  it('shows submit button', async () => {
    await act(async () => {
      renderCreateProduct()
    })
    expect(screen.getByText(/simpan produk/i)).toBeInTheDocument()
  })

  it('shows cancel link', async () => {
    await act(async () => {
      renderCreateProduct()
    })
    const cancelLink = screen.getByText(/batal/i)
    expect(cancelLink).toHaveAttribute('href', '/seller/products')
  })
})
