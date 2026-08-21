import { useEffect, useState } from 'react'
import { sellerApi } from '../../services/api/seller'
import { formatRupiah } from '../../utils/format'
import Loading from '../../components/ui/Loading'

export default function SellerSales() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sellerApi.getSales().then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Loading />
  if (!data) return null

  const maxRevenue = Math.max(...data.topProducts.map((p) => p.revenue))

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Pendapatan', value: formatRupiah(data.totalRevenue), icon: '💰' },
          { label: 'Total Pesanan', value: data.totalOrders, icon: '📦' },
          { label: 'Rata-rata per Pesanan', value: formatRupiah(data.avgOrderValue), icon: '📊' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-sm text-leaf-900/50">{s.label}</p>
                <p className="text-xl font-extrabold text-leaf-950">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Daily sales chart */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">📈 Penjualan Harian</h2>
          <div className="mt-4 flex items-end gap-2 h-48">
            {data.dailySales.map((s, i) => {
              const max = Math.max(...data.dailySales.map((d) => d.total))
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-[10px] font-semibold text-leaf-700">{formatRupiah(s.total)}</p>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-leaf-600 to-leaf-400"
                    style={{ height: `${(s.total / max) * 100}%`, minHeight: '4px' }}
                  />
                  <p className="text-[9px] text-leaf-900/40">
                    {new Date(s.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="font-bold text-leaf-950">🏆 Produk Terlaris</h2>
          <div className="mt-4 space-y-4">
            {data.topProducts.map((p, i) => (
              <div key={i}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-leaf-950">{i + 1}. {p.name}</p>
                  <p className="text-xs font-bold text-leaf-700">{p.sold} terjual</p>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-leaf-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-leaf-500 to-leaf-400"
                    style={{ width: `${(p.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <p className="mt-0.5 text-[11px] text-leaf-900/40">{formatRupiah(p.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
