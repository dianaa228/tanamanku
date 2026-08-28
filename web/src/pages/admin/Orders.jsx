import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api/admin'
import { formatRupiah, formatDateTime } from '../../utils/format'
import { ORDER_STATUS } from '../../types/constants'
import Badge from '../../components/ui/Badge'
import Loading from '../../components/ui/Loading'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('semua')
  const [search, setSearch] = useState('')

  useEffect(() => {
    adminApi.getOrders()
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const tabs = [
    { value: 'semua', label: 'Semua', count: orders.length },
    { value: 'pending', label: '⏳ Menunggu', count: orders.filter(o => o.status === 'pending').length },
    { value: 'processing', label: '📦 Diproses', count: orders.filter(o => o.status === 'processing').length },
    { value: 'shipped', label: '🚚 Dikirim', count: orders.filter(o => o.status === 'shipped').length },
    { value: 'completed', label: '✅ Selesai', count: orders.filter(o => o.status === 'completed').length },
    { value: 'cancelled', label: '❌ Batal', count: orders.filter(o => o.status === 'cancelled').length },
  ]

  const filtered = orders.filter((o) => {
    if (tab !== 'semua' && o.status !== tab) return false
    if (search) {
      const q = search.toLowerCase()
      return (o.id || '').toLowerCase().includes(q) ||
             (o.user?.name || '').toLowerCase().includes(q) ||
             (o.store?.name || '').toLowerCase().includes(q)
    }
    return true
  })

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const paidOrders = orders.filter(o => o.payment_status === 'paid').length
  const pendingOrders = orders.filter(o => o.status === 'pending').length

  if (loading) return <Loading label="Memuat pesanan..." />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-leaf-950">🧾 Kelola Pesanan</h1>
        <p className="mt-1 text-sm text-leaf-900/50">Monitor dan kelola semua pesanan platform</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Pesanan', value: orders.length, icon: '📦', color: 'from-leaf-400 to-emerald-600', bg: 'bg-leaf-50' },
          { label: 'Total Revenue', value: formatRupiah(totalRevenue), icon: '💰', color: 'from-sky-400 to-blue-600', bg: 'bg-sky-50' },
          { label: 'Sudah Dibayar', value: paidOrders, icon: '✅', color: 'from-emerald-400 to-green-600', bg: 'bg-emerald-50' },
          { label: 'Menunggu', value: pendingOrders, icon: '⏳', color: 'from-amber-400 to-orange-600', bg: 'bg-amber-50' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border border-leaf-100 ${s.bg} p-4 transition-all hover:-translate-y-0.5 hover:shadow-md`}>
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-xl text-white shadow-sm`}>
                {s.icon}
              </span>
              <div>
                <p className="text-xs text-leaf-900/50">{s.label}</p>
                <p className="text-xl font-extrabold text-leaf-950">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-leaf-900/30">🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari ID pesanan, pembeli, atau toko..."
          className="w-full rounded-xl border border-leaf-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.value ? 'bg-leaf-600 text-white shadow-sm' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50'
            }`}
          >
            {t.label} <span className="ml-1 opacity-70">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Results */}
      <p className="text-sm text-leaf-900/50">
        Menampilkan <span className="font-bold text-leaf-950">{filtered.length}</span> pesanan
      </p>

      {/* Orders Table */}        <div className="rounded-2xl border border-leaf-100 bg-white shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-leaf-100 bg-leaf-50/50">
                <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Pesanan</th>
                <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Pembeli</th>
                <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Toko</th>
                <th className="px-4 py-3 text-right font-semibold text-leaf-900/70">Total</th>
                <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <span className="text-4xl">📦</span>
                    <p className="mt-2 text-sm font-semibold text-leaf-900/50">Tidak ada pesanan ditemukan</p>
                    <p className="text-xs text-leaf-900/40">Coba ubah filter atau kata kunci</p>
                  </td>
                </tr>
              ) : (
                filtered.map((o) => {
                  const meta = ORDER_STATUS[o.status]
                  return (
                    <tr key={o.id} className="border-b border-leaf-50 transition hover:bg-leaf-50/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-100 text-sm">📦</span>
                          <div>
                            <p className="font-semibold text-leaf-950">{o.id}</p>
                            <p className="text-xs text-leaf-900/40">{formatDateTime(o.created_at)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-leaf-900/60">{o.user?.name || '—'}</td>
                      <td className="px-4 py-3 text-leaf-900/60">{o.store?.name || '—'}</td>
                      <td className="px-4 py-3 text-right font-bold text-leaf-700">{formatRupiah(o.total)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={meta?.badge || 'bg-gray-100 text-gray-500'}>
                          {meta?.icon} {meta?.label || o.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={o.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}>
                          {o.payment_status === 'paid' ? '✅ Dibayar' : '⏳ Pending'}
                        </Badge>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
