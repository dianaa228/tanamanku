import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sellerApi } from '../../services/api/seller'
import { formatRupiah, formatDateTime } from '../../utils/format'
import { ORDER_STATUS } from '../../types/constants'
import Loading from '../../components/ui/Loading'
import Badge from '../../components/ui/Badge'

export default function SellerDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sellerApi.getDashboard().then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Loading label="Memuat dashboard..." />
  if (!data) return null

  const { stats, recentOrders, lowStockProducts, salesChart } = data
  const maxSales = Math.max(...salesChart.map((s) => s.total))

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Penjualan', value: formatRupiah(stats.totalSales), icon: '💰', color: 'bg-leaf-100 text-leaf-700' },
          { label: 'Total Pesanan', value: stats.totalOrders, icon: '📦', color: 'bg-sky-100 text-sky-700' },
          { label: 'Pesanan Baru', value: stats.newOrders, icon: '🆕', color: 'bg-amber-100 text-amber-800' },
          { label: 'Stok Menipis', value: stats.lowStock, icon: '⚠️', color: 'bg-rose-100 text-rose-700' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-leaf-900/50">{s.label}</p>
                <p className="mt-1 text-2xl font-extrabold text-leaf-950">{s.value}</p>
              </div>
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${s.color}`}>
                {s.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Sales chart */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">📈 Penjualan 7 Hari</h2>
          <div className="mt-4 flex items-end gap-2 h-40">
            {salesChart.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-leaf-500 to-leaf-400 transition-all"
                  style={{ height: `${(s.total / maxSales) * 100}%`, minHeight: '4px' }}
                />
                <p className="text-[9px] text-leaf-900/40">
                  {new Date(s.date).toLocaleDateString('id-ID', { weekday: 'short' })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">⚠️ Stok Menipis</h2>
          <div className="mt-4 space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-leaf-900/50">Semua stok aman ✅</p>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-leaf-950">{p.name}</p>
                    <p className="text-xs text-rose-600 font-semibold">Sisa {p.stock}</p>
                  </div>
                  <Link to="/seller/inventory" className="text-xs font-bold text-leaf-700 hover:text-leaf-800">
                    Atur →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-leaf-950">🆕 Pesanan Terbaru</h2>
          <Link to="/seller/orders" className="text-sm font-semibold text-leaf-700 hover:text-leaf-800">
            Lihat semua →
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {recentOrders.map((order) => {
            const meta = ORDER_STATUS[order.status]
            return (
              <div key={order.id} className="flex items-center justify-between rounded-xl bg-leaf-50/50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-leaf-950">{order.id}</p>
                  <p className="text-xs text-leaf-900/50">{order.user?.name} · {formatDateTime(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={meta.badge}>{meta.icon} {meta.label}</Badge>
                  <p className="text-sm font-bold text-leaf-700">{formatRupiah(order.total)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
