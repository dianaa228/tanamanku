import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { cx } from '../../utils/format'

const items = [
  { to: '/', label: 'Beranda', icon: '🏠', end: true },
  { to: '/my-garden', label: 'Kebunku', icon: '🪴', end: false },
  { to: '/community', label: 'Komunitas', icon: '💬', end: false },
  { to: '/explore', label: 'Toko', icon: '🌿', end: false },
  { to: '/profile', label: 'Profil', icon: '🧑‍🌾', end: false },
]

export default function MobileNavigation() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const profileTo = user ? '/profile' : '/login'
  return (
    <nav className={cx('fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border-primary)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden', isDark ? 'bg-[#0a120e]/95 shadow-[0_-6px_20px_-10px_rgba(0,0,0,0.5)]' : 'bg-[#e8f0e6]/90 shadow-[0_-6px_20px_-10px_rgba(28,43,34,0.15)]')}>
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const to = item.to === '/profile' ? profileTo : item.to
          return (
            <NavLink
              key={item.to}
              to={to}
              end={item.end}
              className={({ isActive }) =>
                cx(
                  'relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition',
                  isActive ? 'text-leaf-400' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute -top-px h-0.5 w-8 rounded-full bg-leaf-400" />}
                  <span className={cx('flex h-7 w-7 items-center justify-center rounded-full text-xl transition-transform', isActive && 'scale-110 bg-leaf-800/40')}>
                    {item.icon}
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
