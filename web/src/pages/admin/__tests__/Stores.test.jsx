import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetStores = vi.fn()
const mockVerifyStore = vi.fn()
vi.mock('../../../services/api/admin', () => ({
  adminApi: {
    getStores: (...args) => mockGetStores(...args),
    verifyStore: (...args) => mockVerifyStore(...args),
  },
}))

vi.mock('../../../components/ui/Loading', () => ({ default: () => <div>Loading...</div> }))
vi.mock('../../../components/ui/Badge', () => ({ default: ({ children }) => <span>{children}</span> }))
vi.mock('../../../components/ui/Button', () => ({ default: ({ children, onClick }) => <button onClick={onClick}>{children}</button> }))

import AdminStores from '../Stores'

const mockStores = [
  { id: 1, name: 'Toko Hijau', status: 'active', products_count: 15, user: { name: 'Budi' } },
  { id: 2, name: 'Green House', status: 'pending', products_count: 8, user: { name: 'Sari' } },
  { id: 3, name: 'Plant Shop', status: 'suspended', products_count: 5, user: { name: 'Andi' } },
]

function renderStores() {
  return render(
    <MemoryRouter>
      <AdminStores />
    </MemoryRouter>
  )
}

describe('Admin Stores Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    mockGetStores.mockReturnValue(new Promise(() => {}))
    renderStores()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders store list after loading', async () => {
    mockGetStores.mockResolvedValue({ data: mockStores })
    renderStores()

    await waitFor(() => {
      expect(screen.getByText('Toko Hijau')).toBeInTheDocument()
    })

    expect(screen.getByText('Green House')).toBeInTheDocument()
    expect(screen.getByText('Plant Shop')).toBeInTheDocument()
  })

  it('shows store owner names', async () => {
    mockGetStores.mockResolvedValue({ data: mockStores })
    renderStores()

    await waitFor(() => {
      expect(screen.getByText('Budi')).toBeInTheDocument()
    })

    expect(screen.getByText('Sari')).toBeInTheDocument()
    expect(screen.getByText('Andi')).toBeInTheDocument()
  })

  it('shows product counts', async () => {
    mockGetStores.mockResolvedValue({ data: mockStores })
    renderStores()

    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument()
    })

    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows store status badges', async () => {
    mockGetStores.mockResolvedValue({ data: mockStores })
    renderStores()

    await waitFor(() => {
      expect(screen.getByText(/aktif/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/menunggu/i)).toBeInTheDocument()
    expect(screen.getByText(/suspended/i)).toBeInTheDocument()
  })

  it('shows verify button for pending stores', async () => {
    mockGetStores.mockResolvedValue({ data: mockStores })
    renderStores()

    await waitFor(() => {
      const verifyButtons = screen.getAllByText(/verifikasi/i)
      expect(verifyButtons.length).toBe(1) // Only 1 pending store
    })
  })

  it('shows table headers', async () => {
    mockGetStores.mockResolvedValue({ data: mockStores })
    renderStores()

    await waitFor(() => {
      expect(screen.getByText('Toko')).toBeInTheDocument()
    })

    expect(screen.getByText('Pemilik')).toBeInTheDocument()
    expect(screen.getByText('Produk')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Aksi')).toBeInTheDocument()
  })

  it('shows store emojis', async () => {
    mockGetStores.mockResolvedValue({ data: mockStores })
    renderStores()

    await waitFor(() => {
      const emojis = screen.getAllByText('🏪')
      expect(emojis.length).toBe(mockStores.length)
    })
  })

  it('shows store IDs', async () => {
    mockGetStores.mockResolvedValue({ data: mockStores })
    renderStores()

    await waitFor(() => {
      expect(screen.getByText(/id #1/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/id #2/i)).toBeInTheDocument()
  })

  it('does not show verify button for active stores', async () => {
    mockGetStores.mockResolvedValue({ data: [mockStores[0]] }) // Only active store
    renderStores()

    await waitFor(() => {
      expect(screen.getByText('Toko Hijau')).toBeInTheDocument()
    })

    expect(screen.queryByText(/verifikasi/i)).not.toBeInTheDocument()
  })
})
