import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../../services/api/products'
import { communityApi } from '../../services/api/community'
import ProductCard from '../../components/product/ProductCard'
import Loading from '../../components/ui/Loading'
import Button from '../../components/ui/Button'
import ProductVisual from '../../components/product/ProductVisual'

const features = [
  {
    icon: '🪴',
    title: 'My Garden',
    desc: 'Catat setiap tanamanmu, pantau tinggi & kesehatan, dan simpan riwayat perawatannya.',
    to: '/my-garden',
    bg: 'bg-leaf-50',
    iconBg: 'bg-leaf-100',
  },
  {
    icon: '💡',
    title: 'Plant Finder',
    desc: 'Tidak yakin mau tanam apa? Jawab 4 pertanyaan, kami rekomendasikan tanaman paling cocok.',
    to: '/plant-finder',
    bg: 'bg-sun-50',
    iconBg: 'bg-sun-100',
  },
  {
    icon: '🩺',
    title: 'Plant Diagnosis',
    desc: 'Tanamanmu terlihat sedih? Pilih gejalanya dan dapatkan diagnosis serta solusi perawatan.',
    to: '/plant-diagnosis',
    bg: 'bg-terra-50',
    iconBg: 'bg-terra-100',
  },
]

const steps = [
  { icon: '🌱', title: 'Pilih tanamanmu', desc: 'Jelajahi ratusan tanaman & perlengkapan berkebun.' },
  { icon: '🚚', title: 'Kami antar', desc: 'Dikemas aman, sampai segar dengan ekspedisi tepercaya.' },
  { icon: '💧', title: 'Rawat dengan bantuan', desc: 'Pengingat siram, pupuk, dan diagnosis di ujung jari.' },
  { icon: '🌿', title: 'Tumbuh bersama', desc: 'Bagikan hasil kebunmu dengan komunitas Tanamanku.' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [communityPosts, setCommunityPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      productsApi.getProducts({ sort: 'terlaris' }),
      productsApi.getCategories(),
      communityApi.getPosts(),
    ]).then(([productsRes, catsRes, postsRes]) => {
      setFeatured(productsRes.data.slice(0, 8))
      setCategories(catsRes.data)
      setCommunityPosts(postsRes.data.slice(0, 3))
      setLoading(false)
    })
  }, [])

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-leaf-50 via-cream to-cream">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-leaf-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-sun-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:pb-28 lg:pt-20">
          <div className="relative z-10 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-leaf-100 px-4 py-1.5 text-xs font-semibold text-leaf-700">
              🌱 Untuk penghuni kota & pemula
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-forest sm:text-5xl lg:text-6xl">
              Tumbuhkan{' '}
              <span className="relative inline-block whitespace-nowrap text-leaf-600">
                kebun kecilmu
                <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 200 9" fill="none">
                  <path d="M2 7C50 2 150 2 198 6" stroke="#ead888" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </span>{' '}
              di tengah kota.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              Belanja tanaman sehat dari nursery terpercaya, kelola kebun pribadimu, dan dapatkan
              pengingat perawatan cerdas — semua dalam satu aplikasi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/explore" size="lg" className="btn-shine">
                Mulai belanja 🌿
              </Button>
              <Button to="/plant-finder" size="lg" variant="secondary">
                Cari tanaman ideal 💡
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
              {[
                { value: '500+', label: 'Produk pilihan' },
                { value: '120+', label: 'Nursery lokal' },
                { value: '10rb+', label: 'Kebun aktif' },
                { value: '4.9★', label: 'Rating pembeli' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-forest">{s.value}</p>
                  <p className="mt-0.5 text-xs font-medium text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="animate-float rounded-3xl bg-leaf-600 p-8 shadow-elevated">
              <div className="text-center text-[7rem] leading-none">🪴</div>
              <div className="mt-6 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                <p className="text-sm font-bold text-white">Momo · Monstera Deliciosa</p>
                <p className="mt-1 text-xs text-white/70">💧 Disiram 2 jam lalu · 📏 68 cm · 😊 Sehat</p>
              </div>
            </div>
            <div className="absolute -left-10 top-8 animate-float rounded-2xl bg-white px-5 py-3 shadow-card [animation-delay:1s]">
              <p className="text-xl">🛒</p>
              <p className="mt-0.5 text-xs font-bold text-forest">Pesanan dikemas</p>
            </div>
            <div className="absolute -right-6 bottom-10 animate-float rounded-2xl bg-white px-5 py-3 shadow-card [animation-delay:2s]">
              <p className="text-xl">💧</p>
              <p className="mt-0.5 text-xs font-bold text-forest">Pengingat siram</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ KATEGORI ═══ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-forest sm:text-3xl">Belanja per kategori</h2>
            <p className="mt-1.5 text-sm text-muted">Temukan kebutuhan kebunmu dengan cepat</p>
          </div>
          <Link to="/explore" className="hidden text-sm font-semibold text-leaf-600 hover:text-leaf-700 sm:block transition">
            Lihat semua →
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-8 flex gap-3 overflow-x-auto px-4 pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-7">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to={`/explore?category=${c.slug}`}
              className="group min-w-[8rem] shrink-0 animate-fade-up sm:min-w-0"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} text-4xl shadow-soft transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-card`}>
                <span className="transition-transform duration-300 group-hover:scale-110">{c.icon}</span>
              </div>
              <p className="mt-2.5 text-center text-sm font-semibold text-forest">{c.name}</p>
              <p className="text-center text-xs text-muted">{c.count} produk</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ PRODUK PILIHAN ═══ */}
      <section className="bg-warm-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-forest sm:text-3xl">🔥 Produk paling laris</h2>
              <p className="mt-1.5 text-sm text-muted">Favorit komunitas Tanamanku minggu ini</p>
            </div>
            <Button to="/explore" variant="ghost" className="hidden sm:inline-flex">
              Jelajahi semua
            </Button>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ CARA KERJA ═══ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-forest sm:text-3xl">Mulai berkebun dalam 4 langkah</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Dari bibit hingga panen — Tanamanku menemani di setiap tahap.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative animate-fade-up rounded-2xl border border-sage-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="absolute right-4 top-3 text-4xl font-extrabold text-sage-100">{i + 1}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-leaf-100 text-2xl">{s.icon}</span>
              <h3 className="mt-3.5 text-base font-bold text-forest">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FITUR CERDAS ═══ */}
      <section className="bg-forest py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Berkebun jadi lebih cerdas 🧠</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-leaf-200/60">
              Fitur eksklusif Tanamanku yang tidak ada di marketplace biasa.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((f) => (
              <Link
                key={f.title}
                to={f.to}
                className="group rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/8 hover:ring-white/20"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${f.iconBg} text-3xl shadow-soft transition-transform duration-300 group-hover:scale-105`}>
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-leaf-200/50">{f.desc}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-sun-300 transition group-hover:translate-x-1">
                  Coba sekarang →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ KOMUNITAS ═══ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-forest sm:text-3xl">💬 Cerita dari komunitas</h2>
            <p className="mt-1.5 text-sm text-muted">Hasil kebun para anggota Tanamanku</p>
          </div>
          <Button to="/community" variant="ghost" className="hidden sm:inline-flex">
            Buka komunitas
          </Button>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {communityPosts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              to="/community"
              className="group overflow-hidden rounded-2xl border border-sage-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <ProductVisual emoji={post.emoji} gradient={post.gradient} className="h-36" emojiClassName="text-5xl" />
              <div className="p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-100 text-base">{post.avatar}</span>
                  <div>
                    <p className="text-sm font-bold text-forest">{post.author}</p>
                    <p className="text-xs text-muted">2 hari lalu</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{post.content}</p>
                <p className="mt-3 text-xs font-semibold text-muted-light">❤️ {post.likes} · 💬 {post.comments.length}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-leaf-700 px-6 py-14 text-center shadow-elevated sm:px-12">
          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/8 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-8 h-52 w-52 rounded-full bg-sun-300/15 blur-3xl" />
          <div className="animate-float text-5xl">🌻</div>
          <h2 className="mx-auto mt-4 max-w-xl text-3xl font-extrabold text-white sm:text-4xl">
            Siap mengubah sudut rumahmu jadi kebun hijau?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-leaf-100/70">
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
