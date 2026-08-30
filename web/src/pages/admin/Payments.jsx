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
      <h2 className="text-xl font-extrabold text-[var(--text-primary)]">💳 Monitor Pembayaran</h2>

      <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-soft backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-card)]">
                <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Pesanan</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Pembeli</th>
                <th className="px-4 py-3 text-right font-semibold text-[var(--text-secondary)]">Jumlah</th>
                <th className="px-4 py-3 text-center font-semibold text-[var(--text-secondary)]">Status Bayar</th>
                <th className="px-4 py-3 text-center font-semibold text-[var(--text-secondary)]">Status Pesanan</th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-[var(--border-secondary)] hover:bg-[var(--bg-card-hover)]">
                  <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">{o.id}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{o.user?.name || '—'}</td>
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
                  <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{formatDateTime(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
