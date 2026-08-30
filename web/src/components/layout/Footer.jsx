import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'

const columns = [
  {
    title: 'Belanja',
    links: [
      { label: 'Tanaman Hias', to: '/explore?category=tanaman-hias' },
      { label: 'Sayuran & Herbal', to: '/explore?category=sayuran-herbal' },
      { label: 'Pupuk & Nutrisi', to: '/explore?category=pupuk-nutrisi' },
      { label: 'Pot & Dekorasi', to: '/explore?category=pot-dekorasi' },
    ],
  },
  {
    title: 'Fitur',
    links: [
      { label: 'My Garden', to: '/my-garden' },
      { label: 'Plant Finder', to: '/plant-finder' },
      { label: 'Plant Diagnosis', to: '/plant-diagnosis' },
      { label: 'Komunitas', to: '/community' },
    ],
  },
  {
    title: 'Bantuan',
    links: [
      { label: 'Pesanan saya', to: '/orders' },
      { label: 'Profil', to: '/profile' },
      { label: 'Cara Belanja', to: '/explore' },
    ],
  },
]

export default function Footer() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')

  return (
    <footer className="relative mt-20 overflow-hidden bg-leaf-950 pb-24 text-leaf-100 lg:pb-0">
      {/* subtle botanical texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(rgba(195,215,196,0.10) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-leaf-500 to-leaf-700 text-xl text-cream shadow-soft">
                🌿
              </span>
              <span className="display text-xl font-semibold text-white">
                Tana<span className="text-leaf-300">manku</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-leaf-200/60">
              Belanja, rawat, dan tumbuhkan kebun perkotaanmu dalam satu aplikasi.
            </p>
            <div className="mt-6 flex gap-2.5">
              {['📷', '🐦', '▶️', '🎵'].map((icon, i) => (
                <span key={i} className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/5 text-base ring-1 ring-white/10 transition hover:bg-leaf-700 hover:ring-leaf-500/40">
                  {icon}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-leaf-300/90">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-leaf-200/55 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-14 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="display text-xl font-semibold text-white">Dapatkan tips berkebun mingguan</h4>
              <p className="mt-1.5 max-w-md text-sm text-leaf-200/55">
                Trik merawat tanaman langsung ke inbox Anda. Gratis, tanpa spam.
              </p>
            </div>
            <form
              className="flex w-full max-w-md gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (!email) return
                showToast('Berhasil berlangganan! Cek email Anda 🌻')
                setEmail('')
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Alamat email Anda"
                className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-leaf-200/35 focus:border-leaf-400/50 focus:outline-none focus:ring-4 focus:ring-leaf-500/15"
              />
              <button className="btn-shine shrink-0 rounded-full bg-terra-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-terra-600">
                Langganan
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 text-xs text-leaf-200/30 sm:flex-row">
          <p>© {new Date().getFullYear()} Tanamanku. Dibuat untuk kebun perkotaan Indonesia.</p>
          <p className="flex items-center gap-2">
            <span>Belanja</span><span className="text-leaf-400">·</span>
            <span>Rawat</span><span className="text-leaf-400">·</span>
            <span>Tumbuh</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
