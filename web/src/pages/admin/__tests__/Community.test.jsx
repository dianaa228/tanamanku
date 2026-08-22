import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetReports = vi.fn()
const mockResolveReport = vi.fn()

vi.mock('../../../services/api/admin', () => ({
  adminApi: {
    getReports: (...args) => mockGetReports(...args),
    resolveReport: (...args) => mockResolveReport(...args),
  },
}))

vi.mock('../../../components/ui/Loading', () => ({
  default: () => <div>Loading...</div>,
}))

vi.mock('../../../components/ui/EmptyState', () => ({
  default: ({ title }) => <div>{title}</div>,
}))

vi.mock('../../../components/ui/Button', () => ({
  default: ({ children, onClick, size }) => <button onClick={onClick}>{children}</button>,
}))

vi.mock('../../../components/ui/Badge', () => ({
  default: ({ children }) => <span>{children}</span>,
}))

vi.mock('../../../utils/format', () => ({
  formatDateTime: (v) => v || '—',
  cx: (...args) => args.filter(Boolean).join(' '),
}))

const mockReports = [
  { id: 1, status: 'open', reason: 'Spam', reporter: { name: 'Budi' }, reportable: { content: 'Jual tanaman murah!' }, created_at: '2026-08-22' },
  { id: 2, status: 'resolved', reason: 'Inappropriate', reporter: { name: 'Sari' }, reportable: { content: 'Konten tidak pantas' }, created_at: '2026-08-21' },
]

import AdminCommunity from '../Community'

function renderCommunity() {
  return render(
    <MemoryRouter>
      <AdminCommunity />
    </MemoryRouter>
  )
}

describe('Admin Community Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetReports.mockReturnValue(new Promise(() => {}))
    renderCommunity()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders page title after loading', async () => {
    mockGetReports.mockResolvedValue({ data: mockReports })
    renderCommunity()

    await waitFor(() => {
      expect(screen.getByText(/laporan terbuka/i)).toBeInTheDocument()
    })
  })

  it('shows open reports count', async () => {
    mockGetReports.mockResolvedValue({ data: mockReports })
    renderCommunity()

    await waitFor(() => {
      expect(screen.getByText(/laporan terbuka \(1\)/i)).toBeInTheDocument()
    })
  })

  it('shows resolved reports count', async () => {
    mockGetReports.mockResolvedValue({ data: mockReports })
    renderCommunity()

    await waitFor(() => {
      expect(screen.getByText(/selesai \(1\)/i)).toBeInTheDocument()
    })
  })

  it('shows report reasons', async () => {
    mockGetReports.mockResolvedValue({ data: mockReports })
    renderCommunity()

    await waitFor(() => {
      expect(screen.getByText(/spam/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/inappropriate/i)).toBeInTheDocument()
  })

  it('shows reporter names', async () => {
    mockGetReports.mockResolvedValue({ data: mockReports })
    renderCommunity()

    await waitFor(() => {
      // Reporter name appears in open reports section
      expect(screen.getByText(/budi/i)).toBeInTheDocument()
    })
  })

  it('shows resolve button for open reports', async () => {
    mockGetReports.mockResolvedValue({ data: mockReports })
    renderCommunity()

    await waitFor(() => {
      expect(screen.getByText(/selesaikan/i)).toBeInTheDocument()
    })
  })

  it('shows empty state when no open reports', async () => {
    mockGetReports.mockResolvedValue({ data: [{ ...mockReports[1] }] })
    renderCommunity()

    await waitFor(() => {
      expect(screen.getByText(/tidak ada laporan terbuka/i)).toBeInTheDocument()
    })
  })
})
