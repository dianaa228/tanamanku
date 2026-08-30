import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { formatRupiah } from '../../utils/format'
import { SHIPPING_OPTIONS } from '../../types/constants'
import { createPayment, processPayment, PAYMENT_METHODS } from '../../services/api/payment'
import ProductVisual from '../../components/product/ProductVisual'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { ordersApi } from '../../services/api/orders'
import { cx } from '../../utils/format'

export default function Checkout() {
  const { items, count, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [shipping, setShipping] = useState(SHIPPING_OPTIONS[0].value)
  const [payment, setPayment] = useState(PAYMENT_METHODS[0].id)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdOrder, setCreatedOrder] = useState(null)

  if (!items.length && !showSuccess) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <EmptyState icon="📦" title="Tidak ada yang bisa di-checkout" description="Keranjangmu kosong." actionLabel="Belanja dulu" actionTo="/explore" />
      </div>
    )
  }

  const ship = SHIPPING_OPTIONS.find((s) => s.value === shipping)
  const total = subtotal + ship.price

  const submit = async () => {
    if (!user?.address) {
      showToast('Silakan masuk dan lengkapi alamat pengiriman terlebih dahulu 📍', 'info')
      navigate('/login')
      return
    }

    setSubmitting(true)
    try {
      // Step 1: Create order in backend
      const orderRes = await ordersApi.createOrder({
        address: user?.address,
        paymentMethod: payment,
        items,
        subtotal,
        shippingCost: ship.price,
      })

      const order = orderRes.data

      // Step 2: Create Midtrans payment
      const paymentRes = await createPayment({
        order_id: order.id,
        gross_amount: total,
        customer: {
          first_name: user.name,
          email: user.email,
          phone: user.phone,
        },
        item_details: items.map((item) => ({
          id: item.productId || item.slug,
          name: item.name,
          price: item.price,
          quantity: item.qty,
        })),
        shipping_address: {
          first_name: user.address.recipient,
          phone: user.address.phone,
          address: user.address.street,
          city: user.address.city,
          postal_code: user.address.postalCode,
        },
      })

      // Step 3: Process payment with Snap.js
      await processPayment(paymentRes.data.token, {
        onSuccess: (result) => {
          clearCart()
          setCreatedOrder(order)
          setShowSuccess(true)
          showToast('Pembayaran berhasil! 🎉')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        onPending: (result) => {
          clearCart()
          setCreatedOrder(order)
          setShowSuccess(true)
          showToast('Pembayaran sedang diproses ⏳')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        onError: () => {
          showToast('Pembayaran gagal. Silakan coba lagi.', 'error')
        },
        onClose: () => {
          showToast('Pembayaran dibatalkan. Pesanan masih tersimpan.', 'info')
          // Don't clear cart - user might want to retry
        },
      })
    } catch {
      showToast('Gagal memproses pesanan. Coba lagi.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 sm:px-6">
        <div className="animate-pop rounded-[2rem] border border-[var(--border-primary)] bg-[var(--bg-card)] p-10 text-center shadow-lift backdrop-blur-sm">
          <div className="animate-float text-7xl">🎉</div>
          <h1 className="display mt-6 text-3xl font-semibold text-[var(--text-primary)]">Pesanan berhasil dibuat!</h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            Pesanan <strong>{createdOrder.id}</strong> sedang diproses. 
            Pembayaran akan diproses oleh Midtrans secara otomatis.
          </p>
          <div className="mt-6 rounded-2xl bg-leaf-800/20 p-4">
            <div className="flex items-center justify-center gap-2 text-sm text-leaf-700">
              <span>🔒</span>
              <span className="font-semibold">Pembayaran aman via Midtrans</span>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <Button to={`/orders/${createdOrder.id}`} size="lg">
              Lihat detail pesanan
            </Button>
            <Button to="/explore" variant="ghost">
              Lanjut belanja
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">Total transaksi dihitung aman di server kami.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          {/* Alamat */}
          <section className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-soft backdrop-blur-sm">
            <h2 className="section-title flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-100 text-sm text-leaf-700">1</span>
              Alamat Pengiriman
            </h2>
            {user?.address ? (                <div className="mt-4 rounded-2xl bg-leaf-800/20 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[var(--text-primary)]">
                    {user.address.label} · {user.address.recipient} <span className="font-normal text-leaf-900/50">({user.address.phone})</span>
                  </p>
                  <span className="rounded-full bg-leaf-600 px-2.5 py-1 text-[11px] font-bold text-white">Default</span>
                </div>
                <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                  {user.address.street}, {user.address.district}, {user.address.city}, {user.address.province} {user.address.postalCode}
                </p>
              </div>
            ) : (
              <Link to="/alamat" className="mt-4 block rounded-2xl border border-dashed border-leaf-400/50 bg-leaf-800/10 p-4 text-sm text-leaf-400 transition hover:bg-leaf-800/20">
                <span className="font-semibold">＋ Tambahkan alamat pengiriman</span>
                <span className="block text-xs text-leaf-900/50">Belum ada alamat — atur di Buku Alamat.</span>
              </Link>
            )}
          </section>

          {/* Pengiriman */}
          <section className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-soft backdrop-blur-sm">
            <h2 className="section-title flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-100 text-sm text-leaf-700">2</span>
              Metode Pengiriman
            </h2>
            <div className="mt-4 space-y-2.5">
              {SHIPPING_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setShipping(s.value)}
                  className={cx(
                    'flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition',
                    shipping === s.value ? 'border-leaf-600 bg-leaf-50' : 'border-leaf-100 hover:border-leaf-300',
                  )}
                >
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">🚚 {s.label}</p>
                    <p className="text-xs text-[var(--text-muted)]">Estimasi {s.eta}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-extrabold text-leaf-700">{formatRupiah(s.price)}</p>
                    <span className={cx('flex h-5 w-5 items-center justify-center rounded-full border-2', shipping === s.value ? 'border-leaf-600 bg-leaf-600' : 'border-leaf-200')}>
                      {shipping === s.value && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Pembayaran via Midtrans */}
          <section className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-soft backdrop-blur-sm">
            <h2 className="section-title flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-100 text-sm text-leaf-700">3</span>
              Metode Pembayaran
            </h2>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2.5">
              <span className="text-lg">💳</span>
              <p className="text-xs font-semibold text-blue-700">Powered by Midtrans — Pembayaran aman & terenkripsi</p>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {PAYMENT_METHODS.map((m) => (                  <button
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className={cx(
                    'flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition',
                    payment === m.id ? 'border-leaf-500 bg-leaf-800/20' : 'border-[var(--border-primary)] hover:border-leaf-400/50',
                  )}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--text-primary)]">{m.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Catatan untuk penjual (opsional)"
              className="mt-4 w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-200"
            />
          </section>
        </div>

        {/* Ringkasan */}
        <div className="sticky top-20 h-fit rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-soft backdrop-blur-sm">
          <h2 className="section-title">Ringkasan Pesanan</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.lineId} className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <ProductVisual emoji={item.emoji} gradient={item.gradient} className="h-12 w-12 rounded-xl" emojiClassName="text-xl" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-leaf-700 text-[10px] font-bold text-white">{item.qty}</span>
                </div>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--text-secondary)]">{item.name}</p>
                <p className="text-sm font-bold text-[var(--text-primary)]">{formatRupiah(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
          <dl className="mt-5 space-y-2.5 border-t border-leaf-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Subtotal ({count} item)</dt>
              <dd className="font-semibold text-[var(--text-primary)]">{formatRupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--text-muted)]">Ongkir ({ship.label})</dt>
              <dd className="font-semibold text-[var(--text-primary)]">{formatRupiah(ship.price)}</dd>
            </div>
            <div className="flex justify-between border-t border-leaf-100 pt-3">
              <dt className="font-bold text-[var(--text-primary)]">Total</dt>
              <dd className="text-2xl font-extrabold text-leaf-400">{formatRupiah(total)}</dd>
            </div>
          </dl>
          <Button size="lg" className="mt-6 w-full" loading={submitting} onClick={submit}>
            {submitting ? 'Memproses pembayaran...' : '💳 Bayar dengan Midtrans'}
          </Button>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
            <span>🔒</span>
            <span>Transaksi aman via Midtrans</span>
          </div>
        </div>
      </div>
    </div>
  )
}
