import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api/admin'
import { formatRupiah, formatDateTime } from '../../utils/format'
import Badge from '../../components/ui/Badge'
import Loading from '../../components/ui/Loading'

export default function AdminPayments() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getOrders()
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-extrabold text-leaf-950">💳 Monitor Pembayaran</h2>

      <div className="rounded-2xl border border-leaf-100 bg-white shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-leaf-100 bg-leaf-50/50">
                <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Pesanan</th>
                <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Pembeli</th>
                <th className="px-4 py-3 text-right font-semibold text-leaf-900/70">Jumlah</th>
                <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Status Bayar</th>
                <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Status Pesanan</th>
                <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-leaf-50 hover:bg-leaf-50/30">
                  <td className="px-4 py-3 font-semibold text-leaf-950">{o.id}</td>
                  <td className="px-4 py-3 text-leaf-900/60">{o.user?.name || '—'}</td>
                  <td className="px-4 py-3 text-right font-bold text-leaf-700">{formatRupiah(o.total)}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={o.payment_status === 'paid' ? 'bg-leaf-100 text-leaf-700' : 'bg-amber-100 text-amber-800'}>
                      {o.payment_status === 'paid' ? '✅ Dibayar' : '⏳ Pending'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className="bg-sky-100 text-sky-700">
                      {{ pending: 'Menunggu', paid: 'Dibayar', processing: 'Diproses', shipped: 'Dikirim', delivered: 'Terkirim', completed: 'Selesai', cancelled: 'Dibatalkan' }[o.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-leaf-900/50 text-xs">{formatDateTime(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
