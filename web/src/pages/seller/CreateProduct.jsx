import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { sellerApi } from '../../services/api/seller'
import { productsApi } from '../../services/api/products'
import Button from '../../components/ui/Button'

export default function CreateProduct() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    care_level: 'mudah',
  })

  useEffect(() => {
    productsApi.getCategories().then((res) => setCategories(res.data))
  }, [])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await sellerApi.createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      })
      navigate('/seller/products')
    } catch {
      alert('Gagal membuat produk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-extrabold text-leaf-950">Tambah Produk Baru 🌱</h2>
      <p className="mt-1 text-sm text-leaf-900/50">Isi detail produk yang ingin dijual</p>

      <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
        <div>
          <label className="mb-1 block text-sm font-semibold text-leaf-900">Nama Produk *</label>
          <input
            value={form.name}
            onChange={set('name')}
            required
            className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
            placeholder="Contoh: Monstera Deliciosa 60cm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-leaf-900">Deskripsi</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={4}
            className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none resize-none"
            placeholder="Deskripsi produk..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Harga (Rp) *</label>
            <input
              type="number"
              value={form.price}
              onChange={set('price')}
              required
              min="0"
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
              placeholder="0"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Stok *</label>
            <input
              type="number"
              value={form.stock}
              onChange={set('stock')}
              required
              min="0"
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Kategori *</label>
            <select
              value={form.category_id}
              onChange={set('category_id')}
              required
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
            >
              <option value="">Pilih kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Level Perawatan</label>
            <select
              value={form.care_level}
              onChange={set('care_level')}
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
            >
              <option value="mudah">🌱 Mudah</option>
              <option value="sedang">🌿 Sedang</option>
              <option value="sulit">🪴 Sulit</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>Simpan Produk</Button>
          <Button variant="ghost" to="/seller/products">Batal</Button>
        </div>
      </form>
    </div>
  )
}
