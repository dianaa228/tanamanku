import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetInventory = vi.fn()
const mockUpdateInventory = vi.fn()
vi.mock('../../../services/api/seller', () => ({
  sellerApi: {
    getInventory: (...args) => mockGetInventory(...args),
    updateInventory: (...args) => mockUpdateInventory(...args),
  },
}))

vi.mock('../../../services/api/normalizers', () => ({
  visualFor: () => ({ emoji: '🌿', gradient: 'from-green-400' }),
}))

vi.mock('../../../components/ui/Loading', () => ({ default: () => <div>Loading...</div> }))
vi.mock('../../../components/ui/Button', () => ({ default: ({ children, onClick }) => <button onClick={onClick}>{children}</button> }))

import SellerInventory from '../Inventory'

const mockInventory = [
  { id: 1, name: 'Monstera', price: 150000, stock: 10 },
  { id: 2, name: 'Aloe Vera', price: 50000, stock: 3 },
  { id: 3, name: 'Lidah Mertua', price: 35000, stock: 0 },
  { id: 4, name: 'Rose', price: 25000, stock: 50 },
]

function renderInventory() {
  return render(
    <MemoryRouter>
      <SellerInventory />
    </MemoryRouter>
  )
}

describe('Seller Inventory Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    mockGetInventory.mockReturnValue(new Promise(() => {}))
    renderInventory()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders inventory table after loading', async () => {
    mockGetInventory.mockResolvedValue({ data: mockInventory })
    renderInventory()

    await waitFor(() => {
      expect(screen.getByText('Monstera')).toBeInTheDocument()
    })

    expect(screen.getByText('Aloe Vera')).toBeInTheDocument()
    expect(screen.getByText('Lidah Mertua')).toBeInTheDocument()
    expect(screen.getByText('Rose')).toBeInTheDocument()
  })

  it('shows table headers', async () => {
    mockGetInventory.mockResolvedValue({ data: mockInventory })
    renderInventory()

    await waitFor(() => {
      expect(screen.getByText('Produk')).toBeInTheDocument()
    })

    expect(screen.getByText('Stok')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Aksi')).toBeInTheDocument()
  })

  it('displays correct stock values', async () => {
    mockGetInventory.mockResolvedValue({ data: mockInventory })
    renderInventory()

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument()
    })

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('shows stock status labels', async () => {
    mockGetInventory.mockResolvedValue({ data: mockInventory })
    renderInventory()

    await waitFor(() => {
      expect(screen.getByText(/habis/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/menipis/i)).toBeInTheDocument()
    expect(screen.getByText(/aman/i)).toBeInTheDocument()
  })

  it('shows edit stock buttons', async () => {
    mockGetInventory.mockResolvedValue({ data: mockInventory })
    renderInventory()

    await waitFor(() => {
      const editButtons = screen.getAllByText(/edit stok/i)
      expect(editButtons.length).toBe(mockInventory.length)
    })
  })

  it('shows product prices', async () => {
    mockGetInventory.mockResolvedValue({ data: mockInventory })
    renderInventory()

    await waitFor(() => {
      expect(screen.getByText(/harga: rp150.000/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/harga: rp50.000/i)).toBeInTheDocument()
  })

  it('shows product emojis', async () => {
    mockGetInventory.mockResolvedValue({ data: mockInventory })
    renderInventory()

    await waitFor(() => {
      const emojis = screen.getAllByText('🌿')
      expect(emojis.length).toBe(mockInventory.length)
    })
  })

  it('shows zero stock status correctly', async () => {
    mockGetInventory.mockResolvedValue({ data: [{ id: 1, name: 'Empty', price: 10000, stock: 0 }] })
    renderInventory()

    await waitFor(() => {
      expect(screen.getByText(/habis/i)).toBeInTheDocument()
    })
  })

  it('shows low stock warning', async () => {
    mockGetInventory.mockResolvedValue({ data: [{ id: 1, name: 'Low', price: 10000, stock: 5 }] })
    renderInventory()

    await waitFor(() => {
      expect(screen.getByText(/menipis/i)).toBeInTheDocument()
    })
  })
})
