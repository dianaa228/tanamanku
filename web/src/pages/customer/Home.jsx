import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../../services/api/products'
import { communityApi } from '../../services/api/community'
import { nurseryApi } from '../../services/api/nursery'
import ProductCard from '../../components/product/ProductCard'
import Button from '../../components/ui/Button'
import ProductVisual from '../../components/product/ProductVisual'

/* ── Scroll reveal hook ─────────────────────────────────── */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const nodes = el.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('in-view'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
  return ref
}

/* ── Data fallback (dipakai hanya saat API kosong/gagal) ── */
const FALLBACK_CATEGORIES = [
  { slug: 'tanaman-hias', name: 'Tanaman Hias', emoji: '🪴', tagline: 'Hijaukan ruangan', count: 0 },
  { slug: 'sayuran-herbal', name: 'Sayuran & Herbal', emoji: '🥬', tagline: 'Pangan dari rumah', count: 0 },
  { slug: 'buah', name: 'Buah', emoji: '🍓', tagline: 'Panen di balkon', count: 0 },
  { slug: 'media-tanam', name: 'Media Tanam', emoji: '🪨', tagline: 'Fondasi subur', count: 0 },
  { slug: 'pupuk-nutrisi', name: 'Pupuk & Nutrisi', emoji: '💧', tagline: 'Asupan terbaik', count: 0 },
  { slug: 'peralatan', name: 'Peralatan Berkebun', emoji: '🛠️', tagline: 'Berkebun jadi mudah', count: 0 },
  { slug: 'pot-dekorasi', name: 'Pot & Dekorasi', emoji: '🫙', tagline: 'Tampil cantik', count: 0 },
]

const TAGLINE_BY_SLUG = Object.fromEntries(FALLBACK_CATEGORIES.map((c) => [c.slug, c.tagline]))

/* API kategori → bentuk kartu home (icon API + tagline brand) */
const toHomeCategory = (c) => ({
  slug: c.slug,
  name: c.name,
  emoji: c.icon || '🍃',
  tagline: TAGLINE_BY_SLUG[c.slug] || 'Jelajahi koleksi',
  count: c.count ?? c.products_count ?? 0,
})

/* 1000+ → "1rb+", 1200000 → "1jt+" */
const formatStat = (n) => {
  if (!n || n <= 0) return null
  if (n >= 1000000) return `${Math.floor(n / 1000000)}jt+`
  if (n >= 1000) return `${Math.floor(n / 1000)}rb+`
  return `${n}+`
}

const careFeatures = [
  { icon: '🪴', title: 'My Garden', desc: 'Catat setiap tanaman, pantau tinggi & kesehatan, simpan riwayat perawatan.', to: '/my-garden' },
  { icon: '💡', title: 'Plant Finder', desc: 'Jawab 4 pertanyaan, kami rekomendasikan tanaman yang paling cocok.', to: '/plant-finder' },
  { icon: '🩺', title: 'Plant Diagnosis', desc: 'Pilih gejalanya, dapatkan diagnosis dan solusi perawatan yang jelas.', to: '/plant-diagnosis' },
  { icon: '🔔', title: 'Pengingat Cerdas', desc: 'Jadwalkan siram, pupuk, dan repot — tidak ada lagi tanaman yang terlupa.', to: '/my-garden' },
]

const steps = [
  { icon: '🌱', title: 'Pilih tanamanmu', desc: 'Jelajahi ratusan tanaman & perlengkapan berkebun.' },
  { icon: '🚚', title: 'Kami antar', desc: 'Dikemas aman, sampai segar dengan ekspedisi tepercaya.' },
  { icon: '💧', title: 'Rawat bersama', desc: 'Pengingat siram, pupuk, dan diagnosis di ujung jari.' },
  { icon: '🌿', title: 'Tumbuh bersama', desc: 'Bagikan hasil kebunmu dengan komunitas Tanamanku.' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [communityPosts, setCommunityPosts] = useState([])
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES)
  const [nurseryCount, setNurseryCount] = useState(null)
  const [loading, setLoading] = useState(true)
  const revealRef = useReveal()

  useEffect(() => {
    Promise.allSettled([
      productsApi.getProducts({ sort: 'terlaris' }),
      productsApi.getCategories(),
      communityApi.getPosts(),
      nurseryApi.getNurseries(),
    ]).then(([productsRes, catsRes, postsRes, nurseriesRes]) => {
      if (productsRes.status === 'fulfilled') setFeatured(productsRes.value.data.slice(0, 8))
      if (catsRes.status === 'fulfilled' && catsRes.value.data?.length) {
        setCategories(catsRes.value.data.map(toHomeCategory))
      }
      if (postsRes.status === 'fulfilled') setCommunityPosts(postsRes.value.data.slice(0, 3))
      if (nurseriesRes.status === 'fulfilled') setNurseryCount(nurseriesRes.value.data.length)
      setLoading(false)
    })
  }, [])

  const productCount = categories.reduce((sum, c) => sum + (c.count || 0), 0)
  const stats = [
    { value: formatStat(productCount) || '500+', label: 'Produk pilihan' },
    { value: formatStat(nurseryCount) || '120+', label: 'Nursery lokal' },
    { value: '10rb+', label: 'Kebun aktif' },
  ]

  return (
    <div ref={revealRef}>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-leaf-50/80 via-cream to-cream">
        {/* decorative botanical orbs */}
        <div className="pointer-events-none absolute -right-28 -top-24 h-[420px] w-[420px] rounded-full bg-leaf-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-6 h-80 w-80 rounded-full bg-sun-100/70 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-10 text-6xl opacity-10" style={{ transform: 'rotate(-18deg)' }}>🍃</div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:pb-24 lg:pt-16">
          {/* Copy */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-leaf-700 shadow-soft backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-leaf-500" />
              Kebun perkotaan dalam genggaman
            </span>

            <h1 className="display mt-6 text-balance text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-forest sm:text-6xl lg:text-[4.2rem]">
              Rawat tanamanmu.{' '}
              <span className="text-gradient-botanical">Tumbuhkan</span> kebiasaan baik.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              Tanamanku menyatukan belanja tanaman dari nursery tepercaya, kebun pribadi yang mudah dicatat, dan pengingat perawatan cerdas — jadi berkebun terasa ringan, tidak rumit.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/explore" size="lg" className="btn-shine">
                Mulai berkebun
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Button>
              <Button to="/plant-finder" size="lg" variant="secondary">
                💡 Cari tanaman ideal
              </Button>
            </div>

            {/* stats */}
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-sage-200/70 pt-7">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="display text-2xl font-semibold text-forest sm:text-3xl">{s.value}</dd>
                  <dd className="mt-1 text-xs font-medium text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual composition */}
          <div className="relative mx-auto hidden w-full max-w-xl lg:block">
            {/* main card */}
            <div className="relative overflow-hidden rounded-[2rem] border border-leaf-100 bg-white shadow-elevated">
              <div className="relative overflow-hidden bg-gradient-to-br from-leaf-100 via-cream to-sun-50">
                <div className="flex h-80 items-center justify-center">
                  <span className="animate-float text-[9rem] drop-shadow-xl">🪴</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="display text-lg font-semibold text-forest">Momo · Monstera</p>
                  <p className="text-sm text-muted">Disiram 2 jam lalu · 68 cm · Sehat</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-50 text-xl">😊</span>
              </div>
            </div>

            {/* floating chip: watering */}
            <div className="absolute -left-10 top-8 animate-float rounded-2xl border border-sage-100 bg-white px-4 py-3 shadow-card [animation-delay:1s]">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-lg">💧</span>
                <div>
                  <p className="text-xs font-semibold text-forest">Pengingat siram</p>
                  <p className="text-[11px] text-muted">Momo · hari ini</p>
                </div>
              </div>
            </div>

            {/* floating chip: order */}
            <div className="absolute -right-6 bottom-20 animate-float rounded-2xl border border-sage-100 bg-white px-4 py-3 shadow-card [animation-delay:2s]">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terra-50 text-lg">🌿</span>
                <div>
                  <p className="text-xs font-semibold text-forest">Pesanan dikemas</p>
                  <p className="text-[11px] text-muted">2 tanaman siap antar</p>
                </div>
              </div>
            </div>

            {/* decorative leaves */}
            <span className="absolute -right-16 -top-10 text-7xl opacity-20" style={{ transform: 'rotate(22deg)' }}>🍃</span>
            <span className="absolute -bottom-8 -left-8 text-6xl opacity-20" style={{ transform: 'rotate(-30deg)' }}>🌿</span>
          </div>
        </div>
      </section>

      {/* ═══ KATEGORI ═══ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="reveal flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-terra-500">Belanja</p>
            <h2 className="display mt-2 text-3xl font-semibold text-forest sm:text-4xl">Temukan per kategori</h2>
          </div>
          <Link to="/explore" className="hidden text-sm font-semibold text-leaf-700 transition hover:text-leaf-800 sm:block">
            Lihat semua →
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-8 flex gap-4 overflow-x-auto px-4 pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to={`/explore?category=${c.slug}`}
              className="reveal group min-w-[9.5rem] shrink-0 sm:min-w-0"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-3xl border border-sage-100 bg-white shadow-soft transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-leaf-200 group-hover:shadow-card">
                <span className="text-5xl transition-transform duration-300 group-hover:scale-110">{c.emoji}</span>
                <div className="text-center">
                  <p className="text-sm font-bold text-forest">{c.name}</p>
                  <p className="text-xs text-muted">{c.tagline}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ PRODUK PILIHAN ═══ */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="reveal flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-terra-500">Paling diminati</p>
              <h2 className="display mt-2 text-3xl font-semibold text-forest sm:text-4xl">Favorit minggu ini</h2>
              <p className="mt-2 text-sm text-muted">Pilihan komunitas Tanamanku yang laris manis.</p>
            </div>
            <Button to="/explore" variant="ghost" className="hidden sm:inline-flex">
              Jelajahi semua
            </Button>
          </div>
          {loading ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-72 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {featured.map((p, i) => (
                <div key={p.id} className="reveal" style={{ transitionDelay: `${i * 50}ms` }}>
                  <ProductCard product={p} compact />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ WHY / EDITORIAL SPLIT ═══ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="reveal">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-terra-500">Kenapa Tanamanku</p>
            <h2 className="display mt-2 text-balance text-3xl font-semibold text-forest sm:text-4xl">
              Berbeda dari marketplace biasa — dibuat untuk pekebun sungguhan.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
              Tanamanku bukan sekadar tempat belanja. Ini rumah digital tempat setiap tanaman punya riwayat, setiap perawatan punya jadwal, dan setiap pekebun punya komunitas.
            </p>
            <ul className="mt-8 space-y-5">
              {[
                { icon: '📖', title: 'Riwayat per tanaman', desc: 'Semua yang kamu lakukan tercatat — tinggi, penyiraman, hama, hingga panen.' },
                { icon: '🔄', title: 'Cari & tukar tanaman', desc: 'Temukan tanaman langka atau tawarkan hasil stekmu ke sesama anggota.' },
                { icon: '🤝', title: 'Nursery terverifikasi', desc: 'Jual beli bersama penjual lokal terpercaya dengan ulasan asli.' },
              ].map((f) => (
                <li key={f.title} className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-leaf-50 text-2xl ring-1 ring-leaf-100">{f.icon}</span>
                  <div>
                    <p className="font-bold text-forest">{f.title}</p>
                    <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button to="/register" size="lg" variant="primary">Mulai gratis</Button>
            </div>
          </div>

          <div className="reveal relative">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[2rem] bg-leaf-700 p-7 text-white shadow-elevated">
                <span className="text-4xl">🌱</span>
                <p className="display mt-4 text-4xl font-semibold">4 langkah</p>
                <p className="mt-2 text-sm text-leaf-100/80">Dari bibit hingga kebun yang tumbuh, kami menemani.</p>
              </div>
              <div className="mt-6 rounded-[2rem] border border-sage-100 bg-white p-7 shadow-card">
                <span className="text-4xl">🪴</span>
                <p className="display mt-4 text-4xl font-semibold text-forest">10rb+</p>
                <p className="mt-2 text-sm text-muted">kebun aktif tumbuh bersama setiap hari.</p>
              </div>
            </div>
            <span className="absolute -right-8 -top-8 text-6xl opacity-15" style={{ transform: 'rotate(18deg)' }}>🪴</span>
          </div>
        </div>
      </section>

      {/* ═══ CARA KERJA ═══ */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="reveal text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-terra-500">Cara kerja</p>
          <h2 className="display mt-2 text-3xl font-semibold text-forest sm:text-4xl">Mulai dalam 4 langkah</h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="reveal relative rounded-3xl border border-sage-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="absolute right-5 top-4 display text-5xl font-semibold text-sage-100">{i + 1}</span>
              <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-leaf-50 text-3xl ring-1 ring-leaf-100" style={{ height: '3.25rem', width: '3.25rem' }}>{s.icon}</span>
              <h3 className="display mt-4 text-lg font-semibold text-forest">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FITUR CERDAS (dark) ═══ */}
      <section className="bg-leaf-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="reveal mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sun-300">Berkebun lebih cerdas</p>
            <h2 className="display mt-2 text-balance text-3xl font-semibold text-white sm:text-4xl">
              Fitur yang tak ada di marketplace biasa
            </h2>
            <p className="mt-3 text-sm text-leaf-200/60">
              Semua yang kamu butuhkan untuk merawat tanaman jadi satu, tanpa pindah-pindah aplikasi.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {careFeatures.map((f, i) => (
              <Link
                key={f.title}
                to={f.to}
                className="reveal group rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.08] hover:ring-white/20"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105">
                  {f.icon}
                </div>
                <h3 className="display mt-5 text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-leaf-200/50">{f.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sun-300 transition group-hover:gap-2.5">
                  Coba sekarang
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ KOMUNITAS ═══ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="reveal flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-terra-500">Komunitas</p>
            <h2 className="display mt-2 text-3xl font-semibold text-forest sm:text-4xl">Cerita dari para pekebun</h2>
            <p className="mt-2 text-sm text-muted">Hasil kebun para anggota Tanamanku.</p>
          </div>
          <Button to="/community" variant="ghost" className="hidden sm:inline-flex">
            Buka komunitas
          </Button>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {communityPosts.slice(0, 3).map((post, i) => (
            <div key={post.id} className="reveal group overflow-hidden rounded-3xl border border-sage-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card" style={{ transitionDelay: `${i * 70}ms` }}>
              <Link to="/community" className="block">
                <ProductVisual emoji={post.emoji} gradient={post.gradient} className="h-44" emojiClassName="text-6xl" />
              </Link>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf-50 text-lg ring-1 ring-leaf-100">{post.avatar}</span>
                  <div>
                    <p className="text-sm font-bold text-forest">{post.author}</p>
                    <p className="text-xs text-muted">Anggota komunitas</p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted">{post.content}</p>
                <div className="mt-5 flex items-center gap-4 border-t border-sage-100 pt-4 text-xs font-semibold text-muted">
                  <span className="flex items-center gap-1.5">❤️ {post.likes}</span>
                  <span className="flex items-center gap-1.5">💬 {post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-leaf-700 via-leaf-800 to-leaf-900 px-6 py-16 text-center shadow-elevated sm:px-12">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-60 w-60 rounded-full bg-sun-300/15 blur-3xl" />
          <span className="pointer-events-none absolute right-8 top-8 text-5xl opacity-20" style={{ transform: 'rotate(14deg)' }}>🍃</span>
          <div className="relative">
            <div className="animate-float mx-auto w-fit text-6xl">🌻</div>
            <h2 className="display mx-auto mt-5 max-w-2xl text-balance text-3xl font-semibold text-white sm:text-5xl">
              Siap mengubah sudut rumahmu jadi kebun hijau?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-leaf-100/80">
              Bergabung dengan ribuan pekebun perkotaan lainnya. Gratis dan mudah.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button to="/register" size="lg" variant="sun">
                Daftar gratis
              </Button>
              <Button to="/explore" size="lg" variant="secondary">
                Lihat koleksi
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
