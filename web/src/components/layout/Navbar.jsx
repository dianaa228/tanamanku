import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import Dropdown, { DropdownItem } from '../ui/Dropdown'
import { cx } from '../../utils/format'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/explore', label: 'Jelajahi' },
  { to: '/my-garden', label: 'Kebunku' },
  { to: '/plant-finder', label: 'Plant Finder' },
  { to: '/community', label: 'Komunitas' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const submitSearch = (e) => {
    e.preventDefault()
    navigate(`/explore${query ? `?q=${encodeURIComponent(query)}` : ''}`)
    setQuery('')
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-leaf-100/70 bg-cream/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-6">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-leaf-500 to-leaf-700 text-lg shadow-soft">
            🌿
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight text-leaf-950 sm:block">
            Tanamanku
          </span>
        </Link>

        {/* Search (desktop) */}
        <form onSubmit={submitSearch} className="hidden flex-1 max-w-md md:block">
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-leaf-900/40">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari tanaman, pot, pupuk..."
              className="w-full rounded-xl border border-leaf-200 bg-white py-2.5 pl-10 pr-4 text-sm text-leaf-950 shadow-sm transition placeholder:text-leaf-900/35 focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-200"
            />
          </div>
        </form>

        {/* Nav links (desktop) */}
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cx(
                  'rounded-xl px-3.5 py-2 text-sm font-semibold transition',
                  isActive ? 'bg-leaf-100 text-leaf-800' : 'text-leaf-900/70 hover:bg-leaf-50 hover:text-leaf-900',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative rounded-xl p-2.5 text-leaf-800 transition hover:bg-leaf-100"
            aria-label="Keranjang"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="20" cy="21" r="1.5" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 animate-pop items-center justify-center rounded-full bg-sun-400 px-1 text-[11px] font-extrabold text-soil-950">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <Dropdown
              trigger={
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-leaf-400 to-leaf-600 text-xl shadow-soft transition hover:scale-105">
                  {user.avatar || '🧑‍🌾'}
                </span>
              }
            >
              <div className="border-b border-leaf-100 px-3 py-2">
                <p className="text-sm font-bold text-leaf-950">{user.name}</p>
                <p className="text-xs text-leaf-900/50">{user.email}</p>
              </div>
              <DropdownItem onClick={() => navigate('/profile')}>👤 Profil saya</DropdownItem>
              <DropdownItem onClick={() => navigate('/orders')}>📦 Pesanan saya</DropdownItem>
              <DropdownItem onClick={() => navigate('/my-garden')}>🪴 Kebunku</DropdownItem>
              <DropdownItem
                className="text-rose-600 hover:bg-rose-50"
                onClick={async () => {
                  await logout()
                  navigate('/')
                }}
              >
                🚪 Keluar
              </DropdownItem>
            </Dropdown>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-leaf-800 transition hover:bg-leaf-50">
                Masuk
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-leaf-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-leaf-700 hover:shadow-lift"
              >
                Daftar
              </Link>
            </div>
          )}

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-xl p-2.5 text-leaf-800 transition hover:bg-leaf-100 md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="animate-fade-in border-t border-leaf-100 bg-cream px-4 py-4 md:hidden">
          <form onSubmit={submitSearch} className="mb-3">
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-leaf-900/40">🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari tanaman, pot, pupuk..."
                className="w-full rounded-xl border border-leaf-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-leaf-400 focus:outline-none"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cx(
                    'rounded-xl px-4 py-3 text-sm font-semibold transition',
                    isActive ? 'bg-leaf-100 text-leaf-800' : 'text-leaf-900/70 hover:bg-leaf-50',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <div className="mt-2 flex gap-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 rounded-xl bg-leaf-50 px-4 py-3 text-center text-sm font-semibold text-leaf-800">
                  Masuk
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 rounded-xl bg-leaf-600 px-4 py-3 text-center text-sm font-semibold text-white">
                  Daftar
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
