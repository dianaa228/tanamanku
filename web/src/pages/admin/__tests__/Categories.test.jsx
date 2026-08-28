import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetCategories = vi.fn()
const mockCreateCategory = vi.fn()
const mockUpdateCategory = vi.fn()
const mockDeleteCategory = vi.fn()
vi.mock('../../../services/api/admin', () => ({
  adminApi: {
    getCategories: (...args) => mockGetCategories(...args),
    createCategory: (...args) => mockCreateCategory(...args),
    updateCategory: (...args) => mockUpdateCategory(...args),
    deleteCategory: (...args) => mockDeleteCategory(...args),
  },
}))

vi.mock('../../../components/ui/Loading', () => ({ default: ({ label }) => <div>{label || 'Loading...'}</div> }))
vi.mock('../../../components/ui/Button', () => ({ default: ({ children, onClick }) => <button onClick={onClick}>{children}</button> }))
vi.mock('../../../components/ui/Modal', () => ({ default: ({ open, children, title }) => open ? <div role="dialog"><h2>{title}</h2>{children}</div> : null }))

import AdminCategories from '../Categories'

const mockCategories = [
  { id: 1, name: 'Tanaman Hias', slug: 'tanaman-hias', icon: '🪴', products_count: 45 },
  { id: 2, name: 'Sayuran', slug: 'sayuran', icon: '🥬', products_count: 30 },
  { id: 3, name: 'Buah-buahan', slug: 'buah-buahan', icon: '🍎', products_count: 15 },
]

function renderCategories() {
  return render(
    <MemoryRouter>
      <AdminCategories />
    </MemoryRouter>
  )
}

describe('Admin Categories Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.confirm = vi.fn(() => true)
  })

  it('shows loading state', () => {
    mockGetCategories.mockReturnValue(new Promise(() => {}))
    renderCategories()
    expect(screen.getByText(/memuat kategori/i)).toBeInTheDocument()
  })

  it('renders category list after loading', async () => {
    mockGetCategories.mockResolvedValue({ data: mockCategories })
    renderCategories()

    await waitFor(() => {
      expect(screen.getByText('Tanaman Hias')).toBeInTheDocument()
    })

    expect(screen.getByText('Sayuran')).toBeInTheDocument()
    expect(screen.getByText('Buah-buahan')).toBeInTheDocument()
  })

  it('shows add category button', async () => {
    mockGetCategories.mockResolvedValue({ data: mockCategories })
    renderCategories()

    await waitFor(() => {
      expect(screen.getByText(/tambah kategori/i)).toBeInTheDocument()
    })
  })

  it('shows category slugs', async () => {
    mockGetCategories.mockResolvedValue({ data: mockCategories })
    renderCategories()

    await waitFor(() => {
      expect(screen.getByText(/tanaman-hias/i)).toBeInTheDocument()
    })
  })

  it('shows product counts in cards', async () => {
    mockGetCategories.mockResolvedValue({ data: mockCategories })
    renderCategories()

    await waitFor(() => {
      expect(screen.getByText(/45 produk/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/30 produk/i)).toBeInTheDocument()
  })

  it('shows category icons', async () => {
    mockGetCategories.mockResolvedValue({ data: mockCategories })
    renderCategories()

    await waitFor(() => {
      expect(screen.getByText('🪴')).toBeInTheDocument()
    })

    expect(screen.getByText('🥬')).toBeInTheDocument()
    expect(screen.getByText('🍎')).toBeInTheDocument()
  })

  it('shows edit buttons', async () => {
    mockGetCategories.mockResolvedValue({ data: mockCategories })
    renderCategories()

    await waitFor(() => {
      const editButtons = screen.getAllByText(/edit/i)
      expect(editButtons.length).toBe(mockCategories.length)
    })
  })

  it('shows stats cards', async () => {
    mockGetCategories.mockResolvedValue({ data: mockCategories })
    renderCategories()

    await waitFor(() => {
      expect(screen.getByText('Total Kategori')).toBeInTheDocument()
    })

    expect(screen.getByText('Total Produk')).toBeInTheDocument()
  })
})
