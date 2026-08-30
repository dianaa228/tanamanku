import { useState } from 'react'
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { cx } from '../../utils/format'
import ThemeToggle from '../ui/ThemeToggle'

/**
 * Layout dashboard dengan sidebar + topbar.
 * Digunakan untuk seller dan admin panel.
 */
export default function DashboardLayout({ role = 'seller', navItems = [] }) {
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isDark = theme === 'dark'

  // Cek role
  if (!user) return <Navigate to="/login" replace />
  if (role === 'admin' && user.role !== 'admin') return <Navigate to="/" replace />
  if (role === 'seller' && user.role !== 'seller' && user.role !== 'admin') return <Navigate to="/" replace />

  const activeItem = navItems.find((item) => location.pathname === item.to || location.pathname.startsWith(item.to + '/'))

  return (
    <div className={cx('flex min-h-screen', isDark ? 'bg-[#0f1a14]' : 'bg-cream')}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto',
          isDark ? 'bg-[#1a2820] border-sage-800' : 'bg-white border-leaf-100',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-leaf-100">
          <span className="text-2xl">🌿</span>
          <div>
            <p className={cx('font-extrabold', isDark ? 'text-white' : 'text-forest')}>Tanamanku</p>
            <p className={cx('text-[10px] font-semibold uppercase tracking-wider', isDark ? 'text-sage-400' : 'text-leaf-900/50')}>
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
                    : isDark
                      ? 'text-sage-300 hover:bg-sage-800 hover:text-white'
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

        {/* Back to store / Admin link */}
        <div className={cx('absolute bottom-0 left-0 right-0 p-4 border-t', isDark ? 'border-sage-800' : 'border-leaf-100')}>
          <div className="mb-2">
            <ThemeToggle className="w-full justify-center" />
          </div>
          {user.role === 'admin' && role === 'seller' ? (
            <Link
              to="/admin"
              className={cx('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition', isDark ? 'text-sage-400 hover:bg-sage-800' : 'text-leaf-900/60 hover:bg-leaf-50')}
            >
              <span>🛡️</span>
              <span>Kembali ke Admin Panel</span>
            </Link>
          ) : (
            <Link
              to="/"
              className={cx('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition', isDark ? 'text-sage-400 hover:bg-sage-800' : 'text-leaf-900/60 hover:bg-leaf-50')}
            >
              <span>🏪</span>
              <span>Kembali ke Toko</span>
            </Link>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className={cx('sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-6 py-3 backdrop-blur-md border-b', isDark ? 'bg-[#0f1a14]/80 border-sage-800' : 'bg-white/80 border-leaf-100')}>
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
            <h1 className={cx('text-lg font-bold', isDark ? 'text-white' : 'text-forest')}>
              {activeItem?.label || 'Dashboard'}
            </h1>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:block text-right">
              <p className={cx('text-sm font-semibold', isDark ? 'text-white' : 'text-forest')}>{user.name}</p>
              <p className={cx('text-[11px] capitalize', isDark ? 'text-sage-400' : 'text-leaf-900/50')}>{user.role}</p>
            </div>
            <div className={cx('flex h-9 w-9 items-center justify-center rounded-full text-lg', isDark ? 'bg-sage-700' : 'bg-leaf-100')}>
              {user.avatar || '🧑‍🌾'}
            </div>
            <button
              onClick={async () => { await logout(); window.location.href = '/login' }}
              className={cx('p-2 rounded-xl transition', isDark ? 'text-sage-500 hover:bg-sage-800 hover:text-rose-400' : 'text-leaf-900/40 hover:bg-rose-50 hover:text-rose-600')}
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
        <main className="flex-1 p-4 pb-24 sm:p-6 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className={cx('fixed bottom-0 left-0 right-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden', isDark ? 'bg-[#1a2820]/95 border-sage-800' : 'bg-white/95 border-leaf-100')}>
        <div className="grid grid-cols-6 gap-1 px-2">
          {navItems.slice(0, 6).map((item) => {
            const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/')
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cx('flex flex-col items-center gap-0.5 rounded-xl py-2.5 text-[10px] font-semibold transition',
                  active ? 'bg-leaf-600 text-white' : isDark ? 'text-sage-500 hover:bg-sage-800' : 'text-leaf-900/45 hover:bg-leaf-50'
                )}
              >
                <span className={`text-lg ${active ? 'scale-110' : ''}`}>{item.icon}</span>
                <span className="truncate px-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
