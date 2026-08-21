import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api/admin'
import { formatRupiah } from '../../utils/format'
import { ORDER_STATUS } from '../../types/constants'
import Loading from '../../components/ui/Loading'
import Badge from '../../components/ui/Badge'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getDashboard().then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Loading label="Memuat dashboard admin..." />
  if (!data) return null

  const { stats, recentOrders, userGrowth } = data
  const maxUsers = Math.max(...userGrowth.map((u) => u.count))

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Pengguna', value: stats.totalUsers, icon: '👥', color: 'bg-sky-100 text-sky-700' },
          { label: 'Total Toko', value: stats.totalStores, icon: '🏪', color: 'bg-amber-100 text-amber-800' },
          { label: 'Total Produk', value: stats.totalProducts, icon: '📦', color: 'bg-leaf-100 text-leaf-700' },
          { label: 'GMV', value: formatRupiah(stats.gmv), icon: '💰', color: 'bg-violet-100 text-violet-700' },
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
        {/* User growth */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">👥 Pertumbuhan Pengguna (7 Hari)</h2>
          <div className="mt-4 flex items-end gap-2 h-40">
            {userGrowth.map((u, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-sky-500 to-sky-400"
                  style={{ height: `${(u.count / maxUsers) * 100}%`, minHeight: '4px' }}
                />
                <p className="text-[9px] text-leaf-900/40">
                  {new Date(u.date).toLocaleDateString('id-ID', { weekday: 'short' })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">📊 Ringkasan</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between rounded-xl bg-leaf-50 px-4 py-3">
              <span className="text-sm text-leaf-900/60">Pesanan bulan ini</span>
              <span className="font-bold">{stats.totalOrders}</span>
            </div>
            <div className="flex justify-between rounded-xl bg-sky-50 px-4 py-3">
              <span className="text-sm text-leaf-900/60">Pengguna baru</span>
              <span className="font-bold">{stats.newUsersThisMonth}</span>
            </div>
            <div className="flex justify-between rounded-xl bg-amber-50 px-4 py-3">
              <span className="text-sm text-leaf-900/60">Toko aktif</span>
              <span className="font-bold">{stats.totalStores}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
        <h2 className="font-bold text-leaf-950">🆕 Pesanan Terbaru (Platform)</h2>
        <div className="mt-4 space-y-3">
          {recentOrders.map((order) => {
            const meta = ORDER_STATUS[order.status]
            return (
              <div key={order.id} className="flex items-center justify-between rounded-xl bg-leaf-50/50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-leaf-950">{order.id}</p>
                  <p className="text-xs text-leaf-900/50">{order.user?.name} · {order.store?.name}</p>
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
