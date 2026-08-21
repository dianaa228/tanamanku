import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { nurseryApi } from '../../services/api/nursery'
import { formatRupiah, cx } from '../../utils/format'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'

const cities = ['Jakarta Selatan', 'Depok']

export default function Nurseries() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [nurseries, setNurseries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const city = searchParams.get('city') || ''
  const openOnly = searchParams.get('open') === 'true'

  useEffect(() => {
    setLoading(true)
    const filters = {}
    if (city) filters.city = city
    if (search) filters.search = search
    if (openOnly) filters.open_only = 'true'
    nurseryApi.getNurseries(filters).then((res) => {
      setNurseries(res.data)
      setLoading(false)
    })
  }, [city, search, openOnly])

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    setSearchParams(params, { replace: true })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="text-3xl font-extrabold text-leaf-950">🏪 Nursery Terdekat</h1>
        <p className="mt-1 text-sm text-leaf-900/50">
          Temukan toko tanaman terbaik di sekitarmu
        </p>
      </div>

      {/* Search */}
      <div className="mt-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Cari nursery..."
          className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-3 text-sm focus:border-leaf-400 focus:outline-none shadow-soft"
        />
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {/* City filter */}
        <button
          onClick={() => setFilter('city', '')}
          className={cx(
            'rounded-full px-4 py-2 text-sm font-semibold transition',
            !city ? 'bg-leaf-600 text-white shadow-soft' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50',
          )}
        >
          Semua Kota
        </button>
        {cities.map((c) => (
          <button
            key={c}
            onClick={() => setFilter('city', city === c ? '' : c)}
            className={cx(
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              city === c ? 'bg-leaf-600 text-white shadow-soft' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50',
            )}
          >
            📍 {c}
          </button>
        ))}

        {/* Open only toggle */}
        <button
          onClick={() => setFilter('open', openOnly ? '' : 'true')}
          className={cx(
            'rounded-full px-4 py-2 text-sm font-semibold transition',
            openOnly ? 'bg-leaf-600 text-white shadow-soft' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50',
          )}
        >
          {openOnly ? '🟢 Buka Sekarang' : '🔴 Semua Status'}
        </button>
      </div>

      {/* Content */}
      <div className="mt-8">
        {loading ? (
          <Loading label="Memuat nursery..." />
        ) : nurseries.length === 0 ? (
          <EmptyState
            icon="🏪"
            title="Belum ada nursery"
            description="Coba filter pencarian lain"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {nurseries.map((n) => (
              <Link
                key={n.id}
                to={`/nurseries/${n.slug}`}
                className="group rounded-2xl border border-leaf-100 bg-white shadow-soft transition-all duration-200 hover:shadow-lift hover:-translate-y-0.5 overflow-hidden"
              >
                {/* Image placeholder */}
                <div className="h-40 bg-gradient-to-br from-leaf-100 to-leaf-50 flex items-center justify-center text-6xl">
                  🏪
                </div>

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-leaf-950 group-hover:text-leaf-700 transition-colors truncate">
                        {n.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-leaf-900/50">📍 {n.city}</p>
                    </div>
                    <Badge className={n.isOpen ? 'bg-leaf-100 text-leaf-700' : 'bg-gray-100 text-gray-500'}>
                      {n.isOpen ? '🟢 Buka' : '🔴 Tutup'}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-sm text-leaf-900/60 line-clamp-2">{n.description}</p>

                  {/* Categories */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {n.categories.slice(0, 3).map((cat, i) => (
                      <span key={i} className="rounded-full bg-leaf-50 px-2.5 py-1 text-[10px] font-semibold text-leaf-700">
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="mt-4 flex items-center justify-between text-xs text-leaf-900/50">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="text-sun-400">⭐</span>
                        <span className="font-bold text-leaf-950">{n.ratingAvg}</span>
                        <span>({n.reviewsCount})</span>
                      </span>
                      <span>📦 {n.productsCount} produk</span>
                    </div>
                    <span>🕐 {n.hours}</span>
                  </div>

                  {/* CTA */}
                  <div className="mt-4 border-t border-leaf-50 pt-3 flex items-center justify-between">
                    <p className="text-xs text-leaf-900/40">since {n.foundedYear}</p>
                    <span className="rounded-xl bg-leaf-100 px-3 py-1.5 text-xs font-semibold text-leaf-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      Lihat →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
