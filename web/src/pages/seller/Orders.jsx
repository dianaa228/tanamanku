import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sellerApi } from '../../services/api/seller'
import { formatRupiah, formatDateTime } from '../../utils/format'
import { ORDER_STATUS } from '../../types/constants'
import Badge from '../../components/ui/Badge'
import Loading from '../../components/ui/Loading'
import Button from '../../components/ui/Button'

export default function SellerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('semua')

  useEffect(() => {
    sellerApi.getOrders()
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleStatus = async (orderId, status) => {
    await sellerApi.updateOrderStatus(orderId, status)
    setOrders(orders.map((o) => o.id === orderId ? { ...o, status } : o))
  }

  const tabs = [
    { value: 'semua', label: 'Semua' },
    { value: 'pending', label: 'Baru' },
    { value: 'processing', label: 'Diproses' },
    { value: 'shipped', label: 'Dikirim' },
    { value: 'completed', label: 'Selesai' },
  ]

  const filtered = tab === 'semua' ? orders : orders.filter((o) => o.status === tab)

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.value ? 'bg-leaf-600 text-white' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-leaf-200 bg-leaf-50/50 px-6 py-16 text-center">
            <p className="text-4xl">📦</p>
            <p className="mt-2 text-sm font-semibold text-leaf-900/60">Tidak ada pesanan di tab ini</p>
          </div>
        ) : (
          filtered.map((order) => {
            const meta = ORDER_STATUS[order.status]
            return (
              <div key={order.id} className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-leaf-950">{order.id}</p>
                    <p className="text-xs text-leaf-900/50">{order.user?.name} · {formatDateTime(order.createdAt || order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={meta.badge}>{meta.icon} {meta.label}</Badge>
                    <p className="font-extrabold text-leaf-700">{formatRupiah(order.total)}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-3 text-sm text-leaf-900/60">
                  {(order.items || []).map((i) => i.product?.name || `Produk #${i.productId}`).join(', ')}
                </div>

                {/* Actions */}
                {order.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={() => handleStatus(order.id, 'processing')}>
                      📦 Proses Pesanan
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleStatus(order.id, 'cancelled')}>
                      ✖️ Tolak
                    </Button>
                  </div>
                )}
                {order.status === 'processing' && (
                  <div className="mt-3">
                    <Button size="sm" onClick={() => handleStatus(order.id, 'shipped')}>
                      🚚 Tandai Dikirim
                    </Button>
                  </div>
                )}
                {order.status === 'shipped' && (
                  <div className="mt-3">
                    <Button size="sm" onClick={() => handleStatus(order.id, 'delivered')}>
                      ✅ Tandai Terkirim
                    </Button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
