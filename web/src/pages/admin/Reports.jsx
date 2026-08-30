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
      <h2 className="text-xl font-extrabold text-[var(--text-primary)]">📊 Laporan & Analitik Platform</h2>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 shadow-soft backdrop-blur-sm">
          <p className="text-sm text-[var(--text-muted)]">Total Pendapatan Platform</p>
          <p className="mt-1 text-2xl font-extrabold text-leaf-400">{formatRupiah(stats.gmv)}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 shadow-soft backdrop-blur-sm">
          <p className="text-sm text-[var(--text-muted)]">Total Transaksi</p>
          <p className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">{stats.totalOrders}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 shadow-soft backdrop-blur-sm">
          <p className="text-sm text-[var(--text-muted)]">Rata-rata per Transaksi</p>
          <p className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">
            {formatRupiah(Math.round(stats.gmv / stats.totalOrders))}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 shadow-soft backdrop-blur-sm">
          <p className="text-sm text-[var(--text-muted)]">Pengguna Baru Bulan Ini</p>
          <p className="mt-1 text-2xl font-extrabold text-sky-400">{stats.newUsersThisMonth}</p>
        </div>
      </div>

      {/* User growth chart */}
      <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-soft backdrop-blur-sm">
        <h3 className="font-bold text-[var(--text-primary)]">📈 Pertumbuhan Pengguna Mingguan</h3>
        <div className="mt-4 flex items-end gap-3 h-48 overflow-x-auto">
          {userGrowth.map((u, i) => {
            const max = Math.max(...userGrowth.map((d) => d.count))
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-xs font-bold text-[var(--text-primary)]">{u.count}</p>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-leaf-600 to-leaf-400"
                  style={{ height: `${(u.count / max) * 100}%`, minHeight: '4px' }}
                />
                <p className="text-[10px] text-[var(--text-muted)]">
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
          <div key={d.label} className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 shadow-soft backdrop-blur-sm">
            <span className="text-2xl">{d.icon}</span>
            <p className="mt-2 font-bold text-[var(--text-primary)]">{d.label}</p>
            <p className="text-2xl font-extrabold text-leaf-400">{d.value}</p>
            <p className="text-xs text-[var(--text-muted)]">{d.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
