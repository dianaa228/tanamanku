import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api/admin'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'
import Modal from '../../components/ui/Modal'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', slug: '', icon: '🪴' })

  useEffect(() => {
    adminApi.getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', slug: '', icon: '🪴' })
    setModalOpen(true)
  }

  const openEdit = (cat) => {
    setEditing(cat)
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || '🪴' })
    setModalOpen(true)
  }

  const save = async () => {
    if (!form.name) return
    if (editing) {
      await adminApi.updateCategory(editing.id, form)
      setCategories(categories.map((c) => c.id === editing.id ? { ...c, ...form } : c))
    } else {
      const res = await adminApi.createCategory(form)
      setCategories([...categories, res.data])
    }
    setModalOpen(false)
  }

  const remove = async (id) => {
    if (!confirm('Hapus kategori ini?')) return
    await adminApi.deleteCategory(id)
    setCategories(categories.filter((c) => c.id !== id))
  }

  const totalProducts = categories.reduce((sum, c) => sum + (c.products_count || 0), 0)

  const gradients = [
    'from-leaf-400 to-emerald-600',
    'from-lime-400 to-green-600',
    'from-red-400 to-rose-600',
    'from-soil-300 to-soil-600',
    'from-amber-300 to-orange-500',
    'from-slate-400 to-slate-600',
    'from-fuchsia-300 to-purple-500',
  ]

  if (loading) return <Loading label="Memuat kategori..." />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">🏷️ Kelola Kategori</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Atur kategori produk di platform</p>
        </div>
        <Button onClick={openCreate}>➕ Tambah Kategori</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Kategori', value: categories.length, icon: '🏷️', color: 'from-leaf-400 to-emerald-600', bg: 'bg-leaf-50' },
          { label: 'Total Produk', value: totalProducts, icon: '📦', color: 'from-sky-400 to-blue-600', bg: 'bg-sky-50' },
          { label: 'Rata-rata per Kategori', value: Math.round(totalProducts / categories.length), icon: '📊', color: 'from-violet-400 to-purple-600', bg: 'bg-violet-50' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border border-[var(--border-primary)] ${s.bg} p-4 transition-all hover:-translate-y-0.5 hover:shadow-md`}>
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-xl text-white shadow-sm`}>
                {s.icon}
              </span>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
                <p className="text-xl font-extrabold text-[var(--text-primary)]">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((c, i) => (
          <div key={c.id} className="group rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-soft backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            {/* Category Header */}
            <div className={`bg-gradient-to-br ${gradients[i % gradients.length]} rounded-t-2xl p-5`}>
              <div className="flex items-center justify-between">
                <span className="text-4xl transition-transform group-hover:scale-110">{c.icon || '🪴'}</span>
                <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  {c.products_count ?? 0} produk
                </span>
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-white">{c.name}</h3>
              <p className="text-xs text-white/70 font-mono">/{c.slug}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 p-4">
              <button
                onClick={() => openEdit(c)}
                className="flex-1 rounded-xl bg-leaf-50 py-2 text-xs font-bold text-leaf-700 transition hover:bg-leaf-100"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => remove(c.id)}
                className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? '✏️ Edit Kategori' : '➕ Tambah Kategori'}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--text-primary)]">Nama Kategori</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-200"
              placeholder="Contoh: Tanaman Hias"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--text-primary)]">Icon (Emoji)</label>
            <div className="flex gap-2">
              {['🪴', '🥬', '🍅', '🪨', '🧪', '🛠️', '🏺', '🌿', '🌵', '🌻'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setForm({ ...form, icon: emoji })}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition ${
                    form.icon === emoji ? 'bg-leaf-100 ring-2 ring-leaf-500' : 'bg-leaf-50 hover:bg-leaf-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={save} className="w-full">
            {editing ? '💾 Simpan Perubahan' : '➕ Tambah Kategori'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
