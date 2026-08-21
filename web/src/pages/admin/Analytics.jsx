import { useEffect, useState } from 'react'
import { adminAnalyticsApi } from '../../services/api/adminAnalytics'
import { formatRupiah, cx } from '../../utils/format'
import Loading from '../../components/ui/Loading'

export default function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAnalyticsApi.getAnalytics().then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Loading label="Memuat analytics platform..." />
  if (!data) return null

  const { overview, userGrowth, revenueByMonth, topSellers, topCategories, recentActivity, systemHealth, ordersByStatus, dailyOrders } = data

  const maxUser = Math.max(...userGrowth.map((u) => u.users))
  const maxRevenue = Math.max(...revenueByMonth.map((r) => r.revenue))
  const maxOrders = Math.max(...dailyOrders.map((d) => d.orders))
  const totalStatus = ordersByStatus.reduce((s, b) => s + b.count, 0)

  const StatCard = ({ label, value, growth, icon, color }) => (
    <div className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-leaf-900/50">{label}</p>
          <p className="mt-1 text-2xl font-extrabold text-leaf-950">{value}</p>
          {growth != null && (
            <p className={cx('mt-0.5 text-xs font-semibold', growth >= 0 ? 'text-leaf-600' : 'text-rose-600')}>
              {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}%
            </p>
          )}
        </div>
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${color}`}>
          {icon}
        </span>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-leaf-950">📊 Platform Analytics</h1>
        <p className="mt-1 text-sm text-leaf-900/50">Overview aktivitas seluruh platform Tanamanku</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Pengguna" value={overview.totalUsers.toLocaleString()} growth={overview.usersGrowth} icon="👥" color="bg-leaf-100 text-leaf-700" />
        <StatCard label="Total Seller" value={overview.totalSellers} growth={overview.sellersGrowth} icon="🏪" color="bg-sky-100 text-sky-700" />
        <StatCard label="Total Produk" value={overview.totalProducts.toLocaleString()} growth={overview.productsGrowth} icon="📦" color="bg-violet-100 text-violet-700" />
        <StatCard label="Total Pendapatan" value={formatRupiah(overview.totalRevenue)} growth={overview.revenueGrowth} icon="💰" color="bg-sun-100 text-sun-700" />
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-leaf-50 px-4 py-3 text-center">
          <p className="text-2xl font-extrabold text-leaf-700">{overview.activeToday}</p>
          <p className="text-xs text-leaf-900/50">Aktif Hari Ini</p>
        </div>
        <div className="rounded-xl bg-sky-50 px-4 py-3 text-center">
          <p className="text-2xl font-extrabold text-sky-700">{overview.newToday}</p>
          <p className="text-xs text-leaf-900/50">Pengguna Baru</p>
        </div>
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-center">
          <p className="text-2xl font-extrabold text-amber-700">{overview.totalOrders}</p>
          <p className="text-xs text-leaf-900/50">Total Pesanan</p>
        </div>
        <div className="rounded-xl bg-violet-50 px-4 py-3 text-center">
          <p className="text-2xl font-extrabold text-violet-700">{overview.ordersGrowth}%</p>
          <p className="text-xs text-leaf-900/50">Pesanan Growth</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Growth */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">📈 Pertumbuhan Pengguna</h2>
          <div className="mt-4 flex items-end gap-3 h-44">
            {userGrowth.map((u, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-[10px] font-semibold text-leaf-700">{u.users}</p>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-leaf-600 to-leaf-400"
                  style={{ height: `${(u.users / maxUser) * 100}%`, minHeight: '4px' }}
                />
                <p className="text-xs font-semibold text-leaf-900/60">{u.month}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-leaf-900/50">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-leaf-500" />
              Pengguna
            </span>
            <span>📈 {userGrowth[userGrowth.length - 1].sellers} seller aktif</span>
          </div>
        </div>

        {/* Revenue by Month */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">💰 Pendapatan Bulanan</h2>
          <div className="mt-4 flex items-end gap-3 h-44">
            {revenueByMonth.map((r, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-[10px] font-semibold text-leaf-700">{formatRupiah(r.revenue)}</p>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-sun-500 to-sun-400"
                  style={{ height: `${(r.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                />
                <p className="text-xs font-semibold text-leaf-900/60">{r.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Sellers */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">🏆 Top Sellers</h2>
          <div className="mt-4 space-y-4">
            {topSellers.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={cx(
                  'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold',
                  i === 0 ? 'bg-sun-100 text-sun-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-amber-100 text-amber-700' : 'bg-leaf-50 text-leaf-600',
                )}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-leaf-950 truncate">{s.name}</p>
                  <p className="text-[11px] text-leaf-900/40">
                    {s.orders} pesanan · ⭐ {s.rating}
                  </p>
                </div>
                <p className="text-sm font-bold text-leaf-700">{formatRupiah(s.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">🏷️ Kategori Teratas</h2>
          <div className="mt-4 space-y-4">
            {topCategories.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-leaf-950">{c.name}</p>
                  <p className="text-xs font-bold text-leaf-700">{c.percentage}%</p>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-leaf-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-leaf-500 to-leaf-400"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
                <p className="mt-0.5 text-[11px] text-leaf-900/40">{c.products} produk · {formatRupiah(c.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders by Status */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">📦 Status Pesanan</h2>
          <div className="mt-4 flex justify-center">
            <div className="relative h-40 w-40">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                {ordersByStatus.reduce((acc, b) => {
                  const pct = (b.count / totalStatus) * 100
                  const colors = {
                    completed: '#22c55e', shipped: '#6366f1', processing: '#3b82f6',
                    pending: '#f59e0b', cancelled: '#ef4444', refunded: '#94a3b8',
                  }
                  acc.elements.push(
                    <circle key={b.status} cx="18" cy="18" r="15.915" fill="none"
                      stroke={colors[b.status] || '#94a3b8'} strokeWidth="3"
                      strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={`${-acc.offset}`} />
                  )
                  acc.offset += pct
                  return acc
                }, { elements: [], offset: 0 }).elements}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-extrabold text-leaf-950">{totalStatus}</p>
                <p className="text-[10px] text-leaf-900/40">Total</p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {ordersByStatus.map((b) => (
              <div key={b.status} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: { completed: '#22c55e', shipped: '#6366f1', processing: '#3b82f6', pending: '#f59e0b', cancelled: '#ef4444', refunded: '#94a3b8' }[b.status] }} />
                  <span className="text-leaf-900/70 capitalize">{b.status}</span>
                </span>
                <span className="font-semibold text-leaf-950">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">🔧 System Health</h2>
          <div className="mt-4 space-y-4">
            {[
              { label: 'API Uptime', value: `${systemHealth.apiUptime}%`, icon: '🟢', color: 'bg-leaf-50' },
              { label: 'Avg Response Time', value: `${systemHealth.avgResponseTime}ms`, icon: '⚡', color: 'bg-sky-50' },
              { label: 'Error Rate', value: `${systemHealth.errorRate}%`, icon: '🔴', color: 'bg-rose-50' },
              { label: 'Active Connections', value: systemHealth.activeConnections, icon: '🔗', color: 'bg-violet-50' },
            ].map((s, i) => (
              <div key={i} className={cx('flex items-center justify-between rounded-xl px-4 py-3', s.color)}>
                <div className="flex items-center gap-2">
                  <span>{s.icon}</span>
                  <span className="text-sm font-semibold text-leaf-950">{s.label}</span>
                </div>
                <span className="text-sm font-bold text-leaf-700">{s.value}</span>
              </div>
            ))}

            {/* Storage */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-semibold text-leaf-950">💾 Storage</span>
                <span className="text-leaf-900/60">{systemHealth.storageUsed}GB / {systemHealth.storageTotal}GB</span>
              </div>
              <div className="h-3 rounded-full bg-leaf-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-leaf-500 to-leaf-400"
                  style={{ width: `${(systemHealth.storageUsed / systemHealth.storageTotal) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Orders */}
      <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
        <h2 className="font-bold text-leaf-950">📅 Pesanan Harian (7 Hari)</h2>
        <div className="mt-4 flex items-end gap-2 h-32">
          {dailyOrders.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <p className="text-[10px] font-semibold text-leaf-700">{d.orders}</p>
              <div
                className={cx('w-full rounded-t transition-all', d.orders === maxOrders ? 'bg-gradient-to-t from-sun-500 to-sun-400' : 'bg-gradient-to-t from-leaf-500 to-leaf-400')}
                style={{ height: `${(d.orders / maxOrders) * 100}%`, minHeight: '4px' }}
              />
              <p className="text-[9px] text-leaf-900/40">
                {new Date(d.date).toLocaleDateString('id-ID', { weekday: 'short' })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
        <h2 className="font-bold text-leaf-950">🕐 Aktivitas Terbaru</h2>
        <div className="mt-4 space-y-3">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-leaf-50/50 px-4 py-3">
              <span className="text-xl">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-leaf-950">{a.message}</p>
                <p className="text-xs text-leaf-900/50">{a.detail}</p>
              </div>
              <span className="text-xs text-leaf-900/40 shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
