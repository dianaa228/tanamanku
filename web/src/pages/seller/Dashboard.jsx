import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sellerApi } from '../../services/api/seller'
import { formatRupiah, formatDateTime } from '../../utils/format'
import { ORDER_STATUS } from '../../types/constants'
import Loading from '../../components/ui/Loading'
import Badge from '../../components/ui/Badge'

const quickActions = [
  { icon: '📦', label: 'Kelola Produk', to: '/seller/products', color: 'from-leaf-400 to-emerald-600', desc: 'Tambah & edit produk' },
  { icon: '🧾', label: 'Pesanan Baru', to: '/seller/orders', color: 'from-sky-400 to-blue-600', desc: 'Proses pesanan masuk' },
  { icon: '📋', label: 'Inventaris', to: '/seller/inventory', color: 'from-amber-400 to-orange-600', desc: 'Cek & update stok' },
  { icon: '💰', label: 'Penjualan', to: '/seller/sales', color: 'from-violet-400 to-purple-600', desc: 'Laporan keuangan' },
]

export default function SellerDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sellerApi.getDashboard()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading label="Memuat dashboard..." />
  if (!data) return null

  const { stats, recentOrders, lowStockProducts, salesChart } = data
  const maxSales = Math.max(...salesChart.map((s) => s.total))

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="rounded-3xl bg-gradient-to-r from-leaf-500 via-leaf-600 to-emerald-600 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">🏪 Seller Dashboard</h1>
            <p className="mt-1 text-leaf-100/80">Kelola toko dan produk Anda dari satu tempat.</p>
          </div>
          <Link to="/seller/products/create" className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-leaf-700 shadow-sm transition hover:shadow-md">
            ➕ Tambah Produk
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Penjualan', value: formatRupiah(stats.totalSales), icon: '💰', color: 'from-leaf-400 to-emerald-600', change: '+12%' },
          { label: 'Total Pesanan', value: stats.totalOrders, icon: '📦', color: 'from-sky-400 to-blue-600', change: '+5' },
          { label: 'Pesanan Baru', value: stats.newOrders, icon: '🆕', color: 'from-amber-400 to-orange-600', change: 'Menunggu' },
          { label: 'Stok Menipis', value: stats.lowStock, icon: '⚠️', color: 'from-rose-400 to-pink-600', change: stats.lowStock > 0 ? 'Perlu diatur' : 'Aman' },
        ].map((s) => (
          <div key={s.label} className="group rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-leaf-900/50">{s.label}</p>
                <p className="mt-1 text-2xl font-extrabold text-leaf-950">{s.value}</p>
              </div>
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-2xl shadow-soft transition-transform group-hover:scale-110`}>
                {s.icon}
              </span>
            </div>
            <div className="mt-3 text-xs font-semibold text-leaf-600">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
        <h2 className="font-bold text-leaf-950">⚡ Aksi Cepat</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group relative overflow-hidden rounded-2xl border border-leaf-100 p-4 transition-all hover:-translate-y-1 hover:border-leaf-200 hover:shadow-md"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} text-2xl shadow-soft transition-transform group-hover:scale-110`}>
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
        {/* Sales Chart */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-leaf-950">📈 Penjualan 7 Hari Terakhir</h2>
            <Link to="/seller/analytics" className="text-xs font-semibold text-leaf-600 hover:text-leaf-700">
              Detail →
            </Link>
          </div>
          <div className="mt-4 flex items-end gap-2 h-48 overflow-x-auto">
            {salesChart.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-leaf-700">{formatRupiah(s.total, false)}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-leaf-600 to-leaf-400 transition-all hover:from-leaf-700 hover:to-leaf-500"
                  style={{ height: `${(s.total / maxSales) * 100}%`, minHeight: '4px' }}
                />
                <p className="text-[9px] text-leaf-900/40">
                  {new Date(s.date).toLocaleDateString('id-ID', { weekday: 'short' })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-leaf-950">⚠️ Stok Menipis</h2>
            <Link to="/seller/inventory" className="text-xs font-semibold text-leaf-600 hover:text-leaf-700">
              Atur Semua →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="rounded-xl bg-emerald-50 p-4 text-center">
                <span className="text-3xl">✅</span>
                <p className="mt-2 text-sm font-semibold text-emerald-700">Semua stok aman!</p>
                <p className="text-xs text-emerald-600">Tidak ada produk yang perlu diisi ulang.</p>
              </div>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 transition hover:bg-rose-100">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-lg">
                      ⚠️
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-leaf-950">{p.name}</p>
                      <p className="text-xs font-bold text-rose-600">Sisa {p.stock}</p>
                    </div>
                  </div>
                  <Link to="/seller/inventory" className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-leaf-700 shadow-sm transition hover:shadow-md">
                    Atur →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
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
              <div key={order.id} className="flex items-center justify-between rounded-xl bg-leaf-50/50 px-4 py-3 transition hover:bg-leaf-50">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-100 text-lg">
                    📦
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-leaf-950">{order.id}</p>
                    <p className="text-xs text-leaf-900/50">{order.user?.name} · {formatDateTime(order.created_at)}</p>
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

      {/* Seller Tips */}
      <div className="rounded-2xl border border-leaf-100 bg-gradient-to-r from-leaf-50 to-emerald-50 p-6">
        <h3 className="font-bold text-leaf-950">💡 Tips Seller</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            { icon: '📸', title: 'Foto Produk', desc: 'Gunakan foto berkualitas tinggi untuk menarik pembeli.' },
            { icon: '📝', title: 'Deskripsi Lengkap', desc: 'Jelaskan produk dengan detail: ukuran, perawatan, manfaat.' },
            { icon: '⚡', title: 'Respon Cepat', desc: 'Balas pertanyaan pembeli dalam waktu singkat.' },
          ].map((tip) => (
            <div key={tip.title} className="flex items-start gap-3 rounded-xl bg-white p-4">
              <span className="text-2xl">{tip.icon}</span>
              <div>
                <p className="text-sm font-bold text-leaf-950">{tip.title}</p>
                <p className="mt-0.5 text-xs text-leaf-900/60">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
