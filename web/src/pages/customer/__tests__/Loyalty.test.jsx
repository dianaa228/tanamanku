import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetProfile = vi.fn()
const mockGetTiers = vi.fn()
const mockGetRewards = vi.fn()
const mockGetHistory = vi.fn()
const mockShowToast = vi.fn()

vi.mock('../../../services/api/loyalty', () => ({
  loyaltyApi: {
    getProfile: (...args) => mockGetProfile(...args),
    getTiers: (...args) => mockGetTiers(...args),
    getRewards: (...args) => mockGetRewards(...args),
    getHistory: (...args) => mockGetHistory(...args),
  },
}))

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

vi.mock('../../../components/ui/Loading', () => ({
  default: () => <div>Loading...</div>,
}))

vi.mock('../../../components/ui/Button', () => ({
  default: ({ children, to, onClick }) => to ? <a href={to}>{children}</a> : <button onClick={onClick}>{children}</button>,
}))

vi.mock('../../../components/ui/Badge', () => ({
  default: ({ children }) => <span>{children}</span>,
}))

vi.mock('../../../utils/format', () => ({
  formatRupiah: (v) => `Rp${(v || 0).toLocaleString('id-ID')}`,
  formatDateTime: (v) => v || '—',
  cx: (...args) => args.filter(Boolean).join(' '),
}))

const mockProfile = {
  points: 2500,
  tier: 'silver',
  totalEarned: 5000,
  expiringPoints: 500,
  expiringDate: '2026-09-30',
}

const mockTiers = [
  { id: 'bronze', name: 'Bronze', minPoints: 0, icon: '🥉', benefits: ['Diskon 5%', 'Free ongkir >100rb'] },
  { id: 'silver', name: 'Silver', minPoints: 1000, icon: '🥈', benefits: ['Diskon 10%', 'Free ongkir >50rb', 'Birthday bonus'] },
  { id: 'gold', name: 'Gold', minPoints: 5000, icon: '🥇', benefits: ['Diskon 15%', 'Free ongkir', 'Priority support', 'Early access'] },
]

const mockHistory = [
  { id: 1, type: 'earn', description: 'Pembelian produk', points: 85, createdAt: '2026-08-20' },
  { id: 2, type: 'earn', description: 'Review produk', points: 50, createdAt: '2026-08-19' },
]

import Loyalty from '../Loyalty'

function renderLoyalty() {
  return render(
    <MemoryRouter>
      <Loyalty />
    </MemoryRouter>
  )
}

describe('Loyalty Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetProfile.mockReturnValue(new Promise(() => {}))
    mockGetTiers.mockReturnValue(new Promise(() => {}))
    mockGetHistory.mockReturnValue(new Promise(() => {}))
    renderLoyalty()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders page title after loading', async () => {
    mockGetProfile.mockResolvedValue({ data: mockProfile })
    mockGetTiers.mockResolvedValue({ data: mockTiers })
    mockGetHistory.mockResolvedValue({ data: mockHistory })
    renderLoyalty()

    await waitFor(() => {
      expect(screen.getByText(/tanamanku rewards/i)).toBeInTheDocument()
    })
  })

  it('displays loyalty points', async () => {
    mockGetProfile.mockResolvedValue({ data: mockProfile })
    mockGetTiers.mockResolvedValue({ data: mockTiers })
    mockGetHistory.mockResolvedValue({ data: mockHistory })
    renderLoyalty()

    await waitFor(() => {
      expect(screen.getByText('2.500')).toBeInTheDocument()
    })
  })

  it('displays current tier', async () => {
    mockGetProfile.mockResolvedValue({ data: mockProfile })
    mockGetTiers.mockResolvedValue({ data: mockTiers })
    mockGetHistory.mockResolvedValue({ data: mockHistory })
    renderLoyalty()

    await waitFor(() => {
      const silverEls = screen.getAllByText('Silver')
      expect(silverEls.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('shows tier benefits', async () => {
    mockGetProfile.mockResolvedValue({ data: mockProfile })
    mockGetTiers.mockResolvedValue({ data: mockTiers })
    mockGetHistory.mockResolvedValue({ data: mockHistory })
    renderLoyalty()

    await waitFor(() => {
      expect(screen.getByText(/tier benefits/i)).toBeInTheDocument()
    })
  })

  it('shows redeem history link', async () => {
    mockGetProfile.mockResolvedValue({ data: mockProfile })
    mockGetTiers.mockResolvedValue({ data: mockTiers })
    mockGetHistory.mockResolvedValue({ data: mockHistory })
    renderLoyalty()

    await waitFor(() => {
      const links = screen.getAllByRole('link')
      const historyLink = links.find(l => l.getAttribute('href') === '/loyalty/history')
      expect(historyLink).toBeTruthy()
    })
  })

  it('shows activity history', async () => {
    mockGetProfile.mockResolvedValue({ data: mockProfile })
    mockGetTiers.mockResolvedValue({ data: mockTiers })
    mockGetHistory.mockResolvedValue({ data: mockHistory })
    renderLoyalty()

    await waitFor(() => {
      expect(screen.getByText(/aktivitas terakhir/i)).toBeInTheDocument()
    })

    const pembelianEls = screen.getAllByText('Pembelian produk')
    expect(pembelianEls.length).toBeGreaterThanOrEqual(1)
    const reviewEls = screen.getAllByText('Review produk')
    expect(reviewEls.length).toBeGreaterThanOrEqual(1)
  })
})
