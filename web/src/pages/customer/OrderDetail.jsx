import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ordersApi } from '../../services/api/orders'
import { formatRupiah, formatDateTime, formatDate } from '../../utils/format'
import { ORDER_STATUS, ORDER_FLOW } from '../../types/constants'
import Badge from '../../components/ui/Badge'
import Loading from '../../components/ui/Loading'
import Button from '../../components/ui/Button'
import ProductVisual from '../../components/product/ProductVisual'
import { useToast } from '../../context/ToastContext'
import { cx } from '../../utils/format'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    ordersApi.getOrder(id).then((res) => {
      setOrder(res.data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6"><Loading /></div>
  if (!order) return null

  const meta = ORDER_STATUS[order.status]
  const stepIndex = ORDER_FLOW.indexOf(order.status)
  const cancelled = order.status === 'cancelled'

  return (
    <div className="page-container max-w-4xl">
      <Link to="/orders" className="text-sm font-semibold text-muted hover:text-leaf-700">
        ← Kembali ke pesanan
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="display text-2xl font-semibold text-forest">{order.id}</h1>
          <p className="mt-0.5 text-sm text-muted">{formatDateTime(order.date)}</p>
        </div>
        <Badge className={meta.badge}>{meta.icon} {meta.label}</Badge>
      </div>

      {cancelled && (
        <div className="mt-6 animate-pop rounded-2xl bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          ✖️ Pesanan ini telah dibatalkan. Pembayaran yang diterima akan dikembalikan otomatis.
        </div>
      )}

      {/* Timeline */}
      {!cancelled && (
        <div className="mt-8 rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft">
          <div className="flex">
            {ORDER_FLOW.map((s, i) => {
              const done = i <= stepIndex
              const current = i === stepIndex
              const st = ORDER_STATUS[s]
              return (
                <div key={s} className="relative flex-1">
                  <div className={cx('absolute left-0 right-0 top-4 h-0.5', i === 0 ? 'hidden' : done ? 'bg-leaf-500' : 'bg-leaf-100')} />
                  <div className="relative flex flex-col items-center gap-1.5">
                    <span
                      className={cx(
                        'flex h-8 w-8 items-center justify-center rounded-full text-sm transition',
                        current ? 'scale-110 bg-leaf-600 text-white shadow-soft' : done ? 'bg-leaf-100 text-leaf-700' : 'bg-cream-dark text-leaf-900/30',
                      )}
                    >
                      {done ? '✓' : st.icon}
                    </span>
                    <p className={cx('text-center text-[10px] font-semibold sm:text-xs', current ? 'text-leaf-700' : done ? 'text-leaf-900/70' : 'text-leaf-900/30')}>
                      {st.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_18rem]">
        {/* Items */}
        <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-bold text-leaf-950">Item Pesanan</h2>
          <div className="mt-4 space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <ProductVisual emoji={item.emoji} gradient={item.gradient} className="h-16 w-16 rounded-2xl" emojiClassName="text-3xl" />
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${item.slug || item.productId}`} className="block truncate font-semibold text-leaf-950 hover:text-leaf-700">
                    {item.name}
                  </Link>
                  <p className="text-xs text-leaf-900/50">Varian: {item.variant} · {item.qty}x</p>
                </div>
                <p className="font-bold text-leaf-950">{formatRupiah(item.price * item.qty)}</p>
              </div>
            ))}
          </div>

          {/* Pembayaran */}
          <div className="mt-6 rounded-2xl bg-leaf-50 p-4">
            <h3 className="text-sm font-bold text-leaf-950">Pembayaran</h3>
            <p className="mt-1 text-sm text-leaf-900/60">{order.payment.method}</p>
            <p className="text-sm text-leaf-900/60">Referensi: {order.payment.reference}</p>
          </div>
        </div>

        {/* Info pengiriman & total */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-bold text-leaf-950">Pengiriman</h2>
            <div className="mt-3 space-y-2 text-sm">
              <p className="flex justify-between"><span className="text-leaf-900/50">Kurir</span><span className="font-semibold">🚚 {order.shipment.courier}</span></p>
              <p className="flex justify-between"><span className="text-leaf-900/50">Resi</span><span className="font-semibold">{order.shipment.tracking}</span></p>
              <p className="flex justify-between"><span className="text-leaf-900/50">Estimasi</span><span className="font-semibold">{order.shipment.eta}</span></p>
            </div>
            <div className="mt-4 border-t border-leaf-100 pt-3">
              <p className="text-sm font-bold text-leaf-950">{order.address.label} · {order.address.recipient}</p>
              <p className="mt-1 text-xs leading-relaxed text-leaf-900/55">
                {order.address.street}, {order.address.district}, {order.address.city}, {order.address.province} {order.address.postalCode}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-bold text-leaf-950">Rincian Biaya</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-leaf-900/60">Subtotal</dt><dd className="font-semibold">{formatRupiah(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-leaf-900/60">Ongkir</dt><dd className="font-semibold">{formatRupiah(order.shippingCost)}</dd></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-leaf-700"><dt>Diskon</dt><dd className="font-semibold">−{formatRupiah(order.discount)}</dd></div>
              )}
              <div className="flex justify-between border-t border-leaf-100 pt-3">
                <dt className="font-bold text-leaf-950">Total</dt>
                <dd className="text-xl font-extrabold text-leaf-700">{formatRupiah(order.total)}</dd>
              </div>
            </dl>
            {order.status === 'pending' && (
              <Button className="mt-5 w-full" variant="danger" onClick={async () => {
                await ordersApi.cancelOrder(order.id)
                showToast('Pesanan dibatalkan', 'info')
                window.location.reload()
              }}>
                Batalkan pesanan
              </Button>
            )}
            {order.status === 'delivered' && (
              <p className="mt-4 rounded-2xl bg-leaf-50 px-4 py-3 text-center text-sm font-semibold text-leaf-800">
                📝 Terima kasih! Ulas produkmu untuk membantu pekebun lain.
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-leaf-900/40">Dibuat pada {formatDate(order.date)} · Tanamanku</p>
    </div>
  )
}
