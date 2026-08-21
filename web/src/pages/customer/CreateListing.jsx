import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { exchangeApi } from '../../services/api/exchange'
import { LISTING_TYPES } from '../../types/constants'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import { cx } from '../../utils/format'

export default function CreateListing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'sell',
    price: '',
    species_name: '',
  })

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    if (!form.title.trim()) {
      showToast('Judul harus diisi', 'error')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        type: form.type,
        price: form.type === 'sell' && form.price ? Number(form.price) : undefined,
        plant_species_id: form.species_name ? undefined : undefined, // simplified for mock
      }
      const res = await exchangeApi.createListing(payload)
      showToast('Listing berhasil dibuat! 🎉')
      navigate(`/plant-exchange/${res.data.id}`)
    } catch {
      showToast('Gagal membuat listing. Coba lagi.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* Back link */}
      <Link to="/plant-exchange" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-leaf-700 hover:text-leaf-800 transition">
        ← Kembali ke Plant Exchange
      </Link>

      <div className="rounded-3xl border border-leaf-100 bg-white shadow-soft p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-leaf-950">➕ Buat Listing Baru</h1>
        <p className="mt-1 text-sm text-leaf-900/50">Jual atau tawarkan tanaman untuk ditukar</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Type selection */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-leaf-900">Tipe Listing *</label>
            <div className="grid grid-cols-2 gap-3">
              {LISTING_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, type: t.value })}
                  className={cx(
                    'rounded-xl border-2 px-4 py-4 text-center transition-all',
                    form.type === t.value
                      ? 'border-leaf-500 bg-leaf-50 ring-2 ring-leaf-200'
                      : 'border-leaf-100 bg-white hover:border-leaf-200',
                  )}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <p className="mt-1 text-sm font-bold text-leaf-950">{t.label}</p>
                  <p className="text-xs text-leaf-900/50">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Judul *</label>
            <input
              value={form.title}
              onChange={set('title')}
              required
              placeholder="Contoh: Monstera Deliciosa 3 Daun"
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
            />
          </div>

          {/* Species name */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Jenis Tanaman</label>
            <input
              value={form.species_name}
              onChange={set('species_name')}
              placeholder="Contoh: Monstera Deliciosa"
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              rows={4}
              placeholder="Ceritakan kondisi tanaman, ukuran, usia, dll..."
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none resize-none"
            />
          </div>

          {/* Price (only for sell) */}
          {form.type === 'sell' && (
            <div>
              <label className="mb-1 block text-sm font-semibold text-leaf-900">Harga (Rp)</label>
              <input
                type="number"
                value={form.price}
                onChange={set('price')}
                min={0}
                placeholder="0 = gratis"
                className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
              />
              <p className="mt-1 text-xs text-leaf-900/40">Isi 0 atau kosongkan jika ingin memberikan gratis</p>
            </div>
          )}

          <Button type="submit" loading={submitting} size="lg" className="w-full">
            🚀 Publish Listing
          </Button>
        </form>
      </div>
    </div>
  )
}
