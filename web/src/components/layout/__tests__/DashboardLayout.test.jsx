import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../../utils/format', () => ({
  cx: (...classes) => classes.filter(Boolean).join(' '),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

import { useAuth } from '../../../context/AuthContext'
import DashboardLayout from '../DashboardLayout'

const sellerNavItems = [
  { to: '/seller', label: 'Dashboard', icon: '📊' },
  { to: '/seller/products', label: 'Produk', icon: '📦' },
  { to: '/seller/orders', label: 'Pesanan', icon: '🧾' },
]

const adminNavItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/users', label: 'Pengguna', icon: '👥' },
]

function renderDashboardLayout(user, role = 'seller', navItems = sellerNavItems) {
  useAuth.mockReturnValue({
    user,
    logout: vi.fn().mockResolvedValue(undefined),
  })

  return render(
    <MemoryRouter initialEntries={role === 'admin' ? ['/admin'] : ['/seller']}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<DashboardLayout role={role} navItems={navItems} />}>
          <Route path={role === 'admin' ? '/admin' : '/seller'} element={<div>Dashboard Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('DashboardLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to login when user is null', () => {
    renderDashboardLayout(null)
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('redirects to home when seller tries to access admin', () => {
    const homeText = 'Home Page'
    const HomeMock = () => <div>{homeText}</div>
    useAuth.mockReturnValue({
      user: { name: 'Budi', role: 'seller' },
      logout: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<HomeMock />} />
          <Route element={<DashboardLayout role="admin" navItems={adminNavItems} />}>
            <Route path="/admin" element={<div>Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText(homeText)).toBeInTheDocument()
  })

  it('redirects to home when customer tries to access seller', () => {
    const homeText = 'Home Page'
    const HomeMock = () => <div>{homeText}</div>
    useAuth.mockReturnValue({
      user: { name: 'Budi', role: 'customer' },
      logout: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/seller']}>
        <Routes>
          <Route path="/" element={<HomeMock />} />
          <Route element={<DashboardLayout role="seller" navItems={sellerNavItems} />}>
            <Route path="/seller" element={<div>Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText(homeText)).toBeInTheDocument()
  })

  it('renders sidebar with brand and panel label', () => {
    renderDashboardLayout({ name: 'Budi', role: 'seller' })
    expect(screen.getByText('Tanamanku')).toBeInTheDocument()
    expect(screen.getByText('Seller Panel')).toBeInTheDocument()
  })

  it('renders admin panel label for admin role', () => {
    renderDashboardLayout({ name: 'Admin', role: 'admin' }, 'admin', adminNavItems)
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })

  it('renders nav items in sidebar', () => {
    renderDashboardLayout({ name: 'Budi', role: 'seller' })
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Produk')).toBeInTheDocument()
    expect(screen.getByText('Pesanan')).toBeInTheDocument()
  })

  it('renders nav item icons', () => {
    renderDashboardLayout({ name: 'Budi', role: 'seller' })
    expect(screen.getByText('📊')).toBeInTheDocument()
    expect(screen.getByText('📦')).toBeInTheDocument()
    expect(screen.getByText('🧾')).toBeInTheDocument()
  })

  it('renders user name and role in topbar', () => {
    renderDashboardLayout({ name: 'Budi', role: 'seller' })
    expect(screen.getByText('Budi')).toBeInTheDocument()
    expect(screen.getByText('seller')).toBeInTheDocument()
  })

  it('renders back to store link', () => {
    renderDashboardLayout({ name: 'Budi', role: 'seller' })
    expect(screen.getByText('Kembali ke Toko')).toBeInTheDocument()
  })

  it('renders child content via Outlet', () => {
    renderDashboardLayout({ name: 'Budi', role: 'seller' })
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
  })

  it('admin can access admin panel', () => {
    renderDashboardLayout({ name: 'Admin', role: 'admin' }, 'admin', adminNavItems)
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })
})
