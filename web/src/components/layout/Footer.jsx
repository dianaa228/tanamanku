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
    <footer className="relative mt-16 overflow-hidden bg-leaf-950 pb-24 text-leaf-100 md:pb-10">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-leaf-800/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-leaf-700/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="group inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf-400 to-leaf-600 text-xl shadow-lg shadow-leaf-500/20 transition group-hover:scale-105">
                🌿
              </span>
              <span className="text-xl font-extrabold text-white">
                Tana<span className="text-leaf-400">manku</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-leaf-200/50">
              Belanja, rawat, dan tumbuhkan kebun perkotaanmu dalam satu aplikasi. 🌱
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { icon: '📷', label: 'Instagram' },
                { icon: '🐦', label: 'Twitter' },
                { icon: '▶️', label: 'YouTube' },
                { icon: '🎵', label: 'TikTok' },
              ].map((s, i) => (
                <span
                  key={i}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-leaf-900/80 text-sm ring-1 ring-white/5 transition hover:bg-leaf-800 hover:ring-white/10 hover:scale-105"
                  title={s.label}
                >
                  {s.icon}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-leaf-400">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-leaf-200/50 transition hover:text-white hover:translate-x-1 inline-block">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-14 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-lg font-bold text-white">Dapatkan tips berkebun mingguan 🌻</h4>
              <p className="mt-1 text-sm text-leaf-200/50">Trik merawat tanaman langsung ke inbox Anda. Gratis, tanpa spam.</p>
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
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-leaf-200/30 focus:border-leaf-400/50 focus:outline-none focus:ring-2 focus:ring-leaf-500/30"
              />
              <button className="rounded-xl bg-gradient-to-r from-sun-400 to-sun-500 px-6 py-3 text-sm font-bold text-soil-950 shadow-lg shadow-sun-400/20 transition hover:from-sun-300 hover:to-sun-400 hover:shadow-xl hover:shadow-sun-400/30">
                Langganan
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-leaf-200/30 sm:flex-row">
          <p>© 2026 Tanamanku. Dibuat dengan 🧡 untuk kebun perkotaan Indonesia.</p>
          <p className="flex items-center gap-1">🌱 Belanja · 🌿 Rawat · 🪴 Tumbuh</p>
        </div>
      </div>
    </footer>
  )
}
