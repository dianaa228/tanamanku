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
    adminApi.getCategories().then((res) => {
      setCategories(res.data)
      setLoading(false)
    })
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

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>+ Tambah Kategori</Button>
      </div>

      <div className="rounded-2xl border border-leaf-100 bg-white shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-leaf-100 bg-leaf-50/50">
                <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Kategori</th>
                <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Slug</th>
                <th className="px-4 py-3 text-right font-semibold text-leaf-900/70">Produk</th>
                <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-leaf-50 hover:bg-leaf-50/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.icon || '🪴'}</span>
                      <span className="font-semibold text-leaf-950">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-leaf-900/50 font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3 text-right font-semibold">{c.products_count ?? 0}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(c)} className="text-xs font-semibold text-leaf-700 hover:bg-leaf-50 px-2 py-1 rounded-lg">
                        ✏️ Edit
                      </button>
                      <button onClick={() => remove(c.id)} className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg">
                        🗑️ Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Kategori' : 'Tambah Kategori'}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Nama</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
              placeholder="Contoh: Tanaman Hias"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Icon</label>
            <input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
              placeholder="🪴"
            />
          </div>
          <Button onClick={save} className="w-full">{editing ? 'Simpan' : 'Tambah'}</Button>
        </div>
      </Modal>
    </div>
  )
}
