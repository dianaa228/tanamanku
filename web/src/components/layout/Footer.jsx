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
    <footer className="mt-16 bg-leaf-950 pb-24 text-leaf-100 md:pb-10">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-leaf-400 to-leaf-600 text-xl">
                🌿
              </span>
              <span className="text-xl font-extrabold text-white">Tanamanku</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-leaf-100/60">
              Belanja, rawat, dan tumbuhkan kebun perkotaanmu dalam satu aplikasi. 🌱
            </p>
            <div className="mt-5 flex gap-3">
              {['📷', '🐦', '▶️', '🎵'].map((icon, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-leaf-900 text-sm transition hover:bg-leaf-800"
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-leaf-300">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-leaf-100/60 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 rounded-3xl bg-leaf-900/60 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-lg font-bold text-white">Dapatkan tips berkebun mingguan 🌻</h4>
              <p className="mt-1 text-sm text-leaf-100/60">Trik merawat tanaman langsung ke inbox Anda. Gratis, tanpa spam.</p>
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
                className="flex-1 rounded-xl border border-leaf-800 bg-leaf-950/50 px-4 py-3 text-sm text-white placeholder:text-leaf-100/40 focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-500/30"
              />
              <button className="rounded-xl bg-sun-400 px-5 py-3 text-sm font-bold text-soil-950 transition hover:bg-sun-300">
                Langganan
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-leaf-900 pt-6 text-xs text-leaf-100/40 sm:flex-row">
          <p>© 2026 Tanamanku. Dibuat dengan 🧡 untuk kebun perkotaan Indonesia.</p>
          <p>🌱 Belanja · 🌿 Rawat · 🪴 Tumbuh</p>
        </div>
      </div>
    </footer>
  )
}
