import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetServices = vi.fn()

vi.mock('../../../services/api/services', () => ({
  servicesApi: {
    getServices: (...args) => mockGetServices(...args),
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
  formatDateTime: (v) => v || '—',
  durationText: (v) => v || '30 menit',
  cx: (...args) => args.filter(Boolean).join(' '),
}))

vi.mock('../../../types/constants', () => ({
  SERVICE_CATEGORIES: [
    { value: 'konsultasi', label: 'Konsultasi', icon: '🌱' },
    { value: 'perawatan', label: 'Perawatan', icon: '✂️' },
  ],
}))

const mockServices = [
  { id: 1, name: 'Konsultasi Tanaman', description: 'Konsultasi dengan ahli tanaman', price: 50000, category: 'konsultasi', ratingAvg: 4.8, reviewsCount: 12, provider: { name: 'Pak Budi' }, duration: '60 menit', serviceArea: 'Jakarta' },
  { id: 2, name: 'Pemangkasan Profesional', description: 'Jasa pemangkasan tanaman hias', price: 75000, category: 'perawatan', ratingAvg: 4.9, reviewsCount: 8, provider: { name: 'Ibu Sari' }, duration: '45 menit', serviceArea: 'Bandung' },
]

import Services from '../Services'

function renderServices() {
  return render(
    <MemoryRouter>
      <Services />
    </MemoryRouter>
  )
}

describe('Services Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetServices.mockReturnValue(new Promise(() => {}))
    renderServices()
    expect(screen.getByText(/memuat layanan/i)).toBeInTheDocument()
  })

  it('renders page title after loading', async () => {
    mockGetServices.mockResolvedValue({ data: mockServices })
    renderServices()

    await waitFor(() => {
      expect(screen.getByText(/jasa berkebun/i)).toBeInTheDocument()
    })
  })

  it('shows service count', async () => {
    mockGetServices.mockResolvedValue({ data: mockServices })
    renderServices()

    await waitFor(() => {
      expect(screen.getByText(/2 layanan tersedia/i)).toBeInTheDocument()
    })
  })

  it('renders service cards', async () => {
    mockGetServices.mockResolvedValue({ data: mockServices })
    renderServices()

    await waitFor(() => {
      expect(screen.getByText('Konsultasi Tanaman')).toBeInTheDocument()
    })

    expect(screen.getByText('Pemangkasan Profesional')).toBeInTheDocument()
  })

  it('shows service providers', async () => {
    mockGetServices.mockResolvedValue({ data: mockServices })
    renderServices()

    await waitFor(() => {
      expect(screen.getByText(/pak budi/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/ibu sari/i)).toBeInTheDocument()
  })

  it('shows service prices', async () => {
    mockGetServices.mockResolvedValue({ data: mockServices })
    renderServices()

    await waitFor(() => {
      expect(screen.getByText(/50\.000/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/75\.000/i)).toBeInTheDocument()
  })

  it('shows service ratings', async () => {
    mockGetServices.mockResolvedValue({ data: mockServices })
    renderServices()

    await waitFor(() => {
      expect(screen.getByText('4.8')).toBeInTheDocument()
    })

    expect(screen.getByText('4.9')).toBeInTheDocument()
  })

  it('shows filter buttons', async () => {
    mockGetServices.mockResolvedValue({ data: mockServices })
    renderServices()

    await waitFor(() => {
      expect(screen.getByText(/semua/i)).toBeInTheDocument()
    })

    // Konsultasi and Perawatan appear in both filter buttons and card badges
    const konsulEls = screen.getAllByText(/konsultasi/i)
    expect(konsulEls.length).toBeGreaterThanOrEqual(1)
    const perawatanEls = screen.getAllByText(/perawatan/i)
    expect(perawatanEls.length).toBeGreaterThanOrEqual(1)
  })

  it('shows empty state when no services', async () => {
    mockGetServices.mockResolvedValue({ data: [] })
    renderServices()

    await waitFor(() => {
      expect(screen.getByText(/belum ada layanan/i)).toBeInTheDocument()
    })
  })
})
