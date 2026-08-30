import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { exchangeApi } from '../../services/api/exchange'
import { LISTING_TYPES, LISTING_STATUS } from '../../types/constants'
import { formatRupiah, formatDate, timeAgo, cx } from '../../utils/format'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'

export default function MyListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('semua')

  useEffect(() => {
    exchangeApi.getMyListings().then((res) => {
      setListings(res.data)
      setLoading(false)
    })
  }, [])

  const tabs = [
    { value: 'semua', label: 'Semua' },
    { value: 'active', label: 'Aktif' },
    { value: 'completed', label: 'Selesai' },
    { value: 'closed', label: 'Ditutup' },
  ]

  const filtered = tab === 'semua' ? listings : listings.filter((l) => l.status === tab)

  if (loading) return <Loading label="Memuat listing saya..." />

  return (
    <div className="page-container max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-up">
        <div>
          <span className="page-eyebrow">Katalog pribadi</span>
          <h1 className="page-title">Listing Saya</h1>
          <p className="page-subtitle">{listings.length} listing</p>
        </div>
        <Link
          to="/plant-exchange/create"
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-leaf-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-leaf-700 transition"
        >
          ➕ Buat Baru
        </Link>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cx(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
              tab === t.value ? 'bg-leaf-600 text-white' : 'bg-[var(--bg-card)] text-[var(--text-muted)] ring-1 ring-[var(--border-primary)] hover:bg-[var(--bg-card-hover)]',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon="🌱"
            title="Belum ada listing"
            description="Buat listing pertama untuk menjual atau menukar tanaman"
            actionLabel="Buat Listing"
            actionTo="/plant-exchange/create"
          />
        ) : (
          filtered.map((l) => {
            const typeInfo = LISTING_TYPES.find((t) => t.value === l.type)
            const statusInfo = LISTING_STATUS[l.status] || { label: l.status, icon: '❓', badge: 'bg-gray-100 text-gray-500' }
            return (
              <Link
                key={l.id}
                to={`/plant-exchange/${l.id}`}
                className="block rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 shadow-soft backdrop-blur-sm transition-all hover:shadow-lift"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf-800/20 text-2xl">
                      {l.species?.scientific_name?.[0]?.toUpperCase() || '🌱'}
                    </span>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{l.title}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {l.species?.name || 'Tanaman hias'} · {typeInfo?.label}
                      </p>
                    </div>
                  </div>
                  <Badge className={statusInfo.badge}>{statusInfo.icon} {statusInfo.label}</Badge>
                </div>

                <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">{l.description}</p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
                  <div className="flex items-center gap-3">
                    <span>💬 {l.offersCount} tawaran</span>
                    {l.price != null && <span className="font-bold text-leaf-700">{formatRupiah(l.price)}</span>}
                  </div>
                  <span>{timeAgo(l.createdAt)}</span>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
