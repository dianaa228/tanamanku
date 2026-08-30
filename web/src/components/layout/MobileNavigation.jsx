import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
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
  const profileTo = user ? '/profile' : '/login'
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-sage-100 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_-10px_rgba(28,43,34,0.12)] backdrop-blur-lg lg:hidden">
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
                  isActive ? 'text-leaf-700' : 'text-muted hover:text-forest',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute -top-px h-0.5 w-8 rounded-full bg-leaf-700" />}
                  <span className={cx('flex h-7 w-7 items-center justify-center rounded-full text-xl transition-transform', isActive && 'scale-110 bg-leaf-50')}>
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
