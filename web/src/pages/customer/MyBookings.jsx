import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { servicesApi } from '../../services/api/services'
import { BOOKING_STATUS, SERVICE_CATEGORIES } from '../../types/constants'
import { formatRupiah, formatDateTime } from '../../utils/format'
import Badge from '../../components/ui/Badge'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'
import { cx } from '../../utils/format'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('semua')

  useEffect(() => {
    servicesApi.getMyBookings().then((res) => {
      setBookings(res.data)
      setLoading(false)
    })
  }, [])

  const tabs = [
    { value: 'semua', label: 'Semua' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'confirmed', label: 'Dikonfirmasi' },
    { value: 'in-progress', label: 'Dikerjakan' },
    { value: 'completed', label: 'Selesai' },
  ]

  const filtered = tab === 'semua' ? bookings : bookings.filter((b) => b.status === tab)

  const statusMeta = (status) => BOOKING_STATUS[status] || { label: status, icon: '❓', badge: 'bg-gray-100 text-gray-500' }
  const catMeta = (cat) => SERVICE_CATEGORIES.find((c) => c.value === cat)

  if (loading) return <Loading label="Memuat pesanan jasa..." />

  return (
    <div className="page-container max-w-3xl">
      <div className="animate-fade-up">
        <span className="page-eyebrow">Jasa berkebun</span>
        <h1 className="page-title">Pesanan Jasa Saya</h1>
        <p className="page-subtitle">
          {loading ? 'Memuat...' : `${bookings.length} pesanan`}
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cx(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
              tab === t.value ? 'bg-leaf-600 text-white' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50',
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
            icon="🔧"
            title="Belum ada pesanan jasa"
            description="Temukan layanan berkebun yang sesuai untuk kebunmu"
            actionLabel="Jelajahi Layanan"
            actionTo="/services"
          />
        ) : (
          filtered.map((b) => {
            const meta = statusMeta(b.status)
            const cat = catMeta(b.service?.category)
            return (
              <div key={b.id} className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft">
                {/* Top row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-100 text-xl">
                      {cat?.icon || '🔧'}
                    </span>
                    <div>
                      <p className="font-semibold text-forest">{b.service?.name}</p>
                      <p className="text-xs text-leaf-900/50">
                        {cat?.label || b.service?.category} · ID #{b.id}
                      </p>
                    </div>
                  </div>
                  <Badge className={meta.badge}>{meta.icon} {meta.label}</Badge>
                </div>

                {/* Schedule + address */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-2.5">
                    <span>🗓️</span>
                    <div>
                      <p className="text-[11px] text-leaf-900/40">Jadwal</p>
                      <p className="text-sm font-semibold text-leaf-950">{formatDateTime(b.scheduleAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5">
                    <span>📍</span>
                    <div>
                      <p className="text-[11px] text-leaf-900/40">Lokasi</p>
                      <p className="text-sm font-semibold text-leaf-950">
                        {b.address?.label}: {b.address?.street}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Note */}
                {b.note && (
                  <div className="mt-3 rounded-xl bg-leaf-50 px-4 py-2.5">
                    <p className="text-[11px] text-leaf-900/40">Catatan</p>
                    <p className="text-sm text-leaf-900/70">{b.note}</p>
                  </div>
                )}

                {/* Price + date */}
                <div className="mt-4 flex items-center justify-between border-t border-leaf-50 pt-3">
                  <p className="text-xs text-leaf-900/40">
                    Dipesan {formatDateTime(b.createdAt)}
                  </p>
                  <p className="text-lg font-extrabold text-leaf-700">{formatRupiah(b.total)}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
