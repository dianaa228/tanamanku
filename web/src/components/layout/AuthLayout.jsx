import { Outlet, Link } from 'react-router-dom'
import ScrollToTop from '../ui/ScrollToTop'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-cream">
      <ScrollToTop />
      {/* Panel brand */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-leaf-800 via-leaf-700 to-leaf-900 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '26px 26px' }}
        />
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-leaf-500/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sun-300/20 blur-3xl" />

        <div className="relative flex h-full w-full flex-col justify-between p-12">
          <Link to="/" className="flex w-fit items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur">🌿</span>
            <span className="display text-2xl font-semibold text-white">Tanamanku</span>
          </Link>

          <div className="max-w-md">
            <div className="animate-float w-fit text-8xl drop-shadow-xl">🪴</div>
            <h1 className="display mt-8 text-balance text-5xl font-semibold leading-[1.05] text-white">
              Kebun perkotaanmu, mulai dari satu daun.
            </h1>
            <p className="mt-5 text-lg text-leaf-100/80">
              Belanja tanaman sehat, kelola kebun pribadi, dan dapatkan pengingat perawatan — semua di Tanamanku.
            </p>
            <div className="mt-9 flex flex-wrap gap-2.5">
              {['🪴 Tanaman berkualitas', '💧 Pengingat cerdas', '🌱 Komunitas hangat'].map((t) => (
                <span key={t} className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur ring-1 ring-white/10">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-leaf-100/50">© 2026 Tanamanku — Urban Gardening Marketplace</p>
        </div>
      </div>

      {/* Form area */}
      <div className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md animate-fade-up">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf-600 to-leaf-800 text-2xl text-cream">🌿</span>
            <span className="display text-2xl font-semibold text-leaf-950">Tanamanku</span>
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
