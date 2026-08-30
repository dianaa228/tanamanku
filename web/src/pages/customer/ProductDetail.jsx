import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { productsApi } from '../../services/api/products'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { formatRupiah } from '../../utils/format'
import { CARE_LEVEL } from '../../types/constants'
import ProductGallery from '../../components/product/ProductGallery'
import ProductCard from '../../components/product/ProductCard'
import Rating from '../../components/ui/Rating'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Loading from '../../components/ui/Loading'

const reviews = [
  { author: 'Sari Wulandari', avatar: '👩‍🌾', rating: 5, time: '1 minggu lalu', text: 'Tanamannya sampai dalam kondisi prima, dikemas rapi. Daunnya segar dan langsung adaptasi di rumah. Recommended seller!' },
  { author: 'Andi Pratama', avatar: '👨‍💻', rating: 5, time: '2 minggu lalu', text: 'Sudah 3x belanja di sini, kualitas selalu konsisten. Akar sehat, media tanam tidak berantakan.' },
  { author: 'Dewi Lestari', avatar: '👩‍🎨', rating: 4, time: '3 minggu lalu', text: 'Bagus banget, cuma pengiriman agak lama karena lokasi saya di luar kota. Tapi produknya worth it.' },
]

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [variant, setVariant] = useState('')
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()
  const { showToast } = useToast()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    setLoading(true)
    productsApi.getProduct(slug).then((res) => {
      setProduct(res.data)
      setVariant(res.data.variants?.[0] || '')
      setQty(1)
      setLoading(false)
    })
  }, [slug])

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><Loading /></div>

  if (!product) return null
  const care = CARE_LEVEL[product.careLevel]

  const handleAdd = async (buyNow = false) => {
    try {
      await addItem({
        lineId: `${product.id}-${variant}`,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        emoji: product.emoji,
        gradient: product.gradient,
        variant,
        price: product.price,
        stock: product.stock,
        qty,
      })
      showToast(`${product.name} ditambahkan ke keranjang 🛒`)
      if (buyNow) navigate('/checkout')
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menambahkan ke keranjang', 'error')
    }
  }

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
        <Link to="/" className="hover:text-leaf-400">Beranda</Link>
        <span>/</span>
        <Link to="/explore" className="hover:text-leaf-400">Jelajahi</Link>
        <span>/</span>
        <span className="font-semibold text-[var(--text-primary)]">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Galeri */}
        <div className="animate-fade-up">
          <ProductGallery product={product} />
        </div>

        {/* Info */}
        <div className="animate-fade-up">
          <div className="flex flex-wrap items-center gap-2">
            {product.tags.map((t) => (
              <Badge key={t} className="bg-leaf-100 text-leaf-800">{t}</Badge>
            ))}
            {care && <Badge className={care.chip}>{care.icon} Perawatan {care.label}</Badge>}
          </div>

          <h1 className="display mt-4 text-3xl font-semibold leading-tight text-[var(--text-primary)]">{product.name}</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Dijual oleh <span className="font-semibold text-leaf-400">🏪 {product.storeName}</span> · {product.sold}+ terjual
          </p>

          <div className="mt-3 flex items-center gap-2">
            <Rating value={product.rating} showValue size="md" />
            <span className="text-sm text-leaf-900/40">({product.reviewCount} ulasan)</span>
          </div>

          <div className="mt-6 flex items-end gap-3 rounded-3xl bg-leaf-800/20 px-6 py-5">
            <p className="text-4xl font-extrabold text-leaf-400">{formatRupiah(product.price)}</p>
            {product.originalPrice && (
              <p className="pb-1 text-lg text-[var(--text-muted)] line-through">{formatRupiah(product.originalPrice)}</p>
            )}
          </div>

          {/* Varian */}
          {product.variants && product.variants.length > 1 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-[var(--text-primary)]">Pilih varian</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                      variant === v
                        ? 'bg-leaf-600 text-white shadow-soft'
                        : 'bg-[var(--bg-card)] text-[var(--text-primary)] ring-1 ring-[var(--border-primary)] hover:bg-[var(--bg-card-hover)]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Jumlah */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-2xl bg-[var(--bg-card)] ring-1 ring-[var(--border-primary)]">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Kurangi jumlah" className="px-4 py-2.5 text-lg font-bold text-leaf-400 transition hover:bg-white/10">−</button>
              <span className="w-10 text-center font-bold text-[var(--text-primary)]" aria-live="polite">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Tambah jumlah" className="px-4 py-2.5 text-lg font-bold text-leaf-400 transition hover:bg-white/10">+</button>
            </div>
            <p className={`text-sm font-semibold ${product.stock <= 5 ? 'text-rose-600' : 'text-leaf-900/50'}`}>
              {product.stock <= 5 ? `⚠️ Sisa ${product.stock} — buruan!` : `Stok tersedia: ${product.stock}`}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => handleAdd(false)} size="lg" variant="secondary" className="flex-1">
              🛒 Tambah ke keranjang
            </Button>
            <Button onClick={() => handleAdd(true)} size="lg" className="flex-1">
              Beli sekarang ⚡
            </Button>
          </div>

          {!isAuthenticated && (
            <p className="mt-3 text-xs text-leaf-900/50">
              💡 Sudah punya akun?{' '}
              <Link to="/login" className="font-bold text-leaf-700">Masuk</Link> untuk checkout lebih cepat.
            </p>
          )}

          {/* Manfaat */}
          <div className="mt-8 space-y-3 rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 shadow-soft backdrop-blur-sm">
            {product.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-800/20 text-xs text-leaf-400">✓</span>
                <p className="text-sm text-[var(--text-secondary)]">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deskripsi */}
      <section className="mt-14">
        <span className="page-eyebrow">Detail</span>
        <h2 className="section-title">Deskripsi Produk</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-[var(--text-secondary)]">{product.description}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { icon: '🚚', title: 'Pengiriman aman', desc: 'Tanaman dikemas khusus anti benturan & layu' },
            { icon: '🔄', title: 'Garansi 7 hari', desc: 'Layu di perjalanan? Bisa tukar atau refund' },
            { icon: '💬', title: 'Chat seller', desc: 'Tanya perawatan langsung ke nursery' },
          ].map((s) => (
            <div key={s.title} className="card-v2 rounded-2xl bg-[var(--bg-card)] p-5 hover:-translate-y-0">
              <span className="text-2xl">{s.icon}</span>
              <p className="mt-2 font-bold text-[var(--text-primary)]">{s.title}</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ulasan */}
      <section className="mt-14">
        <span className="page-eyebrow">Testimoni</span>
        <h2 className="section-title">Ulasan Pembeli</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.author} className="card-v2 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf-800/20 text-xl">{r.avatar}</span>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{r.author}</p>
                  <Rating value={r.rating} />
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{r.text}</p>
              <p className="mt-2 text-xs text-[var(--text-muted)]">{r.time} · ✓ Pembelian terverifikasi</p>
            </div>
          ))}
        </div>
      </section>

      {/* Produk terkait */}
      <section className="mt-14">
        <span className="page-eyebrow">Jangan lewatkan</span>
        <h2 className="section-title">Produk terkait</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {product.related.map((p) => (
            <ProductCard key={p.id} product={p} compact />
          ))}
        </div>
      </section>
    </div>
  )
}
