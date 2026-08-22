import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// Mock contexts
vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../../context/CartContext', () => ({
  useCart: vi.fn(),
}))

vi.mock('../../../utils/format', () => ({
  cx: (...classes) => classes.filter(Boolean).join(' '),
}))

vi.mock('../../ui/ScrollToTop', () => ({ default: () => null }))

import { useAuth } from '../../../context/AuthContext'
import { useCart } from '../../../context/CartContext'
import Navbar from '../Navbar'

function renderNavbar(user = null, cartCount = 0) {
  useAuth.mockReturnValue({
    user,
    logout: vi.fn().mockResolvedValue(undefined),
  })
  useCart.mockReturnValue({ count: cartCount })

  return render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  )
}

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the logo and brand name', () => {
    renderNavbar()
    expect(screen.getByText('Tanamanku')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderNavbar()
    expect(screen.getByText('Beranda')).toBeInTheDocument()
    expect(screen.getByText('Jelajahi')).toBeInTheDocument()
    expect(screen.getByText('Nursery')).toBeInTheDocument()
    expect(screen.getByText('Jasa')).toBeInTheDocument()
    expect(screen.getByText('Exchange')).toBeInTheDocument()
    expect(screen.getByText('Kebunku')).toBeInTheDocument()
    expect(screen.getByText('Plant Finder')).toBeInTheDocument()
    expect(screen.getByText('Komunitas')).toBeInTheDocument()
  })

  it('renders search input', () => {
    renderNavbar()
    expect(screen.getByPlaceholderText(/cari tanaman/i)).toBeInTheDocument()
  })

  it('shows cart link', () => {
    renderNavbar()
    expect(screen.getByLabelText('Keranjang')).toBeInTheDocument()
  })

  it('shows login and register links when not authenticated', () => {
    renderNavbar(null)
    expect(screen.getByText('Masuk')).toBeInTheDocument()
    expect(screen.getByText('Daftar')).toBeInTheDocument()
  })

  it('hides login and register when authenticated', () => {
    renderNavbar({ name: 'Budi', email: 'budi@test.com', role: 'customer', avatar: null })
    expect(screen.queryByText('Masuk')).not.toBeInTheDocument()
    expect(screen.queryByText('Daftar')).not.toBeInTheDocument()
  })

  it('shows cart count badge when count > 0', () => {
    renderNavbar(null, 5)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows 99+ when cart count exceeds 99', () => {
    renderNavbar(null, 150)
    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('hides cart badge when count is 0', () => {
    renderNavbar(null, 0)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('shows default avatar when user has no avatar', () => {
    renderNavbar({ name: 'Budi', email: 'budi@test.com', role: 'customer', avatar: null })
    expect(screen.getByText('🧑‍🌾')).toBeInTheDocument()
  })

  it('shows hamburger menu button on mobile', () => {
    renderNavbar()
    expect(screen.getByLabelText('Menu')).toBeInTheDocument()
  })

  it('shows user dropdown items when avatar is clicked', async () => {
    const user = userEvent.setup()
    renderNavbar({ name: 'Budi', email: 'budi@test.com', role: 'customer', avatar: '🌱' })

    // Click avatar to open dropdown
    await user.click(screen.getByText('🌱'))

    expect(screen.getByText('Budi')).toBeInTheDocument()
    expect(screen.getByText('budi@test.com')).toBeInTheDocument()
    expect(screen.getByText(/profil saya/i)).toBeInTheDocument()
    expect(screen.getByText(/pesanan saya/i)).toBeInTheDocument()
    expect(screen.getByText(/keluar/i)).toBeInTheDocument()
  })

  it('shows seller dashboard link for seller role in dropdown', async () => {
    const user = userEvent.setup()
    renderNavbar({ name: 'Seller', email: 'seller@test.com', role: 'seller', avatar: '🌱' })

    await user.click(screen.getByText('🌱'))
    expect(screen.getByText(/seller dashboard/i)).toBeInTheDocument()
  })

  it('shows admin panel link for admin role in dropdown', async () => {
    const user = userEvent.setup()
    renderNavbar({ name: 'Admin', email: 'admin@test.com', role: 'admin', avatar: '🌱' })

    await user.click(screen.getByText('🌱'))
    expect(screen.getByText(/admin panel/i)).toBeInTheDocument()
  })

  it('does not show seller link for customer role', async () => {
    const user = userEvent.setup()
    renderNavbar({ name: 'Budi', email: 'budi@test.com', role: 'customer', avatar: '🌱' })

    await user.click(screen.getByText('🌱'))
    expect(screen.queryByText(/seller dashboard/i)).not.toBeInTheDocument()
  })

  it('has search form that submits', () => {
    renderNavbar()
    const form = screen.getByPlaceholderText(/cari tanaman/i).closest('form')
    expect(form).toBeInTheDocument()
  })
})
