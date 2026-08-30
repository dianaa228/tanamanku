import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../../services/api/products'
import { communityApi } from '../../services/api/community'
import { statsApi } from '../../services/api/stats'
import ProductCard from '../../components/product/ProductCard'
import Button from '../../components/ui/Button'
import ProductVisual from '../../components/product/ProductVisual'
import CountUp from '../../components/ui/CountUp'
import { mockProducts, communityPosts as mockPosts } from '../../services/api/mock-data'

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
  const [loading, setLoading] = useState(true)
  const [siteStats, setSiteStats] = useState({ products: 0, nurseries: 0, gardens: 0 })
  const revealRef = useReveal()

  useEffect(() => {
    Promise.allSettled([
      productsApi.getProducts({ sort: 'terlaris' }),
      productsApi.getCategories(),
      communityApi.getPosts(),
      statsApi.getStats(),
    ]).then(([productsRes, catsRes, postsRes, statsRes]) => {
      // Products: fallback to mock if API returns empty
      const apiProducts = productsRes.status === 'fulfilled' ? productsRes.value.data : []
      setFeatured(apiProducts.length > 0 ? apiProducts.slice(0, 8) : mockProducts.slice(0, 8))

      // Categories: fallback to default if API returns empty
      if (catsRes.status === 'fulfilled' && catsRes.value.data?.length) {
        setCategories(catsRes.value.data.map(toHomeCategory))
      }

      // Community posts: fallback to mock if API returns empty
      const apiPosts = postsRes.status === 'fulfilled' ? postsRes.value.data : []
      setCommunityPosts(apiPosts.length > 0 ? apiPosts.slice(0, 3) : mockPosts.slice(0, 3))

      if (statsRes.status === 'fulfilled') setSiteStats(statsRes.value.data)
      setLoading(false)
    })
  }, [])

  const stats = [
    { end: siteStats.products || 27, suffix: '+', label: 'Produk pilihan' },
    { end: siteStats.nurseries || 6, suffix: '+', label: 'Nursery lokal' },
    { end: siteStats.gardens || 10000, suffix: '+', label: 'Kebun aktif' },
  ]

  return (
    <div ref={revealRef}>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#e8f0e6] to-[#f5f2eb]">
        {/* decorative botanical orbs */}
        <div className="pointer-events-none absolute -right-28 -top-24 h-[420px] w-[420px] rounded-full bg-leaf-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-6 h-80 w-80 rounded-full bg-sun-300/20 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-10 text-6xl opacity-10" style={{ transform: 'rotate(-18deg)' }}>🍃</div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:pb-24 lg:pt-16">
          {/* Copy */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-1.5 text-xs font-semibold text-leaf-400 shadow-soft backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-leaf-500" />
              Kebun perkotaan dalam genggaman
            </span>

            <h1 className="display mt-6 text-balance text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-[var(--text-primary)] sm:text-6xl lg:text-[4.2rem]">
              Rawat tanamanmu.{' '}
              <span className="text-gradient-botanical">Tumbuhkan</span> kebiasaan baik.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
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
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-[var(--border-primary)] pt-7">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="display text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
                    <CountUp end={s.end} suffix={s.suffix} label={s.label} />
                  </dd>
                  <dd className="mt-1 text-xs font-medium text-[var(--text-secondary)]">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual composition */}
          <div className="relative mx-auto hidden w-full max-w-xl lg:block">
            {/* main card */}
            <div className="relative overflow-hidden rounded-[2rem] border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-elevated backdrop-blur-sm">
              <div className="relative overflow-hidden bg-gradient-to-br from-leaf-100 via-cream to-sun-50">
                <div className="flex h-80 items-center justify-center">
                  <span className="animate-float text-[9rem] drop-shadow-xl">🪴</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="display text-lg font-semibold text-[var(--text-primary)]">Momo · Monstera</p>
                  <p className="text-sm text-[var(--text-secondary)]">Disiram 2 jam lalu · 68 cm · Sehat</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-800/20 text-xl">😊</span>
              </div>
            </div>

            {/* floating chip: watering */}
            <div className="absolute -left-10 top-8 animate-float rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-3 shadow-card backdrop-blur-sm [animation-delay:1s]">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-800/20 text-lg">💧</span>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-primary)]">Pengingat siram</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Momo · hari ini</p>
                </div>
              </div>
            </div>

            {/* floating chip: order */}
            <div className="absolute -right-6 bottom-20 animate-float rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-4 py-3 shadow-card backdrop-blur-sm [animation-delay:2s]">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terra-800/20 text-lg">🌿</span>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-primary)]">Pesanan dikemas</p>
                  <p className="text-[11px] text-[var(--text-muted)]">2 tanaman siap antar</p>
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
      <section className="section-cream mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="reveal flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-terra-400">Belanja</p>
            <h2 className="display mt-2 text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">Temukan per kategori</h2>
          </div>
          <Link to="/explore" className="hidden text-sm font-semibold text-leaf-400 transition hover:text-leaf-300 sm:block">
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
              <div className="flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-soft backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-leaf-400/50 group-hover:shadow-card">
                <span className="text-5xl transition-transform duration-300 group-hover:scale-110">{c.emoji}</span>
                <div className="text-center">
                  <p className="text-sm font-bold text-[var(--text-primary)]">{c.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{c.tagline}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ PRODUK PILIHAN ═══ */}
      <section className="section-gradient py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="reveal flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-terra-400">Paling diminati</p>
              <h2 className="display mt-2 text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">Favorit minggu ini</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">Pilihan komunitas Tanamanku yang laris manis.</p>
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
              {featured.length === 0 && (
                <div className="col-span-full">
                  <div className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-[var(--border-primary)] bg-[var(--bg-card)] px-6 py-16 text-center backdrop-blur-sm">
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bg-card)] text-5xl shadow-card ring-1 ring-[var(--border-primary)]">🛍️</span>
                    <h3 className="text-2xl font-semibold text-[var(--text-primary)]">Koleksi sedang disiapkan</h3>
                    <p className="max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
                      Toko-toko kami sedang merapikan koleksi terbaru. Coba lihat lagi sebentar lagi ya!
                    </p>
                    <Button to="/explore" variant="primary">Jelajahi katalog</Button>
                  </div>
                </div>
              )}
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
      <section className="section-cream mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="reveal">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-terra-400">Kenapa Tanamanku</p>
            <h2 className="display mt-2 text-balance text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
              Berbeda dari marketplace biasa — dibuat untuk pekebun sungguhan.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--text-secondary)]">
              Tanamanku bukan sekadar tempat belanja. Ini rumah digital tempat setiap tanaman punya riwayat, setiap perawatan punya jadwal, dan setiap pekebun punya komunitas.
            </p>
            <ul className="mt-8 space-y-5">
              {[
                { icon: '📖', title: 'Riwayat per tanaman', desc: 'Semua yang kamu lakukan tercatat — tinggi, penyiraman, hama, hingga panen.' },
                { icon: '🔄', title: 'Cari & tukar tanaman', desc: 'Temukan tanaman langka atau tawarkan hasil stekmu ke sesama anggota.' },
                { icon: '🤝', title: 'Nursery terverifikasi', desc: 'Jual beli bersama penjual lokal terpercaya dengan ulasan asli.' },
              ].map((f) => (
                <li key={f.title} className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-leaf-800/20 text-2xl ring-1 ring-[var(--border-primary)]">{f.icon}</span>
                  <div>
                    <p className="font-bold text-[var(--text-primary)]">{f.title}</p>
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{f.desc}</p>
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
              <div className="mt-6 rounded-[2rem] border border-[var(--border-primary)] bg-[var(--bg-card)] p-7 shadow-card backdrop-blur-sm">
                <span className="text-4xl">🪴</span>
                <p className="display mt-4 text-4xl font-semibold text-[var(--text-primary)]">
                  <CountUp end={siteStats.gardens || 10000} suffix="+" label="Kebun aktif" />
                </p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">kebun aktif tumbuh bersama setiap hari.</p>
              </div>
            </div>
            <span className="absolute -right-8 -top-8 text-6xl opacity-15" style={{ transform: 'rotate(18deg)' }}>🪴</span>
          </div>
        </div>
      </section>

      {/* ═══ CARA KERJA ═══ */}
      <section className="section-cream mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="reveal text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-terra-400">Cara kerja</p>
          <h2 className="display mt-2 text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">Mulai dalam 4 langkah</h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="reveal relative rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-7 shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="absolute right-5 top-4 display text-5xl font-semibold text-[var(--border-primary)]">{i + 1}</span>
              <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-leaf-800/20 text-3xl ring-1 ring-[var(--border-primary)]" style={{ height: '3.25rem', width: '3.25rem' }}>{s.icon}</span>
              <h3 className="display mt-4 text-lg font-semibold text-[var(--text-primary)]">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FITUR CERDAS (dark) ═══ */}
      <section className="section-dark py-20">
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
      <section className="section-cream mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="reveal flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-terra-400">Komunitas</p>
            <h2 className="display mt-2 text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">Cerita dari para pekebun</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Hasil kebun para anggota Tanamanku.</p>
          </div>
          <Button to="/community" variant="ghost" className="hidden sm:inline-flex">
            Buka komunitas
          </Button>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {communityPosts.length === 0 && (
            <div className="md:col-span-3">
              <div className="flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-[var(--border-primary)] bg-[var(--bg-card)] px-6 py-16 text-center backdrop-blur-sm">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--bg-card)] text-5xl shadow-card ring-1 ring-[var(--border-primary)]">💬</span>
                <h3 className="text-2xl font-semibold text-[var(--text-primary)]">Belum ada cerita</h3>
                <p className="max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
                  Jadilah pekebun pertama yang berbagi hasil kebun. Ceritamu bisa menginspirasi komunitas!
                </p>
                <Button to="/community" variant="primary">Mulai cerita</Button>
              </div>
            </div>
          )}
          {communityPosts.slice(0, 3).map((post, i) => (
            <div key={post.id} className="reveal group overflow-hidden rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card" style={{ transitionDelay: `${i * 70}ms` }}>
              <Link to="/community" className="block">
                <ProductVisual emoji={post.emoji} gradient={post.gradient} className="h-44" emojiClassName="text-6xl" />
              </Link>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf-800/20 text-lg ring-1 ring-[var(--border-primary)]">{post.avatar}</span>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{post.author}</p>
                    <p className="text-xs text-[var(--text-muted)]">Anggota komunitas</p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">{post.content}</p>
                <div className="mt-5 flex items-center gap-4 border-t border-[var(--border-primary)] pt-4 text-xs font-semibold text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5">❤️ {post.likes}</span>
                  <span className="flex items-center gap-1.5">💬 {post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section-dark mx-auto max-w-7xl px-4 pb-6 sm:px-6">
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
