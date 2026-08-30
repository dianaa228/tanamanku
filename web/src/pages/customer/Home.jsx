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
      const apiProducts = productsRes.status === 'fulfilled' ? productsRes.value.data : []
      setFeatured(apiProducts.length > 0 ? apiProducts.slice(0, 8) : mockProducts.slice(0, 8))

      if (catsRes.status === 'fulfilled' && catsRes.value.data?.length) {
        setCategories(catsRes.value.data.map(toHomeCategory))
      }

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
      <section className="bg-[#e8f0e6] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c3d7c4] bg-white px-4 py-1.5 text-xs font-semibold text-[#345240] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#537d60]" />
              Kebun perkotaan dalam genggaman
            </span>

            <h1 className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-tight text-[#1c2b22] sm:text-5xl lg:text-6xl">
              Rawat tanamanmu.{' '}
              <span className="text-[#345240]">Tumbuhkan</span> kebiasaan baik.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#3f654c] sm:text-lg">
              Tanamanku menyatukan belanja tanaman dari nursery tepercaya, kebun pribadi yang mudah dicatat, dan pengingat perawatan cerdas — jadi berkebun terasa ringan, tidak rumit.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/explore" size="lg" className="btn-shine">
                Mulai berkebun
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Button>
              <Button to="/plant-finder" size="lg" variant="secondary">
                💡 Cari tanaman ideal
              </Button>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-[#c3d7c4] pt-7">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-2xl font-semibold text-[#1c2b22] sm:text-3xl">
                    <CountUp end={s.end} suffix={s.suffix} label={s.label} />
                  </dd>
                  <dd className="mt-1 text-xs font-medium text-[#3f654c]">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual composition */}
          <div className="relative mx-auto hidden w-full max-w-xl lg:block">
            <div className="relative overflow-hidden rounded-3xl border border-[#c3d7c4] bg-white shadow-lg">
              <div className="flex h-80 items-center justify-center bg-[#d4e4d1]">
                <span className="animate-float text-[8rem] drop-shadow-lg">🪴</span>
              </div>
              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <p className="text-lg font-semibold text-[#1c2b22]">Momo · Monstera</p>
                  <p className="text-sm text-[#3f654c]">Disiram 2 jam lalu · 68 cm · Sehat</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f0e6] text-xl">😊</span>
              </div>
            </div>

            <div className="absolute -left-10 top-8 animate-float rounded-2xl border border-[#c3d7c4] bg-white px-4 py-3 shadow-md" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e0f2fe] text-lg">💧</span>
                <div>
                  <p className="text-xs font-semibold text-[#1c2b22]">Pengingat siram</p>
                  <p className="text-[11px] text-[#68756c]">Momo · hari ini</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 bottom-20 animate-float rounded-2xl border border-[#c3d7c4] bg-white px-4 py-3 shadow-md" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0fdf4] text-lg">🌿</span>
                <div>
                  <p className="text-xs font-semibold text-[#1c2b22]">Pesanan dikemas</p>
                  <p className="text-[11px] text-[#68756c]">2 tanaman siap antar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ KATEGORI ═══ */}
      <section className="bg-[#f5f2eb] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#b56545]">Belanja</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#1c2b22] sm:text-4xl">Temukan per kategori</h2>
            </div>
            <Link to="/explore" className="hidden text-sm font-semibold text-[#3f654c] hover:text-[#345240] sm:block">
              Lihat semua →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to={`/explore?category=${c.slug}`}
                className="group"
              >
                <div className="flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-3xl border border-[#c3d7c4] bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                  <span className="text-5xl transition-transform duration-300 group-hover:scale-110">{c.emoji}</span>
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#1c2b22]">{c.name}</p>
                    <p className="text-xs text-[#3f654c]">{c.tagline}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUK PILIHAN ═══ */}
      <section className="bg-[#e8f0e6] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#b56545]">Paling diminati</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#1c2b22] sm:text-4xl">Favorit minggu ini</h2>
              <p className="mt-2 text-sm text-[#3f654c]">Pilihan komunitas Tanamanku yang laris manis.</p>
            </div>
            <Button to="/explore" variant="ghost" className="hidden sm:inline-flex">
              Jelajahi semua
            </Button>
          </div>
          {loading ? (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-72 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {featured.map((p, i) => (
                <div key={p.id}>
                  <ProductCard product={p} compact />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ KENAPA TANAMANKU ═══ */}
      <section className="bg-[#f5f2eb] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#b56545]">Kenapa Tanamanku</p>
              <h2 className="mt-2 text-balance text-3xl font-semibold text-[#1c2b22] sm:text-4xl">
                Berbeda dari marketplace biasa — dibuat untuk pekebun sungguhan.
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-[#3f654c]">
                Tanamanku bukan sekadar tempat belanja. Ini rumah digital tempat setiap tanaman punya riwayat, setiap perawatan punya jadwal, dan setiap pekebun punya komunitas.
              </p>
              <ul className="mt-8 space-y-5">
                {[
                  { icon: '📖', title: 'Riwayat per tanaman', desc: 'Semua yang kamu lakukan tercatat — tinggi, penyiraman, hama, hingga panen.' },
                  { icon: '🔄', title: 'Cari & tukar tanaman', desc: 'Temukan tanaman langka atau tawarkan hasil stekmu ke sesama anggota.' },
                  { icon: '🤝', title: 'Nursery terverifikasi', desc: 'Jual beli bersama penjual lokal terpercaya dengan ulasan asli.' },
                ].map((f) => (
                  <li key={f.title} className="flex gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0e6] text-2xl ring-1 ring-[#c3d7c4]">{f.icon}</span>
                    <div>
                      <p className="font-bold text-[#1c2b22]">{f.title}</p>
                      <p className="text-sm leading-relaxed text-[#3f654c]">{f.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button to="/register" size="lg" variant="primary">Mulai gratis</Button>
              </div>
            </div>

            <div className="relative">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-3xl bg-[#1a3328] p-7 text-white shadow-lg">
                  <span className="text-4xl">🌱</span>
                  <p className="mt-4 text-4xl font-semibold">4 langkah</p>
                  <p className="mt-2 text-sm text-white/70">Dari bibit hingga kebun yang tumbuh, kami menemani.</p>
                </div>
                <div className="mt-6 rounded-3xl border border-[#c3d7c4] bg-white p-7 shadow-md">
                  <span className="text-4xl">🪴</span>
                  <p className="mt-4 text-4xl font-semibold text-[#1c2b22]">
                    <CountUp end={siteStats.gardens || 10000} suffix="+" label="Kebun aktif" />
                  </p>
                  <p className="mt-2 text-sm text-[#3f654c]">kebun aktif tumbuh bersama setiap hari.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CARA KERJA ═══ */}
      <section className="bg-[#e8f0e6] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#b56545]">Cara kerja</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#1c2b22] sm:text-4xl">Mulai dalam 4 langkah</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="relative rounded-3xl border border-[#c3d7c4] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="absolute right-5 top-4 text-5xl font-semibold text-[#e0ebe0]">{i + 1}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f0e6] text-3xl ring-1 ring-[#c3d7c4]">{s.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-[#1c2b22]">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#3f654c]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FITUR CERDAS ═══ */}
      <section className="bg-[#1a3328] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[#d2a74e]">Berkebun lebih cerdas</p>
            <h2 className="mt-2 text-balance text-3xl font-semibold text-white sm:text-4xl">
              Fitur yang tak ada di marketplace biasa
            </h2>
            <p className="mt-3 text-sm text-white/50">
              Semua yang kamu butuhkan untuk merawat tanaman jadi satu, tanpa pindah-pindah aplikasi.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {careFeatures.map((f) => (
              <Link
                key={f.title}
                to={f.to}
                className="group rounded-3xl bg-white/10 p-6 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.15] hover:ring-white/20"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105">
                  {f.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{f.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#d2a74e] transition group-hover:gap-2.5">
                  Coba sekarang →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ KOMUNITAS ═══ */}
      <section className="bg-[#f5f2eb] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#b56545]">Komunitas</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#1c2b22] sm:text-4xl">Cerita dari para pekebun</h2>
              <p className="mt-2 text-sm text-[#3f654c]">Hasil kebun para anggota Tanamanku.</p>
            </div>
            <Button to="/community" variant="ghost" className="hidden sm:inline-flex">
              Buka komunitas
            </Button>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {communityPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="group overflow-hidden rounded-3xl border border-[#c3d7c4] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <Link to="/community" className="block">
                  <ProductVisual emoji={post.emoji} gradient={post.gradient} className="h-44" emojiClassName="text-6xl" />
                </Link>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f0e6] text-lg ring-1 ring-[#c3d7c4]">{post.avatar}</span>
                    <div>
                      <p className="text-sm font-bold text-[#1c2b22]">{post.author}</p>
                      <p className="text-xs text-[#68756c]">Anggota komunitas</p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-[#3f654c]">{post.content}</p>
                  <div className="mt-5 flex items-center gap-4 border-t border-[#e0ebe0] pt-4 text-xs font-semibold text-[#68756c]">
                    <span className="flex items-center gap-1.5">❤️ {post.likes}</span>
                    <span className="flex items-center gap-1.5">💬 {post.comments?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="bg-[#f5f2eb] px-4 pb-10">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#1a3328] px-6 py-16 text-center shadow-xl sm:px-12">
          <div className="animate-float mx-auto w-fit text-6xl">🌻</div>
          <h2 className="mx-auto mt-5 max-w-2xl text-balance text-3xl font-semibold text-white sm:text-5xl">
            Siap mengubah sudut rumahmu jadi kebun hijau?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
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
      </section>
    </div>
  )
}
