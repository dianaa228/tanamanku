import { NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { cx } from '../../utils/format'

const items = [
  { to: '/', label: 'Beranda', icon: '🏠', end: true },
  { to: '/explore', label: 'Jelajahi', icon: '🌿', end: false },
  { to: '/my-garden', label: 'Kebunku', icon: '🪴', end: false },
  { to: '/cart', label: 'Keranjang', icon: '🛒', end: false },
  { to: '/community', label: 'Komunitas', icon: '💬', end: false },
]

export default function MobileNavigation() {
  const { count } = useCart()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-leaf-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cx(
                'relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition',
                isActive ? 'text-leaf-700' : 'text-leaf-900/45 hover:text-leaf-900/70',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cx('text-xl transition-transform', isActive && 'scale-110')}>{item.icon}</span>
                {item.label}
                {item.to === '/cart' && count > 0 && (
                  <span className="absolute right-[18%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-sun-400 px-1 text-[10px] font-extrabold text-soil-950">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
