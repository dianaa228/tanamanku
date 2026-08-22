import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetListings = vi.fn()

vi.mock('../../../services/api/exchange', () => ({
  exchangeApi: {
    getListings: (...args) => mockGetListings(...args),
  },
}))

vi.mock('../../../components/ui/Loading', () => ({
  default: () => <div>Loading...</div>,
}))

vi.mock('../../../components/ui/EmptyState', () => ({
  default: ({ title }) => <div>{title}</div>,
}))

vi.mock('../../../components/ui/Badge', () => ({
  default: ({ children }) => <span>{children}</span>,
}))

vi.mock('../../../utils/format', () => ({
  formatRupiah: (v) => `Rp${(v || 0).toLocaleString('id-ID')}`,
  formatDateTime: (v) => v || '—',
  timeAgo: (v) => v || 'baru saja',
  cx: (...args) => args.filter(Boolean).join(' '),
}))

vi.mock('../../../types/constants', () => ({
  LISTING_TYPES: [
    { value: 'sell', label: 'Jual', icon: '💰' },
    { value: 'exchange', label: 'Tukar', icon: '🔄' },
    { value: 'give', label: 'Gratis', icon: '🎁' },
  ],
}))

const mockListings = [
  { id: 1, title: 'Monstera Deliciosa', description: 'Tanaman sehat dan besar', type: 'sell', price: 50000, species: { name: 'Monstera', scientific_name: 'Monstera deliciosa' }, user: { name: 'Budi' }, offersCount: 3, createdAt: '2026-08-20' },
  { id: 2, title: 'Kaktus Mini', description: 'Dijual, kondisi bagus', type: 'exchange', price: null, species: { name: 'Kaktus', scientific_name: 'Cactus' }, user: { name: 'Sari' }, offersCount: 1, createdAt: '2026-08-19' },
]

import PlantExchange from '../PlantExchange'

function renderPlantExchange() {
  return render(
    <MemoryRouter>
      <PlantExchange />
    </MemoryRouter>
  )
}

describe('PlantExchange Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetListings.mockReturnValue(new Promise(() => {}))
    renderPlantExchange()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders page title after loading', async () => {
    mockGetListings.mockResolvedValue({ data: mockListings })
    renderPlantExchange()

    await waitFor(() => {
      expect(screen.getByText(/plant exchange/i)).toBeInTheDocument()
    })
  })

  it('renders listing cards', async () => {
    mockGetListings.mockResolvedValue({ data: mockListings })
    renderPlantExchange()

    await waitFor(() => {
      expect(screen.getByText('Monstera Deliciosa')).toBeInTheDocument()
    })

    expect(screen.getByText('Kaktus Mini')).toBeInTheDocument()
  })

  it('shows listing prices', async () => {
    mockGetListings.mockResolvedValue({ data: mockListings })
    renderPlantExchange()

    await waitFor(() => {
      expect(screen.getByText(/50\.000/i)).toBeInTheDocument()
    })
  })

  it('shows seller names', async () => {
    mockGetListings.mockResolvedValue({ data: mockListings })
    renderPlantExchange()

    await waitFor(() => {
      expect(screen.getByText(/budi/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/sari/i)).toBeInTheDocument()
  })

  it('shows create listing button', async () => {
    mockGetListings.mockResolvedValue({ data: mockListings })
    renderPlantExchange()

    await waitFor(() => {
      expect(screen.getByText(/buat listing/i)).toBeInTheDocument()
    })
  })

  it('shows type filters', async () => {
    mockGetListings.mockResolvedValue({ data: mockListings })
    renderPlantExchange()

    await waitFor(() => {
      expect(screen.getByText(/semua/i)).toBeInTheDocument()
    })

    // Jual and Tukar appear in both filter buttons and listing type badges
    const jualEls = screen.getAllByText(/jual/i)
    expect(jualEls.length).toBeGreaterThanOrEqual(1)
    const tukarEls = screen.getAllByText(/tukar/i)
    expect(tukarEls.length).toBeGreaterThanOrEqual(1)
  })

  it('shows search input', async () => {
    mockGetListings.mockResolvedValue({ data: mockListings })
    renderPlantExchange()

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/cari tanaman/i)).toBeInTheDocument()
    })
  })

  it('shows empty state when no listings', async () => {
    mockGetListings.mockResolvedValue({ data: [] })
    renderPlantExchange()

    await waitFor(() => {
      expect(screen.getByText(/belum ada listing/i)).toBeInTheDocument()
    })
  })
})
