import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import Dropdown, { DropdownItem } from '../ui/Dropdown'
import { cx } from '../../utils/format'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/explore', label: 'Toko' },
  { to: '/my-garden', label: 'Kebunku' },
  { to: '/community', label: 'Komunitas' },
]

const topLinks = [
  { to: '/nurseries', label: 'Nursery' },
  { to: '/services', label: 'Jasa' },
  { to: '/plant-exchange', label: 'Tukar Tanaman' },
  { to: '/plant-finder', label: 'Plant Finder' },
  { to: '/plant-diagnosis', label: 'Diagnosis' },
]

const roleConfig = {
  admin: { icon: '🛡️', label: 'Admin', color: 'bg-sage-100 text-sage-700 ring-sage-200' },
  seller: { icon: '🏪', label: 'Seller', color: 'bg-terra-100 text-terra-700 ring-terra-200' },
  customer: { icon: '🧑‍🌾', label: 'Pembeli', color: 'bg-leaf-100 text-leaf-700 ring-leaf-200' },
}

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
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-8">
        {/* Logo */}
        <Link to="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-leaf-600 to-leaf-800 text-lg text-cream shadow-soft transition group-hover:shadow-lift">
            🌿
          </span>
          <span className="hidden text-xl font-bold tracking-tight sm:block">
            <span className="text-forest">Tana</span>
            <span className="text-gradient-botanical display">manku</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={submitSearch} className="hidden flex-1 max-w-md lg:block">
          <div className="relative group">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light transition group-focus-within:text-leaf-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari tanaman, pot, pupuk..."
              className="w-full rounded-full border border-sage-200 bg-white/80 py-2.5 pl-11 pr-4 text-sm text-forest shadow-soft backdrop-blur-sm transition placeholder:text-muted-light/60 focus:border-leaf-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-leaf-100/70"
            />
          </div>
        </form>

        {/* Nav links (desktop) */}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cx(
                  'relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-leaf-700 text-cream shadow-soft'
                    : 'text-muted hover:bg-leaf-50 hover:text-forest',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}

          {/* Lainnya grouped dropdown */}
          <Dropdown
            trigger={
              <button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-muted transition hover:bg-leaf-50 hover:text-forest">
                Lainnya
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            }
          >
            {topLinks.map((l) => (
              <DropdownItem key={l.to} onClick={() => navigate(l.to)}>
                {l.label}
              </DropdownItem>
            ))}
          </Dropdown>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          {/* Cart */}
          <Link to="/cart" className="relative rounded-full p-2.5 text-muted transition hover:bg-leaf-50 hover:text-forest" aria-label="Keranjang">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="20" cy="21" r="1.5" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 animate-pop items-center justify-center rounded-full bg-terra-500 px-1 text-[11px] font-extrabold text-white shadow-soft">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <Dropdown
              trigger={
                <div className="flex cursor-pointer items-center gap-2">
                  {roleConfig[user.role] && (
                    <span className={`hidden items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset sm:flex ${roleConfig[user.role].color}`}>
                      <span>{roleConfig[user.role].icon}</span>
                      <span>{roleConfig[user.role].label}</span>
                    </span>
                  )}
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-leaf-600 to-leaf-800 text-lg text-cream shadow-soft transition hover:shadow-lift">
                    {user.avatar || '🧑‍🌾'}
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-leaf-400" />
                  </span>
                </div>
              }
            >
              <div className="border-b border-sage-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-leaf-600 to-leaf-800 text-lg text-cream shadow-soft">
                    {user.avatar || '🧑‍🌾'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-forest">{user.name}</p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>
                </div>
                {roleConfig[user.role] && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-bold ${roleConfig[user.role].color}`}>
                      {roleConfig[user.role].icon} {roleConfig[user.role].label}
                    </span>
                    {user.role === 'admin' && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-leaf-50 px-2 py-0.5 text-[11px] font-bold text-leaf-700">
                        ✅ Full Access
                      </span>
                    )}
                  </div>
                )}
              </div>
              <DropdownItem onClick={() => navigate('/profile')}>👤 Profil saya</DropdownItem>
              <DropdownItem onClick={() => navigate('/orders')}>📦 Pesanan saya</DropdownItem>
              <DropdownItem onClick={() => navigate('/my-garden')}>🪴 Kebunku</DropdownItem>
              <DropdownItem onClick={() => navigate('/my-bookings')}>🔧 Pesanan Jasa</DropdownItem>
              <DropdownItem onClick={() => navigate('/my-listings')}>📋 Listing Saya</DropdownItem>
              <DropdownItem onClick={() => navigate('/my-exchanges')}>💬 Tawaran Saya</DropdownItem>
              <DropdownItem onClick={() => navigate('/loyalty')}>⭐ Rewards</DropdownItem>
              <DropdownItem onClick={() => navigate('/subscription')}>💎 Langganan</DropdownItem>
              {user.role === 'admin' && (
                <>
                  <div className="mx-3 my-1 border-t border-sage-100" />
                  <DropdownItem onClick={() => navigate('/admin')}>🛡️ Admin Panel</DropdownItem>
                  <DropdownItem onClick={() => navigate('/seller')}>🏪 Seller Panel</DropdownItem>
                </>
              )}
              {user.role === 'seller' && (
                <>
                  <div className="mx-3 my-1 border-t border-sage-100" />
                  <DropdownItem onClick={() => navigate('/seller')}>🏪 Seller Dashboard</DropdownItem>
                </>
              )}
              <DropdownItem
                className="text-terra-600 hover:bg-terra-50"
                onClick={async () => {
                  await logout()
                  navigate('/login')
                }}
              >
                🚪 Keluar
              </DropdownItem>
            </Dropdown>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-muted transition hover:bg-leaf-50 hover:text-forest">
                Masuk
              </Link>
              <Link to="/register" className="btn-shine rounded-full bg-leaf-700 px-5 py-2 text-sm font-bold text-cream shadow-soft transition hover:bg-leaf-800 hover:shadow-lift">
                Daftar
              </Link>
            </div>
          )}

          {/* Hamburger */}
          <button onClick={() => setMenuOpen((o) => !o)} className="rounded-full p-2.5 text-muted transition hover:bg-leaf-50 hover:text-forest lg:hidden" aria-label="Menu">
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
        <div className="animate-fade-in border-t border-sage-100 bg-white/95 px-4 py-4 backdrop-blur-xl lg:hidden">
          <form onSubmit={submitSearch} className="mb-3">
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light">🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari tanaman, pot, pupuk..."
                className="w-full rounded-xl border border-sage-200 bg-leaf-50/50 py-2.5 pl-10 pr-4 text-sm shadow-soft focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            {[...links, ...topLinks].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cx(
                    'rounded-xl px-4 py-3 text-sm font-medium transition-all',
                    isActive ? 'bg-leaf-700 text-cream shadow-soft' : 'text-muted hover:bg-leaf-50 hover:text-forest',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <div className="mt-2 flex gap-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 rounded-xl border border-sage-200 bg-white px-4 py-3 text-center text-sm font-semibold text-forest transition hover:bg-sage-50">
                  Masuk
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 rounded-xl bg-leaf-700 px-4 py-3 text-center text-sm font-bold text-cream shadow-soft">
                  Daftar
                </Link>
              </div>
            )}
            {user && roleConfig[user.role] && (
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-leaf-50 px-4 py-3">
                <span className="text-lg">{roleConfig[user.role].icon}</span>
                <div>
                  <p className="text-xs text-muted">Login sebagai</p>
                  <p className="text-sm font-bold text-forest">{roleConfig[user.role].label}</p>
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
