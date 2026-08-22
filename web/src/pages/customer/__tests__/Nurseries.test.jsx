import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetNurseries = vi.fn()

vi.mock('../../../services/api/nursery', () => ({
  nurseryApi: {
    getNurseries: (...args) => mockGetNurseries(...args),
  },
}))

vi.mock('../../../components/ui/Loading', () => ({
  default: () => <div>Loading...</div>,
}))

vi.mock('../../../components/ui/EmptyState', () => ({
  default: ({ title }) => <div>{title}</div>,
}))

vi.mock('../../../components/ui/Button', () => ({
  default: ({ children, to }) => to ? <a href={to}>{children}</a> : <button>{children}</button>,
}))

vi.mock('../../../components/ui/Badge', () => ({
  default: ({ children }) => <span>{children}</span>,
}))

vi.mock('../../../utils/format', () => ({
  formatRupiah: (v) => `Rp${(v || 0).toLocaleString('id-ID')}`,
  cx: (...args) => args.filter(Boolean).join(' '),
}))

const mockNurseries = [
  { id: 1, name: 'Green Thumb', slug: 'green-thumb', city: 'Jakarta Selatan', description: 'Nursery terlengkap', ratingAvg: 4.8, reviewsCount: 45, productsCount: 60, categories: ['Tanaman Hias', 'Kaktus'], hours: '08:00-17:00', foundedYear: 2020, isOpen: true },
  { id: 2, name: 'Taman Segar', slug: 'taman-segar', city: 'Depok', description: 'Nursery sayuran', ratingAvg: 4.6, reviewsCount: 30, productsCount: 40, categories: ['Sayuran'], hours: '09:00-16:00', foundedYear: 2021, isOpen: false },
]

import Nurseries from '../Nurseries'

function renderNurseries() {
  return render(
    <MemoryRouter>
      <Nurseries />
    </MemoryRouter>
  )
}

describe('Nurseries Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetNurseries.mockReturnValue(new Promise(() => {}))
    renderNurseries()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders page title after loading', async () => {
    mockGetNurseries.mockResolvedValue({ data: mockNurseries })
    renderNurseries()

    await waitFor(() => {
      expect(screen.getByText(/nursery terdekat/i)).toBeInTheDocument()
    })
  })

  it('renders nursery cards', async () => {
    mockGetNurseries.mockResolvedValue({ data: mockNurseries })
    renderNurseries()

    await waitFor(() => {
      expect(screen.getByText('Green Thumb')).toBeInTheDocument()
    })

    expect(screen.getByText('Taman Segar')).toBeInTheDocument()
  })

  it('shows nursery cities', async () => {
    mockGetNurseries.mockResolvedValue({ data: mockNurseries })
    renderNurseries()

    await waitFor(() => {
      const jakartaEls = screen.getAllByText(/jakarta selatan/i)
      expect(jakartaEls.length).toBeGreaterThanOrEqual(1)
    })

    const depokEls = screen.getAllByText(/depok/i)
    expect(depokEls.length).toBeGreaterThanOrEqual(1)
  })

  it('shows nursery ratings', async () => {
    mockGetNurseries.mockResolvedValue({ data: mockNurseries })
    renderNurseries()

    await waitFor(() => {
      expect(screen.getByText('4.8')).toBeInTheDocument()
    })

    expect(screen.getByText('4.6')).toBeInTheDocument()
  })

  it('shows product counts', async () => {
    mockGetNurseries.mockResolvedValue({ data: mockNurseries })
    renderNurseries()

    await waitFor(() => {
      const countEls = screen.getAllByText(/produk/i)
      expect(countEls.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('shows open/closed status', async () => {
    mockGetNurseries.mockResolvedValue({ data: mockNurseries })
    renderNurseries()

    await waitFor(() => {
      expect(screen.getByText(/buka/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/tutup/i)).toBeInTheDocument()
  })

  it('shows search input', async () => {
    mockGetNurseries.mockResolvedValue({ data: mockNurseries })
    renderNurseries()

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/cari nursery/i)).toBeInTheDocument()
    })
  })

  it('shows filter buttons', async () => {
    mockGetNurseries.mockResolvedValue({ data: mockNurseries })
    renderNurseries()

    await waitFor(() => {
      expect(screen.getByText(/semua kota/i)).toBeInTheDocument()
    })

    // Jakarta Selatan appears in both filter button and nursery card
    const jakartaEls = screen.getAllByText(/jakarta selatan/i)
    expect(jakartaEls.length).toBeGreaterThanOrEqual(1)
  })

  it('shows empty state when no nurseries', async () => {
    mockGetNurseries.mockResolvedValue({ data: [] })
    renderNurseries()

    await waitFor(() => {
      expect(screen.getByText(/belum ada nursery/i)).toBeInTheDocument()
    })
  })
})
