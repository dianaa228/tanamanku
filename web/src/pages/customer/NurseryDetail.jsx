import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { nurseryApi } from '../../services/api/nursery'
import { formatRupiah, cx } from '../../utils/format'
import Loading from '../../components/ui/Loading'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

export default function NurseryDetail() {
  const { slug } = useParams()
  const [nursery, setNursery] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    nurseryApi.getNursery(slug).then(async (res) => {
      setNursery(res.data)
      const prodRes = await nurseryApi.getNurseryProducts(res.data.id)
      setProducts(prodRes.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  if (loading) return <Loading label="Memuat detail nursery..." />
  if (!nursery) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-6xl">🔍</p>
        <p className="mt-4 text-lg font-bold text-leaf-950">Nursery tidak ditemukan</p>
        <Button to="/nurseries" className="mt-4">← Kembali</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Back link */}
      <Link to="/nurseries" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-leaf-700 hover:text-leaf-800 transition">
        ← Kembali ke Nursery
      </Link>

      {/* Hero */}
      <div className="rounded-3xl border border-leaf-100 bg-white shadow-soft overflow-hidden">
        <div className="h-48 sm:h-64 bg-gradient-to-br from-leaf-100 to-leaf-50 flex items-center justify-center text-8xl">
          🏪
        </div>

        <div className="px-6 py-6 sm:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-leaf-950">{nursery.name}</h1>
                <Badge className={nursery.isOpen ? 'bg-leaf-100 text-leaf-700' : 'bg-gray-100 text-gray-500'}>
                  {nursery.isOpen ? '🟢 Buka' : '🔴 Tutup'}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-leaf-900/50">Berdiri sejak {nursery.foundedYear} · Dimiliki oleh {nursery.owner?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sun-400 text-xl">⭐</span>
              <span className="text-2xl font-extrabold text-leaf-950">{nursery.ratingAvg}</span>
              <span className="text-sm text-leaf-900/50">({nursery.reviewsCount} ulasan)</span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-4 text-sm leading-relaxed text-leaf-900/70">{nursery.description}</p>

          {/* Categories */}
          <div className="mt-4 flex flex-wrap gap-2">
            {nursery.categories.map((cat, i) => (
              <Badge key={i} className="bg-leaf-100 text-leaf-700">{cat}</Badge>
            ))}
          </div>

          {/* Info Cards */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-xl bg-leaf-50 px-4 py-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="text-[11px] text-leaf-900/40">Alamat</p>
                <p className="text-sm font-semibold text-leaf-950">{nursery.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-leaf-50 px-4 py-3">
              <span className="text-xl">🕐</span>
              <div>
                <p className="text-[11px] text-leaf-900/40">Jam Buka</p>
                <p className="text-sm font-semibold text-leaf-950">{nursery.hours}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-leaf-50 px-4 py-3">
              <span className="text-xl">📞</span>
              <div>
                <p className="text-[11px] text-leaf-900/40">Telepon</p>
                <p className="text-sm font-semibold text-leaf-950">{nursery.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-leaf-50 px-4 py-3">
              <span className="text-xl">📧</span>
              <div>
                <p className="text-[11px] text-leaf-900/40">Email</p>
                <p className="text-sm font-semibold text-leaf-950">{nursery.email}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${nursery.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="primary" size="lg" className="w-full">
                💬 Chat WhatsApp
              </Button>
            </a>
            <a
              href={`tel:${nursery.phone}`}
              className="flex-1"
            >
              <Button variant="secondary" size="lg" className="w-full">
                📞 Telepon
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-leaf-950">📦 Produk ({products.length})</h2>
        </div>

        {products.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-leaf-200 bg-leaf-50/50 p-12 text-center">
            <p className="text-4xl">📦</p>
            <p className="mt-2 text-sm text-leaf-900/60">Belum ada produk</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div key={p.id} className="rounded-2xl border border-leaf-100 bg-white p-4 shadow-soft transition-all hover:shadow-lift">
                <div className="flex items-start gap-3">
                  <div className="h-16 w-16 shrink-0 rounded-xl bg-leaf-100 flex items-center justify-center text-2xl">
                    🌱
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-leaf-950 truncate">{p.name}</p>
                    <p className="text-xs text-leaf-900/50">{p.category}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-base font-extrabold text-leaf-700">{formatRupiah(p.price)}</p>
                      <p className={cx('text-xs font-semibold', p.stock > 0 ? 'text-leaf-600' : 'text-rose-600')}>
                        {p.stock > 0 ? `Stok: ${p.stock}` : 'Habis'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
