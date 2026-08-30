import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../../../utils/format', () => ({
  cx: (...classes) => classes.filter(Boolean).join(' '),
}))

import { useAuth } from '../../../context/AuthContext'
import MobileNavigation from '../MobileNavigation'

function renderMobileNav(user = null) {
  useAuth.mockReturnValue({ user })
  return render(
    <MemoryRouter>
      <MobileNavigation />
    </MemoryRouter>,
  )
}

describe('MobileNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all navigation items', () => {
    renderMobileNav()
    expect(screen.getByText('Beranda')).toBeInTheDocument()
    expect(screen.getByText('Kebunku')).toBeInTheDocument()
    expect(screen.getByText('Komunitas')).toBeInTheDocument()
    expect(screen.getByText('Toko')).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
  })

  it('renders navigation icons', () => {
    renderMobileNav()
    expect(screen.getByText('🏠')).toBeInTheDocument()
    expect(screen.getByText('🪴')).toBeInTheDocument()
    expect(screen.getByText('💬')).toBeInTheDocument()
    expect(screen.getByText('🌿')).toBeInTheDocument()
    expect(screen.getByText('🧑‍🌾')).toBeInTheDocument()
  })

  it('renders 5 navigation items in grid', () => {
    renderMobileNav()
    const grid = screen.getByRole('navigation')
    expect(grid).toBeInTheDocument()
    // 5 NavLink items
    const links = grid.querySelectorAll('a')
    expect(links.length).toBe(5)
  })

  it('links profile to login when not authenticated', () => {
    renderMobileNav()
    const link = screen.getByRole('link', { name: /profil/i })
    expect(link.getAttribute('href')).toBe('/login')
  })

  it('links profile to /profile when authenticated', () => {
    renderMobileNav({ name: 'Budi', role: 'customer' })
    const link = screen.getByRole('link', { name: /profil/i })
    expect(link.getAttribute('href')).toBe('/profile')
  })
})