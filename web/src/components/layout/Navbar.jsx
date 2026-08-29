import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import Dropdown, { DropdownItem } from '../ui/Dropdown'
import { cx } from '../../utils/format'

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/explore', label: 'Jelajahi' },
  { to: '/nurseries', label: 'Nursery' },
  { to: '/services', label: 'Jasa' },
  { to: '/plant-exchange', label: 'Exchange' },
  { to: '/my-garden', label: 'Kebunku' },
  { to: '/plant-finder', label: 'Plant Finder' },
  { to: '/community', label: 'Komunitas' },
]

const roleConfig = {
  admin: { icon: '🛡️', label: 'Admin', color: 'bg-violet-100 text-violet-700 ring-violet-200' },
  seller: { icon: '🏪', label: 'Seller', color: 'bg-amber-100 text-amber-700 ring-amber-200' },
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
    <header className="sticky top-0 z-40 glass border-b border-leaf-200/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-6">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf-500 via-leaf-600 to-leaf-700 text-xl shadow-lg shadow-leaf-500/25 transition group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-leaf-500/30">
            🌿
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight text-leaf-950 sm:block">
            Tana<span className="text-leaf-600">manku</span>
          </span>
        </Link>

        {/* Search (desktop) */}
        <form onSubmit={submitSearch} className="hidden flex-1 max-w-md md:block">
          <div className="relative group">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-leaf-400 transition group-focus-within:text-leaf-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari tanaman, pot, pupuk..."
              className="w-full rounded-2xl border border-leaf-200/80 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-leaf-950 shadow-sm backdrop-blur-sm transition placeholder:text-leaf-400/60 focus:border-leaf-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-leaf-200/50 focus:shadow-md focus:shadow-leaf-100"
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
                  'rounded-xl px-3 py-2 text-[13px] font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-leaf-600 text-white shadow-md shadow-leaf-600/25'
                    : 'text-leaf-700/70 hover:bg-leaf-100 hover:text-leaf-800',
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
            className="relative rounded-xl p-2.5 text-leaf-700 transition hover:bg-leaf-100 hover:text-leaf-800"
            aria-label="Keranjang"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="20" cy="21" r="1.5" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 animate-pop items-center justify-center rounded-full bg-sun-400 px-1 text-[11px] font-extrabold text-soil-950 shadow-md shadow-sun-400/30">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <Dropdown
              trigger={
                <div className="flex items-center gap-2 cursor-pointer">
                  {roleConfig[user.role] && (
                    <span className={`hidden items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset sm:flex ${roleConfig[user.role].color}`}>
                      <span>{roleConfig[user.role].icon}</span>
                      <span>{roleConfig[user.role].label}</span>
                    </span>
                  )}
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-leaf-400 to-leaf-600 text-xl shadow-lg shadow-leaf-500/20 transition hover:scale-105">
                    {user.avatar || '🧑‍🌾'}
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 shadow-sm" />
                  </span>
                </div>
              }
            >
              <div className="border-b border-leaf-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-leaf-400 to-leaf-600 text-xl text-white shadow-md shadow-leaf-500/20">
                    {user.avatar || '🧑‍🌾'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-leaf-950">{user.name}</p>
                    <p className="truncate text-xs text-leaf-500">{user.email}</p>
                  </div>
                </div>
                {roleConfig[user.role] && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-bold ${roleConfig[user.role].color}`}>
                      {roleConfig[user.role].icon} {roleConfig[user.role].label}
                    </span>
                    {user.role === 'admin' && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
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
                  <div className="mx-3 border-t border-leaf-100 my-1" />
                  <DropdownItem onClick={() => navigate('/admin')}>🛡️ Admin Panel</DropdownItem>
                  <DropdownItem onClick={() => navigate('/seller')}>🏪 Seller Panel</DropdownItem>
                </>
              )}
              {user.role === 'seller' && (
                <>
                  <div className="mx-3 border-t border-leaf-100 my-1" />
                  <DropdownItem onClick={() => navigate('/seller')}>🏪 Seller Dashboard</DropdownItem>
                </>
              )}
              <DropdownItem
                className="text-rose-600 hover:bg-rose-50"
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
              <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-leaf-700 transition hover:bg-leaf-100 hover:text-leaf-800">
                Masuk
              </Link>
              <Link
                to="/register"
                className="btn-shine rounded-xl bg-gradient-to-r from-leaf-600 to-leaf-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-leaf-600/25 transition hover:from-leaf-700 hover:to-leaf-600 hover:shadow-xl hover:shadow-leaf-600/30"
              >
                Daftar
              </Link>
            </div>
          )}

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-xl p-2.5 text-leaf-700 transition hover:bg-leaf-100 md:hidden"
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
        <div className="animate-fade-in border-t border-leaf-100/80 bg-white/95 backdrop-blur-xl px-4 py-4 md:hidden">
          <form onSubmit={submitSearch} className="mb-3">
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-leaf-400">🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari tanaman, pot, pupuk..."
                className="w-full rounded-2xl border border-leaf-200/80 bg-leaf-50/50 py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-200"
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
                    'rounded-xl px-4 py-3 text-sm font-semibold transition-all',
                    isActive ? 'bg-leaf-600 text-white shadow-md' : 'text-leaf-700 hover:bg-leaf-100',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <div className="mt-2 flex gap-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 rounded-xl border border-leaf-200 bg-white px-4 py-3 text-center text-sm font-semibold text-leaf-800 transition hover:bg-leaf-50">
                  Masuk
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 rounded-xl bg-gradient-to-r from-leaf-600 to-leaf-500 px-4 py-3 text-center text-sm font-bold text-white shadow-md shadow-leaf-600/20">
                  Daftar
                </Link>
              </div>
            )}
            {user && roleConfig[user.role] && (
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-leaf-50 px-4 py-3">
                <span className="text-xl">{roleConfig[user.role].icon}</span>
                <div>
                  <p className="text-xs text-leaf-500">Login sebagai</p>
                  <p className="text-sm font-bold text-leaf-950">{roleConfig[user.role].label}</p>
                </div>
                {user.role === 'admin' && (
                  <span className="ml-auto rounded-lg bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Full Access
                  </span>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
