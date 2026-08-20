import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { formatDate } from '../../utils/format'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { cx } from '../../utils/format'

export default function Profile() {
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="animate-float text-6xl">🔐</div>
        <h1 className="mt-4 text-2xl font-extrabold text-leaf-950">Masuk dulu yuk</h1>
        <p className="mt-2 text-sm text-leaf-900/50">Masuk untuk mengakses profil, pesanan, dan kebunmu.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button to="/login">Masuk</Button>
          <Button to="/register" variant="secondary">Daftar</Button>
        </div>
      </div>
    )
  }

  const save = () => {
    showToast('Profil berhasil diperbarui ✨')
    setEditing(false)
  }

  const menu = [
    { icon: '📦', label: 'Pesanan saya', to: '/orders', desc: 'Pantau status pesanan' },
    { icon: '🪴', label: 'My Garden', to: '/my-garden', desc: `${user.stats?.plants || 0} tanaman aktif` },
    { icon: '💡', label: 'Plant Finder', to: '/plant-finder', desc: 'Cari tanaman ideal' },
    { icon: '🩺', label: 'Plant Diagnosis', to: '/plant-diagnosis', desc: 'Cek kesehatan tanaman' },
    { icon: '💬', label: 'Komunitas', to: '/community', desc: `${user.stats?.posts || 0} post` },
    { icon: '📍', label: 'Alamat', to: '#', desc: user.address ? `${user.address.label} · ${user.address.city}` : 'Belum ada', onClick: () => showToast('Kelola alamat tersedia di versi penuh', 'info') },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-leaf-950">Profil Saya 👤</h1>

      {/* Kartu profil */}
      <div className="mt-6 flex flex-col items-center gap-5 rounded-[2rem] bg-gradient-to-br from-leaf-600 to-leaf-800 p-8 text-center shadow-lift sm:flex-row sm:text-left">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15 text-5xl backdrop-blur">
          {user.avatar || '🧑‍🌾'}
        </span>
        <div className="flex-1">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-extrabold text-white">{user.name}</h2>
            <Badge className="bg-white/15 text-white capitalize">{user.role}</Badge>
          </div>
          <p className="mt-1 text-sm text-leaf-100/80">{user.email} · {user.phone}</p>
          <p className="mt-1 text-xs text-leaf-100/60">Bergabung sejak {formatDate(user.memberSince)}</p>
        </div>
        <Button
          variant={editing ? 'sun' : 'secondary'}
          onClick={() => {
            if (editing) save()
            else setEditing(true)
          }}
        >
          {editing ? 'Simpan' : '✏️ Edit profil'}
        </Button>
      </div>

      {/* Form edit */}
      {editing && (
        <div className="mt-6 animate-pop rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nama lengkap" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="No. HP" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <p className="mt-3 text-xs text-leaf-900/45">Email tidak dapat diubah di mode demo.</p>
        </div>
      )}

      {/* Statistik */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        {[
          { value: user.stats?.plants || 0, label: 'Tanaman', icon: '🪴' },
          { value: user.stats?.orders || 0, label: 'Pesanan', icon: '📦' },
          { value: user.stats?.posts || 0, label: 'Post', icon: '💬' },
        ].map((s) => (
          <div key={s.label} className="rounded-3xl border border-leaf-100 bg-white p-5 text-center shadow-soft">
            <p className="text-2xl">{s.icon}</p>
            <p className="mt-1 text-2xl font-extrabold text-leaf-950">{s.value}</p>
            <p className="text-xs font-medium text-leaf-900/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {menu.map((m) => (
          <Link
            key={m.label}
            to={m.to}
            onClick={m.onClick}
            className="group flex items-center gap-4 rounded-3xl border border-leaf-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-100 text-2xl transition group-hover:bg-leaf-200">{m.icon}</span>
            <div className="flex-1">
              <p className="font-bold text-leaf-950">{m.label}</p>
              <p className="text-xs text-leaf-900/50">{m.desc}</p>
            </div>
            <span className="text-leaf-900/30 transition group-hover:translate-x-1 group-hover:text-leaf-700">→</span>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-10 text-center">
        <button
          onClick={async () => {
            await logout()
            showToast('Sampai jumpa! Sampai ketemu lagi 👋')
            navigate('/')
          }}
          className={cx('rounded-2xl px-6 py-3 text-sm font-bold text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-50')}
        >
          🚪 Keluar dari akun
        </button>
      </div>
    </div>
  )
}
