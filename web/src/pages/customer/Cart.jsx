import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { formatRupiah } from '../../utils/format'
import ProductVisual from '../../components/product/ProductVisual'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { SHIPPING_OPTIONS } from '../../types/constants'

export default function Cart() {
  const { items, count, subtotal, updateQty, removeItem, clearCart } = useCart()
  const { showToast } = useToast()

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <EmptyState
          icon="🛒"
          title="Keranjangmu masih kosong"
          description="Yuk isi dengan tanaman cantik atau perlengkapan berkebun untuk kebunmu."
          actionLabel="Mulai belanja"
          actionTo="/explore"
        />
      </div>
    )
  }

  const shipping = SHIPPING_OPTIONS[0].price
  const total = subtotal + shipping

  const onQty = (lineId, qty) =>
    updateQty(lineId, qty).catch((e) => showToast(e.response?.data?.message || 'Gagal memperbarui jumlah', 'error'))
  const onRemove = async (lineId) => {
    try {
      await removeItem(lineId)
      showToast('Item dihapus dari keranjang', 'info')
    } catch (e) {
      showToast(e.response?.data?.message || 'Gagal menghapus item', 'error')
    }
  }
  const onClear = async () => {
    try {
      await clearCart()
      showToast('Keranjang dikosongkan', 'info')
    } catch (e) {
      showToast(e.response?.data?.message || 'Gagal mengosongkan keranjang', 'error')
    }
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display text-3xl font-semibold text-forest">Keranjang Belanja 🛒</h1>
          <p className="mt-1 text-sm text-muted">{count} item dalam keranjang</p>
        </div>
        <button
          onClick={onClear}
          className="text-sm font-semibold text-rose-600 transition hover:text-rose-700"
        >
          Kosongkan
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        {/* Item list */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.lineId}
              className="flex animate-fade-up gap-4 rounded-3xl border border-leaf-100 bg-white p-4 shadow-soft"
            >
              <Link to={`/product/${item.slug}`} className="shrink-0">
                <ProductVisual emoji={item.emoji} gradient={item.gradient} className="h-24 w-24 rounded-2xl" emojiClassName="text-4xl" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link to={`/product/${item.slug}`} className="block truncate font-bold text-leaf-950 hover:text-leaf-700">
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-leaf-900/50">Varian: {item.variant}</p>
                  </div>
                  <button
                    onClick={() => onRemove(item.lineId)}
                    className="rounded-full p-1.5 text-leaf-900/40 transition hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Hapus"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    </svg>
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-xl bg-leaf-50">
                    <button onClick={() => onQty(item.lineId, item.qty - 1)} aria-label="Kurangi jumlah" className="min-h-[44px] min-w-[44px] px-3 py-2 font-bold text-leaf-700 transition hover:text-leaf-900">−</button>
                    <span className="w-8 text-center text-sm font-bold text-leaf-950" aria-live="polite">{item.qty}</span>
                    <button onClick={() => onQty(item.lineId, item.qty + 1)} aria-label="Tambah jumlah" className="min-h-[44px] min-w-[44px] px-3 py-2 font-bold text-leaf-700 transition hover:text-leaf-900">+</button>
                  </div>
                  <p className="font-extrabold text-leaf-700">{formatRupiah(item.price * item.qty)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ringkasan */}
        <div className="sticky top-20 h-fit rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-bold text-leaf-950">Ringkasan Belanja</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-leaf-900/60">Subtotal ({count} item)</dt>
              <dd className="font-semibold text-leaf-950">{formatRupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-leaf-900/60">Ongkir (estimasi)</dt>
              <dd className="font-semibold text-leaf-950">{formatRupiah(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-leaf-100 pt-3">
              <dt className="font-bold text-leaf-950">Total</dt>
              <dd className="text-xl font-extrabold text-leaf-700">{formatRupiah(total)}</dd>
            </div>
          </dl>
          <Button to="/checkout" size="lg" className="mt-6 w-full">
            Lanjut checkout →
          </Button>
          <Link to="/explore" className="mt-3 block text-center text-sm font-semibold text-leaf-900/50 hover:text-leaf-700">
            ← Lanjut belanja
          </Link>
        </div>
      </div>
    </div>
  )
}
