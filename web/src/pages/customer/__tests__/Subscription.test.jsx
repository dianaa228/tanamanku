import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetPlans = vi.fn()
const mockGetCurrent = vi.fn()
const mockSubscribe = vi.fn()
const mockShowToast = vi.fn()

vi.mock('../../../services/api/subscription', () => ({
  subscriptionApi: {
    getPlans: (...args) => mockGetPlans(...args),
    getCurrent: (...args) => mockGetCurrent(...args),
    getMySubscription: (...args) => mockGetCurrent(...args),
    subscribe: (...args) => mockSubscribe(...args),
  },
}))

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', role: 'customer' },
  }),
}))

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

vi.mock('../../../components/ui/Loading', () => ({
  default: () => <div>Loading...</div>,
}))

vi.mock('../../../components/ui/Button', () => ({
  default: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}))

vi.mock('../../../components/ui/Badge', () => ({
  default: ({ children }) => <span>{children}</span>,
}))

vi.mock('../../../components/ui/Modal', () => ({
  default: ({ open, children }) => open ? <div role="dialog">{children}</div> : null,
}))

vi.mock('../../../utils/format', () => ({
  formatRupiah: (v) => `Rp${(v || 0).toLocaleString('id-ID')}`,
  cx: (...args) => args.filter(Boolean).join(' '),
}))

const mockPlans = [
  { id: 'free', name: 'Free', price: 0, period: 'month', badge: '🌱', description: 'Paket dasar', features: [{ text: '5 tanaman', included: true }, { text: 'Care Reminder', included: true }], popular: false, cta: 'Mulai Gratis' },
  { id: 'plant-care-pro', name: 'Plant Care Pro', price: 49000, period: 'month', badge: '⭐', description: 'Untuk pekebun serius', features: [{ text: 'Unlimited tanaman', included: true }, { text: 'Plant Finder', included: true }], popular: true, cta: 'Pilih Plan' },
  { id: 'seller-pro', name: 'Seller Pro', price: 99000, period: 'month', badge: '🏪', description: 'Untuk seller aktif', features: [{ text: 'Semua fitur Pro', included: true }, { text: 'Analytics', included: true }], popular: false, cta: 'Pilih Plan' },
]

import Subscription from '../Subscription'

function renderSubscription() {
  return render(
    <MemoryRouter>
      <Subscription />
    </MemoryRouter>
  )
}

describe('Subscription Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetPlans.mockReturnValue(new Promise(() => {}))
    mockGetCurrent.mockReturnValue(new Promise(() => {}))
    renderSubscription()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders page title after loading', async () => {
    mockGetPlans.mockResolvedValue({ data: mockPlans })
    mockGetCurrent.mockResolvedValue({ data: null })
    renderSubscription()

    await waitFor(() => {
      expect(screen.getByText(/pilih paket langganan/i)).toBeInTheDocument()
    })
  })

  it('displays plan names', async () => {
    mockGetPlans.mockResolvedValue({ data: mockPlans })
    mockGetCurrent.mockResolvedValue({ data: null })
    renderSubscription()

    await waitFor(() => {
      expect(screen.getByText('Free')).toBeInTheDocument()
    })

    expect(screen.getByText('Plant Care Pro')).toBeInTheDocument()
    expect(screen.getByText('Seller Pro')).toBeInTheDocument()
  })

  it('displays plan prices', async () => {
    mockGetPlans.mockResolvedValue({ data: mockPlans })
    mockGetCurrent.mockResolvedValue({ data: null })
    renderSubscription()

    await waitFor(() => {
      expect(screen.getAllByText(/gratis/i).length).toBeGreaterThanOrEqual(1)
    })

    expect(screen.getByText(/49\.000/i)).toBeInTheDocument()
    expect(screen.getByText(/99\.000/i)).toBeInTheDocument()
  })

  it('shows subscribe buttons', async () => {
    mockGetPlans.mockResolvedValue({ data: mockPlans })
    mockGetCurrent.mockResolvedValue({ data: null })
    renderSubscription()

    await waitFor(() => {
      const buttons = screen.getAllByText(/pilih plan/i)
      expect(buttons.length).toBe(2)
    })
  })

  it('shows popular badge', async () => {
    mockGetPlans.mockResolvedValue({ data: mockPlans })
    mockGetCurrent.mockResolvedValue({ data: null })
    renderSubscription()

    await waitFor(() => {
      expect(screen.getByText(/paling populer/i)).toBeInTheDocument()
    })
  })
})
