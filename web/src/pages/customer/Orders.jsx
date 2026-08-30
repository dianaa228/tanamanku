import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ordersApi } from '../../services/api/orders'
import { formatRupiah, formatDateTime } from '../../utils/format'
import { ORDER_STATUS } from '../../types/constants'
import Badge from '../../components/ui/Badge'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'
import ProductVisual from '../../components/product/ProductVisual'

const statusOrder = { pending: 0, paid: 1, processing: 2, shipped: 3, delivered: 4, completed: 5, cancelled: 9 }

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('semua')

  useEffect(() => {
    ordersApi.getOrders().then((res) => {
      setOrders(res.data)
      setLoading(false)
    })
  }, [])

  const tabs = [
    { value: 'semua', label: 'Semua' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'shipped', label: 'Dikirim' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Dibatalkan' },
  ]

  const filtered = tab === 'semua' ? orders : orders.filter((o) => o.status === tab)
  const sorted = [...filtered].sort((a, b) => statusOrder[a.status] - statusOrder[b.status])

  return (
    <div className="page-container max-w-4xl">
      <span className="page-eyebrow">Riwayat belanja</span>
      <h1 className="page-title">Pesanan Saya</h1>
      <p className="page-subtitle">Pantau status belanja tanamanmu</p>

      {/* Tabs */}
      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.value ? 'bg-leaf-600 text-white shadow-soft' : 'bg-[var(--bg-card)] text-[var(--text-muted)] ring-1 ring-[var(--border-primary)] hover:bg-[var(--bg-card-hover)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : sorted.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon="🧾" title="Belum ada pesanan di tab ini" description="Yuk mulai belanja kebutuhan kebunmu!" actionLabel="Jelajahi produk" actionTo="/explore" />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {sorted.map((order) => {
            const meta = ORDER_STATUS[order.status]
            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block animate-fade-up rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 shadow-soft backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{order.id}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatDateTime(order.date)}</p>
                  </div>
                  <Badge className={meta.badge}>
                    {meta.icon} {meta.label}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <ProductVisual
                        key={`${order.id}-${item.productId ?? item.name ?? idx}`}
                        emoji={item.emoji}
                        gradient={item.gradient}
                        className="h-12 w-12 rounded-2xl border-2 border-white"
                        emojiClassName="text-lg"
                      />
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="truncate text-sm font-medium text-[var(--text-secondary)]">
                      {order.items.length > 1
                        ? `${order.items[0].name} +${order.items.length - 1} lainnya`
                        : order.items[0].name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {order.items.reduce((n, i) => n + i.qty, 0)} item
                    </p>
                  </div>
                  <p className="text-lg font-extrabold text-leaf-700">{formatRupiah(order.total)}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
