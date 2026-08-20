import { Outlet, Link } from 'react-router-dom'
import ScrollToTop from '../ui/ScrollToTop'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-cream">
      <ScrollToTop />
      {/* Panel brand */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-leaf-700 via-leaf-600 to-leaf-800 lg:block">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-leaf-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sun-400/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex w-fit items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl backdrop-blur">🌿</span>
            <span className="text-xl font-extrabold text-white">Tanamanku</span>
          </Link>
          <div className="max-w-md">
            <div className="animate-float text-7xl">🪴</div>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white">
              Kebun perkotaanmu,
              <br />
              mulai dari satu daun.
            </h1>
            <p className="mt-4 text-leaf-100/80">
              Belanja tanaman sehat, kelola kebun pribadi, dan dapatkan pengingat perawatan — semua di Tanamanku.
            </p>
            <div className="mt-8 flex gap-3">
              {['🪴 Tanaman berkualitas', '💧 Pengingat cerdas', '🌱 Komunitas hangat'].map((t) => (
                <span key={t} className="rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-leaf-100/50">© 2026 Tanamanku — Urban Gardening Marketplace</p>
        </div>
      </div>

      {/* Form area */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-leaf-500 to-leaf-700 text-xl">🌿</span>
            <span className="text-xl font-extrabold text-leaf-950">Tanamanku</span>
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
