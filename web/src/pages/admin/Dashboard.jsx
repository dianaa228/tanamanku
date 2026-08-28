import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../services/api/admin'
import { formatRupiah } from '../../utils/format'
import { ORDER_STATUS } from '../../types/constants'
import Loading from '../../components/ui/Loading'
import Badge from '../../components/ui/Badge'

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

const platformStats = [
  { icon: '🛒', label: 'Total Transaksi', value: '1,247', change: '+12%', trend: 'up', color: 'bg-emerald-50 text-emerald-700' },
  { icon: '💰', label: 'Revenue Bulan Ini', value: 'Rp 48.7 Jt', change: '+8%', trend: 'up', color: 'bg-sky-50 text-sky-700' },
  { icon: '👥', label: 'Pengguna Aktif', value: '892', change: '+15%', trend: 'up', color: 'bg-violet-50 text-violet-700' },
  { icon: '🏪', label: 'Toko Verified', value: '12', change: '+2', trend: 'up', color: 'bg-amber-50 text-amber-700' },
]

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
      {/* Welcome Header */}
      <div className="rounded-3xl bg-gradient-to-r from-leaf-600 via-leaf-700 to-emerald-700 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">🛡️ Admin Panel</h1>
            <p className="mt-1 text-leaf-100/80">Selamat datang di pusat kontrol Tanamanku. Kelola seluruh platform dari sini.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/analytics" className="rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30">
              📊 Analytics
            </Link>
            <Link to="/" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-leaf-700 shadow-sm transition hover:bg-white/90">
              🏪 Lihat Toko
            </Link>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((s) => (
          <div key={s.label} className="group rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-leaf-900/50">{s.label}</p>
                <p className="mt-1 text-2xl font-extrabold text-leaf-950">{s.value}</p>
              </div>
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition-transform group-hover:scale-110 ${s.color}`}>
                {s.icon}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <span>{s.change}</span>
              <span className="text-leaf-900/40">vs bulan lalu</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
        <h2 className="font-bold text-leaf-950">⚡ Aksi Cepat</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group relative overflow-hidden rounded-2xl border border-leaf-100 p-4 transition-all hover:-translate-y-1 hover:border-leaf-200 hover:shadow-md"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} text-3xl shadow-soft transition-transform group-hover:scale-110`}>
                {action.icon}
              </div>
              <p className="mt-3 text-sm font-bold text-leaf-950">{action.label}</p>
              <p className="mt-0.5 text-xs text-leaf-900/50">{action.desc}</p>
              <span className="absolute right-3 top-3 text-leaf-200 transition-all group-hover:right-2 group-hover:text-leaf-400">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* User Growth Chart */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-leaf-950">📈 Pertumbuhan Pengguna (7 Hari)</h2>
            <Link to="/admin/analytics" className="text-xs font-semibold text-leaf-600 hover:text-leaf-700">
              Detail →
            </Link>
          </div>
          <div className="mt-4 flex items-end gap-2 h-48 overflow-x-auto">
            {userGrowth.map((u, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-leaf-700">{u.count}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-sky-600 to-sky-400 transition-all hover:from-sky-700 hover:to-sky-500"
                  style={{ height: `${(u.count / maxUsers) * 100}%`, minHeight: '4px' }}
                />
                <p className="text-[9px] text-leaf-900/40">
                  {new Date(u.date).toLocaleDateString('id-ID', { weekday: 'short' })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Summary */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">📊 Ringkasan Platform</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: 'Pesanan Aktif', value: stats.totalOrders, icon: '🧾', bg: 'bg-leaf-50' },
              { label: 'Pengguna Baru', value: stats.newUsersThisMonth, icon: '🆕', bg: 'bg-sky-50' },
              { label: 'Toko Aktif', value: stats.totalStores, icon: '🏪', bg: 'bg-amber-50' },
              { label: 'Total Produk', value: stats.totalProducts, icon: '📦', bg: 'bg-violet-50' },
            ].map((item) => (
              <div key={item.label} className={`flex items-center justify-between rounded-xl ${item.bg} px-4 py-3`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-leaf-900/60">{item.label}</span>
                </div>
                <span className="font-bold text-leaf-950">{item.value}</span>
              </div>
            ))}
          </div>
          <Link to="/admin/analytics" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-leaf-50 py-3 text-sm font-bold text-leaf-700 transition hover:bg-leaf-100">
            📈 Lihat Analytics Lengkap
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-leaf-950">🆕 Pesanan Terbaru (Platform)</h2>
          <Link to="/admin/orders" className="text-sm font-semibold text-leaf-700 hover:text-leaf-800">
            Lihat semua →
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {recentOrders.map((order) => {
            const meta = ORDER_STATUS[order.status]
            return (
              <div key={order.id} className="flex items-center justify-between rounded-xl bg-leaf-50/50 px-4 py-3 transition hover:bg-leaf-50">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-100 text-lg">
                    📦
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-leaf-950">{order.id}</p>
                    <p className="text-xs text-leaf-900/50">{order.user?.name} · {order.store?.name}</p>
                  </div>
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

      {/* Admin Info */}
      <div className="rounded-2xl border border-leaf-100 bg-gradient-to-r from-leaf-50 to-emerald-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-leaf-950">🛡️ Mode Admin Aktif</h3>
            <p className="mt-1 text-sm text-leaf-900/60">Anda memiliki akses penuh ke semua fitur platform, termasuk Seller Panel.</p>
          </div>
          <Link to="/seller" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-leaf-700 shadow-sm transition hover:shadow-md">
            🏪 Buka Seller Panel
          </Link>
        </div>
      </div>
    </div>
  )
}
