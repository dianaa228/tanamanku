import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: null, logout: vi.fn() })),
}))

vi.mock('../../../context/CartContext', () => ({
  useCart: vi.fn(() => ({ count: 0 })),
}))

vi.mock('../../../context/ToastContext', () => ({
  useToast: vi.fn(() => ({ showToast: vi.fn() })),
}))

vi.mock('../../../utils/format', () => ({
  cx: (...classes) => classes.filter(Boolean).join(' '),
  formatRupiah: (v) => `Rp${v}`,
  formatDate: (v) => v,
  formatDateTime: (v) => v,
}))

// Stub ScrollToTop
vi.mock('../../ui/ScrollToTop', () => ({ default: () => null }))

import PublicLayout from '../PublicLayout'

function renderPublicLayout() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<div>Page Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('PublicLayout', () => {
  it('renders the Navbar', () => {
    renderPublicLayout()
    expect(screen.getAllByText('Tanamanku').length).toBeGreaterThanOrEqual(1)
  })

  it('renders the Footer', () => {
    renderPublicLayout()
    expect(screen.getByText(/© 2026 Tanamanku/i)).toBeInTheDocument()
  })

  it('renders the MobileNavigation', () => {
    renderPublicLayout()
    expect(screen.getAllByText('Keranjang').length).toBeGreaterThanOrEqual(1)
  })

  it('renders child content via Outlet', () => {
    renderPublicLayout()
    expect(screen.getByText('Page Content')).toBeInTheDocument()
  })

  it('renders newsletter section from Footer', () => {
    renderPublicLayout()
    expect(screen.getByText(/dapatkan tips berkebun mingguan/i)).toBeInTheDocument()
  })

  it('renders navigation links from Navbar', () => {
    renderPublicLayout()
    expect(screen.getAllByText('Beranda').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Jelajahi').length).toBeGreaterThanOrEqual(1)
  })
})
