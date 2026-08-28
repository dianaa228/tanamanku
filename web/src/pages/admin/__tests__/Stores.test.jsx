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

vi.mock('../../../components/ui/Loading', () => ({ default: ({ label }) => <div>{label || 'Loading...'}</div> }))
vi.mock('../../../components/ui/Badge', () => ({ default: ({ children }) => <span>{children}</span> }))

import AdminStores from '../Stores'

const mockStores = [
  { id: 1, name: 'Toko Hijau', status: 'active', products_count: 15, user: { name: 'Budi' }, created_at: '2026-01-01' },
  { id: 2, name: 'Green House', status: 'pending', products_count: 8, user: { name: 'Sari' }, created_at: '2026-02-01' },
  { id: 3, name: 'Plant Shop', status: 'suspended', products_count: 5, user: { name: 'Andi' }, created_at: '2026-03-01' },
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
    expect(screen.getByText(/memuat data toko/i)).toBeInTheDocument()
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

  it('shows product counts in badges', async () => {
    mockGetStores.mockResolvedValue({ data: mockStores })
    renderStores()

    await waitFor(() => {
      const badges = screen.getAllByText(/15/)
      expect(badges.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('shows store status badges', async () => {
    mockGetStores.mockResolvedValue({ data: mockStores })
    renderStores()

    await waitFor(() => {
      expect(screen.getAllByText(/aktif/i).length).toBeGreaterThanOrEqual(1)
    })
  })

  it('shows verify button for pending stores', async () => {
    mockGetStores.mockResolvedValue({ data: mockStores })
    renderStores()

    await waitFor(() => {
      const verifyButtons = screen.getAllByText(/verifikasi/i)
      expect(verifyButtons.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('shows stats cards', async () => {
    mockGetStores.mockResolvedValue({ data: mockStores })
    renderStores()

    await waitFor(() => {
      expect(screen.getByText('Total Toko')).toBeInTheDocument()
    })
  })

  it('shows view toggle buttons', async () => {
    mockGetStores.mockResolvedValue({ data: mockStores })
    renderStores()

    await waitFor(() => {
      expect(screen.getByText(/tabel/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/kartu/i)).toBeInTheDocument()
  })

  it('shows search input', async () => {
    mockGetStores.mockResolvedValue({ data: mockStores })
    renderStores()

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/cari nama toko/i)).toBeInTheDocument()
    })
  })

  it('does not show verify button for active stores', async () => {
    mockGetStores.mockResolvedValue({ data: [mockStores[0]] })
    renderStores()

    await waitFor(() => {
      expect(screen.getByText('Toko Hijau')).toBeInTheDocument()
    })

    expect(screen.queryByText(/verifikasi toko/i)).not.toBeInTheDocument()
  })
})
