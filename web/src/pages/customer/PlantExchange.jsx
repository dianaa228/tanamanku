import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { exchangeApi } from '../../services/api/exchange'
import { LISTING_TYPES } from '../../types/constants'
import { formatRupiah, timeAgo, cx } from '../../utils/format'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'

export default function PlantExchange() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const type = searchParams.get('type') || ''

  useEffect(() => {
    setLoading(true)
    const filters = {}
    if (type) filters.type = type
    if (search) filters.search = search
    exchangeApi.getListings(filters).then((res) => {
      setListings(res.data)
      setLoading(false)
    })
  }, [type, search])

  const setType = (t) => {
    const params = new URLSearchParams()
    if (t) params.set('type', t)
    if (search) params.set('search', search)
    setSearchParams(params, { replace: true })
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-up">
        <div>
          <span className="page-eyebrow">Tukar & jual antar pekebun</span>
          <h1 className="page-title">Plant Exchange</h1>
          <p className="page-subtitle">
            Jual atau tukar tanaman dengan sesama penghobi kebun
          </p>
        </div>
        <Link
          to="/plant-exchange/create"
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-leaf-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-leaf-700 transition"
        >
          ➕ Buat Listing
        </Link>
      </div>

      {/* Search */}
      <div className="mt-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Cari tanaman..."
          className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-3 text-sm focus:border-leaf-400 focus:outline-none shadow-soft"
        />
      </div>

      {/* Type filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setType('')}
          className={cx(
            'rounded-full px-4 py-2 text-sm font-semibold transition',
            !type ? 'bg-leaf-600 text-white shadow-soft' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50',
          )}
        >
          Semua
        </button>
        {LISTING_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={cx(
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              type === t.value ? 'bg-leaf-600 text-white shadow-soft' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50',
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-8">
        {loading ? (
          <Loading label="Memuat listing..." />
        ) : listings.length === 0 ? (
          <EmptyState
            icon="🌱"
            title="Belum ada listing"
            description="Jadilah yang pertama membuat listing tanaman!"
            actionLabel="Buat Listing"
            actionTo="/plant-exchange/create"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => {
              const typeInfo = LISTING_TYPES.find((t) => t.value === l.type)
              return (
                <Link
                  key={l.id}
                  to={`/plant-exchange/${l.id}`}
                  className="group rounded-2xl border border-leaf-100 bg-white shadow-soft transition-all duration-200 hover:shadow-lift hover:-translate-y-0.5 overflow-hidden"
                >
                  {/* Image placeholder */}
                  <div className="h-44 bg-gradient-to-br from-leaf-100 to-leaf-50 flex items-center justify-center text-6xl">
                    {l.species?.scientific_name?.[0]?.toUpperCase() || '🌱'}
                  </div>

                  <div className="p-5">
                    {/* Type badge */}
                    <div className="flex items-center justify-between">
                      <span className={cx(
                        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                        l.type === 'sell' ? 'bg-sun-100 text-sun-700' : 'bg-violet-100 text-violet-700',
                      )}>
                        {typeInfo?.icon} {typeInfo?.label}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-leaf-900/40">
                        <span>💬</span>
                        <span>{l.offersCount} tawaran</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 text-lg font-semibold text-forest group-hover:text-leaf-700 transition-colors line-clamp-1">
                      {l.title}
                    </h3>

                    {/* Species */}
                    <p className="mt-0.5 text-xs text-leaf-900/50 italic">{l.species?.name || 'Tanaman hias'}</p>

                    {/* Description */}
                    <p className="mt-2 text-sm text-leaf-900/60 line-clamp-2">{l.description}</p>

                    {/* Owner + time */}
                    <div className="mt-3 flex items-center justify-between text-xs text-leaf-900/40">
                      <span>👤 {l.user?.name}</span>
                      <span>{timeAgo(l.createdAt)}</span>
                    </div>

                    {/* Price */}
                    <div className="mt-3 border-t border-leaf-50 pt-3 flex items-center justify-between">
                      {l.price != null ? (
                        <p className="text-lg font-extrabold text-leaf-700">{formatRupiah(l.price)}</p>
                      ) : (
                        <p className="text-sm font-semibold text-violet-600">🔄 Tukar Tukar</p>
                      )}
                      <span className="rounded-xl bg-leaf-100 px-3 py-1.5 text-xs font-semibold text-leaf-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        Lihat →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
