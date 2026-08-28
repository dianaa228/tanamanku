import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api/admin'
import { formatRupiah } from '../../utils/format'
import Loading from '../../components/ui/Loading'

export default function AdminReports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getDashboard()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  if (!data) return null

  const { stats, userGrowth } = data

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-leaf-950">📊 Laporan & Analitik Platform</h2>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft">
          <p className="text-sm text-leaf-900/50">Total Pendapatan Platform</p>
          <p className="mt-1 text-2xl font-extrabold text-leaf-700">{formatRupiah(stats.gmv)}</p>
        </div>
        <div className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft">
          <p className="text-sm text-leaf-900/50">Total Transaksi</p>
          <p className="mt-1 text-2xl font-extrabold text-leaf-950">{stats.totalOrders}</p>
        </div>
        <div className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft">
          <p className="text-sm text-leaf-900/50">Rata-rata per Transaksi</p>
          <p className="mt-1 text-2xl font-extrabold text-leaf-950">
            {formatRupiah(Math.round(stats.gmv / stats.totalOrders))}
          </p>
        </div>
        <div className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft">
          <p className="text-sm text-leaf-900/50">Pengguna Baru Bulan Ini</p>
          <p className="mt-1 text-2xl font-extrabold text-sky-600">{stats.newUsersThisMonth}</p>
        </div>
      </div>

      {/* User growth chart */}
      <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
        <h3 className="font-bold text-leaf-950">📈 Pertumbuhan Pengguna Mingguan</h3>
        <div className="mt-4 flex items-end gap-3 h-48 overflow-x-auto">
          {userGrowth.map((u, i) => {
            const max = Math.max(...userGrowth.map((d) => d.count))
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-xs font-bold text-leaf-700">{u.count}</p>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-leaf-600 to-leaf-400"
                  style={{ height: `${(u.count / max) * 100}%`, minHeight: '4px' }}
                />
                <p className="text-[10px] text-leaf-900/40">
                  {new Date(u.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Domain breakdown */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Marketplace', icon: '🛒', value: stats.totalProducts, desc: 'Total produk aktif' },
          { label: 'Komersial', icon: '💰', value: formatRupiah(stats.gmv), desc: 'Gross Merchandise Value' },
          { label: 'Komunitas', icon: '💬', value: stats.totalUsers, desc: 'Total pengguna terdaftar' },
        ].map((d) => (
          <div key={d.label} className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft">
            <span className="text-2xl">{d.icon}</span>
            <p className="mt-2 font-bold text-leaf-950">{d.label}</p>
            <p className="text-2xl font-extrabold text-leaf-700">{d.value}</p>
            <p className="text-xs text-leaf-900/50">{d.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
