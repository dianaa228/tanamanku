import { useEffect, useState } from 'react'
import { analyticsApi } from '../../services/api/analytics'
import { formatRupiah, cx } from '../../utils/format'
import Loading from '../../components/ui/Loading'

export default function SellerAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')

  useEffect(() => {
    analyticsApi.getAnalytics().then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Loading label="Memuat analytics..." />
  if (!data) return null

  const { overview, revenueTrend, orderStatusBreakdown, categoryPerformance, topProducts, customerInsights, peakHours, monthlyComparison } = data

  const maxRevenue = Math.max(...revenueTrend.map((r) => r.revenue))
  const maxPeak = Math.max(...peakHours.map((h) => h.orders))
  const maxMonthly = Math.max(...monthlyComparison.map((m) => m.revenue))
  const totalStatus = orderStatusBreakdown.reduce((s, b) => s + b.count, 0)

  const StatCard = ({ label, value, growth, icon, color }) => (
    <div className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-leaf-900/50">{label}</p>
          <p className="mt-1 text-2xl font-extrabold text-leaf-950">{value}</p>
          {growth != null && (
            <p className={cx('mt-0.5 text-xs font-semibold', growth >= 0 ? 'text-leaf-600' : 'text-rose-600')}>
              {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}% dari bulan lalu
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-leaf-950">📊 Analytics</h1>
          <p className="mt-1 text-sm text-leaf-900/50">Insight detail untuk toko Anda</p>
        </div>
        <div className="flex gap-2">
          {[
            { value: '7d', label: '7 Hari' },
            { value: '30d', label: '30 Hari' },
            { value: '90d', label: '3 Bulan' },
          ].map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cx(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                period === p.value ? 'bg-leaf-600 text-white' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Pendapatan" value={formatRupiah(overview.totalRevenue)} growth={overview.revenueGrowth} icon="💰" color="bg-leaf-100 text-leaf-700" />
        <StatCard label="Total Pesanan" value={overview.totalOrders} growth={overview.ordersGrowth} icon="📦" color="bg-sky-100 text-sky-700" />
        <StatCard label="Conversion Rate" value={`${overview.conversionRate}%`} growth={overview.conversionGrowth} icon="🎯" color="bg-violet-100 text-violet-700" />
        <StatCard label="Avg Order Value" value={formatRupiah(overview.avgOrderValue)} growth={overview.avgOrderGrowth} icon="🧾" color="bg-amber-100 text-amber-700" />
      </div>

      {/* Revenue Trend */}
      <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
        <h2 className="font-bold text-leaf-950">📈 Tren Pendapatan (30 Hari)</h2>
        <div className="mt-4 flex items-end gap-1 h-48 overflow-x-auto">
          {revenueTrend.map((r, i) => (
            <div key={i} className="flex-1 min-w-[8px] flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-gradient-to-t from-leaf-600 to-leaf-400 transition-all hover:from-leaf-700 hover:to-leaf-500"
                style={{ height: `${(r.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                title={`${formatRupiah(r.revenue)} · ${r.orders} pesanan`}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[9px] text-leaf-900/40">
          <span>{revenueTrend[0]?.date && new Date(revenueTrend[0].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
          <span>{revenueTrend[revenueTrend.length - 1]?.date && new Date(revenueTrend[revenueTrend.length - 1].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Status Breakdown */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">📦 Status Pesanan</h2>
          <div className="mt-4 space-y-3">
            {orderStatusBreakdown.map((b) => (
              <div key={b.status}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-leaf-950">{b.label}</span>
                  <span className="text-leaf-900/60">{b.count} ({Math.round((b.count / totalStatus) * 100)}%)</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-leaf-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(b.count / totalStatus) * 100}%`, backgroundColor: b.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Donut visual */}
          <div className="mt-6 flex justify-center">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                {orderStatusBreakdown.reduce((acc, b) => {
                  const pct = (b.count / totalStatus) * 100
                  acc.elements.push(
                    <circle
                      key={b.status}
                      cx="18" cy="18" r="15.915"
                      fill="none"
                      stroke={b.color}
                      strokeWidth="3.5"
                      strokeDasharray={`${pct} ${100 - pct}`}
                      strokeDashoffset={`${-acc.offset}`}
                      className="transition-all"
                    />
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
        </div>

        {/* Category Performance */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">🏷️ Performa Kategori</h2>
          <div className="mt-4 space-y-4">
            {categoryPerformance.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-leaf-950">{c.name}</p>
                  <p className={cx('text-xs font-bold', c.growth >= 0 ? 'text-leaf-600' : 'text-rose-600')}>
                    {c.growth >= 0 ? '+' : ''}{c.growth}%
                  </p>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-leaf-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-leaf-500 to-leaf-400"
                    style={{ width: `${(c.revenue / categoryPerformance[0].revenue) * 100}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[11px] text-leaf-900/40">
                  <span>{formatRupiah(c.revenue)}</span>
                  <span>{c.orders} pesanan</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">🏆 Produk Terlaris</h2>
          <div className="mt-4 space-y-4">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={cx(
                  'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold',
                  i === 0 ? 'bg-sun-100 text-sun-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-amber-100 text-amber-700' : 'bg-leaf-50 text-leaf-600',
                )}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-leaf-950 truncate">{p.name}</p>
                  <p className="text-[11px] text-leaf-900/40">{p.sold} terjual · {formatRupiah(p.revenue)}</p>
                </div>
                <span className="text-sm">
                  {p.trend === 'up' ? '📈' : p.trend === 'down' ? '📉' : '➡️'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">🕐 Jam Ramai Pesanan</h2>
          <div className="mt-4 flex items-end gap-2 h-40">
            {peakHours.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={cx(
                    'w-full rounded-t transition-all',
                    h.orders === maxPeak ? 'bg-gradient-to-t from-sun-500 to-sun-400' : 'bg-gradient-to-t from-leaf-500 to-leaf-400',
                  )}
                  style={{ height: `${(h.orders / maxPeak) * 100}%`, minHeight: '4px' }}
                />
                <p className="text-[9px] text-leaf-900/40">{h.hour.slice(0, 5)}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-leaf-900/40">
            Jam tersibuk: <span className="font-bold text-leaf-700">{peakHours.find((h) => h.orders === maxPeak)?.hour} WIB</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Comparison */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">📅 Perbandingan Bulanan</h2>
          <div className="mt-4 flex items-end gap-3 h-44">
            {monthlyComparison.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <p className="text-[10px] font-semibold text-leaf-700">{formatRupiah(m.revenue)}</p>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-leaf-600 to-leaf-400"
                  style={{ height: `${(m.revenue / maxMonthly) * 100}%`, minHeight: '4px' }}
                />
                <p className="text-xs font-semibold text-leaf-900/60">{m.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Insights */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">👥 Insight Pelanggan</h2>

          {/* New vs Repeat */}
          <div className="mt-4">
            <p className="text-sm font-semibold text-leaf-950 mb-2">Baru vs Ulang</p>
            <div className="flex h-4 overflow-hidden rounded-full">
              {customerInsights.newVsRepeat.map((r, i) => (
                <div
                  key={i}
                  className={cx('transition-all', i === 0 ? 'bg-leaf-500' : 'bg-sky-400')}
                  style={{ width: `${r.percentage}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-leaf-500" />
                Baru ({customerInsights.newVsRepeat[0].count})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                Ulang ({customerInsights.newVsRepeat[1].count})
              </span>
            </div>
          </div>

          {/* Top Cities */}
          <div className="mt-5">
            <p className="text-sm font-semibold text-leaf-950 mb-2">Kota Teratas</p>
            <div className="space-y-2">
              {customerInsights.topCities.slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-leaf-900/70">{c.city}</span>
                  <span className="font-semibold text-leaf-950">{c.orders} pesanan</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="mt-5 rounded-xl bg-sun-50 px-4 py-3 text-center">
            <p className="text-3xl font-extrabold text-sun-600">⭐ {customerInsights.avgRating}</p>
            <p className="text-xs text-leaf-900/50">{customerInsights.totalReviews} ulasan</p>
          </div>
        </div>
      </div>
    </div>
  )
}
