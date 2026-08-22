import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockLogout = vi.fn()
const mockShowToast = vi.fn()

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      name: 'Rina Kartika',
      email: 'rina@tanamanku.id',
      phone: '08123456789',
      role: 'customer',
      avatar: '👩‍🌾',
      memberSince: '2026-01-15',
      address: { label: 'Rumah', city: 'Jakarta' },
      stats: { plants: 5, orders: 12, posts: 3 },
    },
    logout: mockLogout,
  }),
}))

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

vi.mock('../../../components/ui/Input', () => ({
  default: ({ label, value, onChange }) => (
    <input aria-label={label} value={value} onChange={onChange} />
  ),
}))

vi.mock('../../../components/ui/Button', () => ({
  default: ({ children, to, onClick, variant }) => to ? <a href={to}>{children}</a> : <button onClick={onClick}>{children}</button>,
}))

vi.mock('../../../components/ui/Badge', () => ({
  default: ({ children }) => <span>{children}</span>,
}))

vi.mock('../../../utils/format', () => ({
  formatDate: (v) => v || '—',
  cx: (...args) => args.filter(Boolean).join(' '),
}))

import Profile from '../Profile'

function renderProfile() {
  return render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  )
}

describe('Profile Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders profile title', () => {
    renderProfile()
    expect(screen.getByText(/profil saya/i)).toBeInTheDocument()
  })

  it('displays user name', () => {
    renderProfile()
    expect(screen.getByText('Rina Kartika')).toBeInTheDocument()
  })

  it('displays user email', () => {
    renderProfile()
    expect(screen.getByText(/rina@tanamanku\.id/i)).toBeInTheDocument()
  })

  it('displays user phone', () => {
    renderProfile()
    expect(screen.getByText(/08123456789/i)).toBeInTheDocument()
  })

  it('displays user avatar', () => {
    renderProfile()
    expect(screen.getByText('👩‍🌾')).toBeInTheDocument()
  })

  it('displays user role', () => {
    renderProfile()
    expect(screen.getByText('customer')).toBeInTheDocument()
  })

  it('displays member since date', () => {
    renderProfile()
    expect(screen.getByText(/bergabung sejak/i)).toBeInTheDocument()
  })

  it('shows edit profile button', () => {
    renderProfile()
    expect(screen.getByText(/edit profil/i)).toBeInTheDocument()
  })

  it('displays user stats', () => {
    renderProfile()
    expect(screen.getByText('5')).toBeInTheDocument() // plants
    expect(screen.getByText('12')).toBeInTheDocument() // orders
    expect(screen.getByText('3')).toBeInTheDocument() // posts
  })

  it('shows stat labels', () => {
    renderProfile()
    expect(screen.getByText('Tanaman')).toBeInTheDocument()
    expect(screen.getByText('Pesanan')).toBeInTheDocument()
    expect(screen.getByText('Post')).toBeInTheDocument()
  })

  it('shows navigation menu items', () => {
    renderProfile()
    expect(screen.getByText(/pesanan saya/i)).toBeInTheDocument()
    expect(screen.getByText(/my garden/i)).toBeInTheDocument()
    expect(screen.getByText(/plant finder/i)).toBeInTheDocument()
    expect(screen.getByText(/plant diagnosis/i)).toBeInTheDocument()
    expect(screen.getByText(/komunitas/i)).toBeInTheDocument()
  })

  it('shows logout button', () => {
    renderProfile()
    expect(screen.getByText(/keluar dari akun/i)).toBeInTheDocument()
  })

  it('shows stats cards', () => {
    renderProfile()
    expect(screen.getByText('Tanaman')).toBeInTheDocument()
    expect(screen.getByText('Pesanan')).toBeInTheDocument()
    expect(screen.getByText('Post')).toBeInTheDocument()
  })
})
