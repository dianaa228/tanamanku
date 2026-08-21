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

  useEffect(() => {
    adminApi.getOrders().then((res) => {
      setOrders(res.data)
      setLoading(false)
    })
  }, [])

  const tabs = [
    { value: 'semua', label: 'Semua' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'processing', label: 'Diproses' },
    { value: 'shipped', label: 'Dikirim' },
    { value: 'completed', label: 'Selesai' },
    { value: 'cancelled', label: 'Batal' },
  ]

  const filtered = tab === 'semua' ? orders : orders.filter((o) => o.status === tab)

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.value ? 'bg-leaf-600 text-white' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-leaf-100 bg-white shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-leaf-900/50">Tidak ada pesanan</td>
                </tr>
              ) : (
                filtered.map((o) => {
                  const meta = ORDER_STATUS[o.status]
                  return (
                    <tr key={o.id} className="border-b border-leaf-50 hover:bg-leaf-50/30">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-leaf-950">{o.id}</p>
                        <p className="text-xs text-leaf-900/40">{formatDateTime(o.created_at)}</p>
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
                        <Badge className={o.payment_status === 'paid' ? 'bg-leaf-100 text-leaf-700' : 'bg-amber-100 text-amber-800'}>
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
