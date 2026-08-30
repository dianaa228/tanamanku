import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../services/api/admin'
import { statsApi } from '../../services/api/stats'
import { formatRupiah } from '../../utils/format'
import { ORDER_STATUS } from '../../types/constants'
import Loading from '../../components/ui/Loading'
import Badge from '../../components/ui/Badge'
import ThemeToggle from '../../components/ui/ThemeToggle'

const quickActions = [
  { icon: '👥', label: 'Kelola Pengguna', to: '/admin/users', color: 'from-sky-400 to-blue-600', desc: 'Lihat & kelola semua pengguna' },
  { icon: '🏪', label: 'Kelola Toko', to: '/admin/stores', color: 'from-amber-400 to-orange-600', desc: 'Verifikasi & manage toko' },
  { icon: '📦', label: 'Kelola Produk', to: '/admin/categories', color: 'from-leaf-400 to-emerald-600', desc: 'Atur kategori & produk' },
  { icon: '🧾', label: 'Kelola Pesanan', to: '/admin/orders', color: 'from-violet-400 to-purple-600', desc: 'Monitor semua pesanan' },
  { icon: '💳', label: 'Pembayaran', to: '/admin/payments', color: 'from-rose-400 to-pink-600', desc: 'Review pembayaran' },
  { icon: '💬', label: 'Komunitas', to: '/admin/community', color: 'from-teal-400 to-cyan-600', desc: 'Moderasi konten' },
  { icon: '📈', label: 'Laporan', to: '/admin/reports', color: 'from-indigo-400 to-indigo-700', desc: 'Analisis performa' },
  { icon: '⚙️', label: 'Pengaturan', to: '/admin/settings', color: 'from-gray-400 to-gray-600', desc: 'Konfigurasi platform' },
]

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [siteStats, setSiteStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      adminApi.getDashboard(),
      statsApi.getStats(),
    ]).then(([dashRes, statsRes]) => {
      if (dashRes.status === 'fulfilled') setData(dashRes.value.data)
      if (statsRes.status === 'fulfilled') setSiteStats(statsRes.value.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading label="Memuat dashboard admin..." />
  if (!data) return null

  const { stats, recentOrders, userGrowth } = data
  const maxUsers = Math.max(...userGrowth.map((u) => u.count), 1)

  const platformStats = [
    { icon: '🛒', label: 'Total Transaksi', value: stats.totalOrders || 0, change: '+12%', trend: 'up', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { icon: '💰', label: 'Revenue', value: formatRupiah(stats.gmv || 0), change: '+8%', trend: 'up', color: 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
    { icon: '👥', label: 'Total Pengguna', value: stats.totalUsers || 0, change: `+${stats.newUsersThisMonth || 0}`, trend: 'up', color: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
    { icon: '🏪', label: 'Toko Aktif', value: stats.totalStores || 0, change: '+2', trend: 'up', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    { icon: '📦', label: 'Total Produk', value: siteStats?.products || stats.totalProducts || 0, change: '+5%', trend: 'up', color: 'bg-leaf-50 text-leaf-700 dark:bg-leaf-900/30 dark:text-leaf-400' },
    { icon: '🪴', label: 'Nursery', value: siteStats?.nurseries || 0, change: '+1', trend: 'up', color: 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="rounded-3xl bg-gradient-to-r from-leaf-600 via-leaf-700 to-emerald-700 p-6 text-white shadow-lg sm:p-8 dark:from-leaf-800 dark:via-leaf-900 dark:to-emerald-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">🛡️ Admin Panel</h1>
            <p className="mt-1 text-leaf-100/80">Selamat datang di pusat kontrol Tanamanku. Kelola seluruh platform dari sini.</p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle className="bg-white/20 text-white hover:bg-white/30" />
            <Link to="/admin/analytics" className="rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30">
              📊 Analytics
            </Link>
            <Link to="/" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-leaf-700 shadow-sm transition hover:bg-white/90">
              🏪 Lihat Toko
            </Link>
          </div>
        </div>
      </div>

      {/* Platform Stats - from Database */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {platformStats.map((s) => (
          <div key={s.label} className="group rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 shadow-soft backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-muted)]">{s.label}</p>
                <p className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">{s.value}</p>
              </div>
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-transform group-hover:scale-110 ${s.color}`}>
                {s.icon}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>{s.change}</span>
              <span className="text-leaf-900/40 dark:text-sage-500">vs bulan lalu</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-soft backdrop-blur-sm">
        <h2 className="font-bold text-[var(--text-primary)]">⚡ Aksi Cepat</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border-primary)] p-4 transition-all hover:-translate-y-1 hover:border-leaf-400/50 hover:shadow-md"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} text-3xl shadow-soft transition-transform group-hover:scale-110`}>
                {action.icon}
              </div>
              <p className="mt-3 text-sm font-bold text-[var(--text-primary)]">{action.label}</p>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{action.desc}</p>
              <span className="absolute right-3 top-3 text-leaf-200 transition-all group-hover:right-2 group-hover:text-leaf-400 dark:text-sage-600">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* User Growth Chart */}
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-soft backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[var(--text-primary)]">📈 Pertumbuhan Pengguna (7 Hari)</h2>
            <Link to="/admin/analytics" className="text-xs font-semibold text-leaf-600 hover:text-leaf-700 dark:text-leaf-400">
              Detail →
            </Link>
          </div>
          <div className="mt-4 flex items-end gap-2 h-48 overflow-x-auto">
            {userGrowth.map((u, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-[var(--text-primary)]">{u.count}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-sky-600 to-sky-400 transition-all hover:from-sky-700 hover:to-sky-500 dark:from-sky-500 dark:to-sky-300"
                  style={{ height: `${(u.count / maxUsers) * 100}%`, minHeight: '4px' }}
                />
                <p className="text-[9px] text-leaf-900/40 dark:text-sage-500">
                  {new Date(u.date).toLocaleDateString('id-ID', { weekday: 'short' })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Summary */}
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-soft backdrop-blur-sm">
          <h2 className="font-bold text-[var(--text-primary)]">📊 Ringkasan Platform</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: 'Pesanan Aktif', value: stats.totalOrders, icon: '🧾', bg: 'bg-leaf-800/20' },
              { label: 'Pengguna Baru', value: stats.newUsersThisMonth, icon: '🆕', bg: 'bg-sky-800/20' },
              { label: 'Toko Aktif', value: stats.totalStores, icon: '🏪', bg: 'bg-amber-800/20' },
              { label: 'Total Produk', value: siteStats?.products || stats.totalProducts, icon: '📦', bg: 'bg-violet-800/20' },
              { label: 'Nursery Lokal', value: siteStats?.nurseries || 0, icon: '🪴', bg: 'bg-teal-800/20' },
              { label: 'Kebun Aktif', value: siteStats?.gardens || 0, icon: '🌱', bg: 'bg-emerald-800/20' },
            ].map((item) => (
              <div key={item.label} className={`flex items-center justify-between rounded-xl ${item.bg} px-4 py-3`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                </div>
                <span className="font-bold text-[var(--text-primary)]">{item.value}</span>
              </div>
            ))}
          </div>
          <Link to="/admin/analytics" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-leaf-800/20 py-3 text-sm font-bold text-leaf-400 transition hover:bg-leaf-700/30">
            📈 Lihat Analytics Lengkap
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-soft backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-[var(--text-primary)]">🆕 Pesanan Terbaru (Platform)</h2>
          <Link to="/admin/orders" className="text-sm font-semibold text-leaf-700 hover:text-leaf-800 dark:text-leaf-400">
            Lihat semua →
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {recentOrders.map((order) => {
            const meta = ORDER_STATUS[order.status] || { badge: 'bg-gray-100 text-gray-700', icon: '❓', label: order.status }
            return (
              <div key={order.id} className="flex items-center justify-between rounded-xl bg-[var(--bg-card)] px-4 py-3 transition hover:bg-[var(--bg-card-hover)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-100 text-lg dark:bg-sage-700">
                    📦
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{order.order_number || order.id}</p>
                    <p className="text-xs text-[var(--text-muted)]">{order.user?.name} · {order.store?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={meta.badge}>{meta.icon} {meta.label}</Badge>
                  <p className="text-sm font-bold text-leaf-700 dark:text-leaf-300">{formatRupiah(order.total)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Admin Info */}
      <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-leaf-950 dark:text-white">🛡️ Mode Admin Aktif</h3>
            <p className="mt-1 text-sm text-leaf-900/60 dark:text-sage-400">Anda memiliki akses penuh ke semua fitur platform, termasuk Seller Panel.</p>
          </div>
          <Link to="/seller" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-leaf-700 shadow-sm transition hover:shadow-md dark:bg-sage-800 dark:text-leaf-300">
            🏪 Buka Seller Panel
          </Link>
        </div>
      </div>
    </div>
  )
}
