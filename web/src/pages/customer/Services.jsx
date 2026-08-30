import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { servicesApi } from '../../services/api/services'
import { SERVICE_CATEGORIES } from '../../types/constants'
import { formatRupiah, durationText, cx } from '../../utils/format'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const category = searchParams.get('category') || ''

  useEffect(() => {
    setLoading(true)
    servicesApi.getServices(category ? { category } : {}).then((res) => {
      setServices(res.data)
      setLoading(false)
    })
  }, [category])

  const setCategory = (cat) => {
    const params = new URLSearchParams()
    if (cat) params.set('category', cat)
    setSearchParams(params, { replace: true })
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="animate-fade-up">
        <span className="page-eyebrow">Ahli terbaik untuk kebunmu</span>
        <h1 className="page-title">Jasa Berkebun</h1>
        <p className="page-subtitle">
          {loading ? 'Memuat layanan...' : `${services.length} layanan tersedia`}
        </p>
      </div>

      {/* Category chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory('')}
          className={cx(
            'rounded-full px-4 py-2 text-sm font-semibold transition',
            !category ? 'bg-leaf-600 text-white shadow-soft' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50',
          )}
        >
          Semua
        </button>
        {SERVICE_CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={cx(
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              category === c.value ? 'bg-leaf-600 text-white shadow-soft' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50',
            )}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-8">
        {loading ? (
          <Loading label="Memuat layanan..." />
        ) : services.length === 0 ? (
          <EmptyState
            icon="🔧"
            title="Belum ada layanan"
            description="Coba filter kategori lain atau nanti kembali lagi"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const cat = SERVICE_CATEGORIES.find((c) => c.value === s.category)
              return (
                <Link
                  key={s.id}
                  to={`/services/${s.id}`}
                  className="group rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft transition-all duration-200 hover:shadow-lift hover:-translate-y-0.5"
                >
                  {/* Category badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-leaf-100 px-3 py-1 text-xs font-semibold text-leaf-700">
                      {cat?.icon} {cat?.label || s.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-sun-400">⭐</span>
                      <span className="font-bold text-leaf-950">{s.ratingAvg}</span>
                      <span className="text-leaf-900/40">({s.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-lg font-bold text-leaf-950 group-hover:text-leaf-700 transition-colors">
                    {s.name}
                  </h3>

                  {/* Provider */}
                  <p className="mt-1 text-sm text-leaf-900/50">oleh {s.provider?.name}</p>

                  {/* Description */}
                  <p className="mt-2 text-sm text-leaf-900/60 line-clamp-2">{s.description}</p>

                  {/* Meta */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-leaf-900/50">
                    <span className="inline-flex items-center gap-1">⏱️ {durationText(s.duration)}</span>
                    <span className="inline-flex items-center gap-1">📍 {s.serviceArea}</span>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-center justify-between border-t border-leaf-50 pt-3">
                    <div>
                      <p className="text-[10px] font-medium text-leaf-900/40">Harga per kunjungan</p>
                      <p className="text-lg font-extrabold text-leaf-700">{formatRupiah(s.price)}</p>
                    </div>
                    <span className="rounded-xl bg-leaf-600 px-4 py-2 text-sm font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      Lihat Detail →
                    </span>
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
