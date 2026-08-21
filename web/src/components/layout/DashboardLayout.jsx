import { useState } from 'react'
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { cx } from '../../utils/format'

/**
 * Layout dashboard dengan sidebar + topbar.
 * Digunakan untuk seller dan admin panel.
 */
export default function DashboardLayout({ role = 'seller', navItems = [] }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Cek role
  if (!user) return <Navigate to="/login" replace />
  if (role === 'admin' && user.role !== 'admin') return <Navigate to="/" replace />
  if (role === 'seller' && user.role !== 'seller' && user.role !== 'admin') return <Navigate to="/" replace />

  const activeItem = navItems.find((item) => location.pathname === item.to || location.pathname.startsWith(item.to + '/'))

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-leaf-100 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-leaf-100">
          <span className="text-2xl">🌿</span>
          <div>
            <p className="font-extrabold text-leaf-950">Tanamanku</p>
            <p className="text-[10px] font-semibold text-leaf-900/50 uppercase tracking-wider">
              {role === 'admin' ? 'Admin Panel' : 'Seller Panel'}
            </p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="mt-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cx(
                  'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150',
                  active
                    ? 'bg-leaf-600 text-white shadow-soft'
                    : 'text-leaf-900/70 hover:bg-leaf-50 hover:text-leaf-900',
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Back to store */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-leaf-100">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-leaf-900/60 hover:bg-leaf-50 transition"
          >
            <span>🏪</span>
            <span>Kembali ke Toko</span>
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-md border-b border-leaf-100">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-leaf-50 text-leaf-900/60"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="flex-1">
            <h1 className="text-lg font-bold text-leaf-950">
              {activeItem?.label || 'Dashboard'}
            </h1>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-leaf-950">{user.name}</p>
              <p className="text-[11px] text-leaf-900/50 capitalize">{user.role}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-100 text-lg">
              {user.avatar || '🧑‍🌾'}
            </div>
            <button
              onClick={async () => { await logout(); window.location.href = '/' }}
              className="p-2 rounded-xl hover:bg-rose-50 text-leaf-900/40 hover:text-rose-600 transition"
              title="Keluar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
