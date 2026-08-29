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
    gradient: 'from-leaf-400 to-emerald-700',
  },
  {
    icon: '💡',
    title: 'Plant Finder',
    desc: 'Tidak yakin mau tanam apa? Jawab 4 pertanyaan, kami rekomendasikan tanaman paling cocok.',
    to: '/plant-finder',
    gradient: 'from-sun-300 to-orange-500',
  },
  {
    icon: '🩺',
    title: 'Plant Diagnosis',
    desc: 'Tanamanmu terlihat sedih? Pilih gejalanya dan dapatkan diagnosis serta solusi perawatan.',
    to: '/plant-diagnosis',
    gradient: 'from-rose-300 to-red-500',
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
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden mesh-hero noise">
        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-leaf-300/30 to-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-80 w-80 rounded-full bg-gradient-to-tr from-sun-200/40 to-amber-300/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:pb-24 lg:pt-20">
          <div className="relative z-10 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-leaf-200/80 bg-white/80 px-4 py-1.5 text-xs font-bold text-leaf-700 shadow-sm backdrop-blur-sm">
              🌱 Untuk penghuni kota & pemula
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-leaf-950 sm:text-5xl lg:text-6xl">
              Tumbuhkan{' '}
              <span className="relative inline-block whitespace-nowrap text-leaf-600">
                kebun kecilmu
                <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 200 9" fill="none">
                  <path d="M2 7C50 2 150 2 198 6" stroke="url(#underline-grad)" strokeWidth="4" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4ade80" />
                      <stop offset="0.5" stopColor="#22c55e" />
                      <stop offset="1" stopColor="#f5a714" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{' '}
              di tengah kota.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-leaf-800/60 sm:text-lg">
              Belanja tanaman sehat dari nursery terpercaya, kelola kebun pribadimu, dan dapatkan
              pengingat perawatan cerdas — semua dalam satu aplikasi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/explore" size="lg" className="btn-shine shadow-xl shadow-leaf-600/20">
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
                <div key={s.label} className="group">
                  <p className="text-2xl font-extrabold text-leaf-800 transition group-hover:text-leaf-600">{s.value}</p>
                  <p className="mt-0.5 text-xs font-medium text-leaf-600/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual hero */}
          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="animate-float rounded-[2.5rem] bg-gradient-to-br from-leaf-500 via-leaf-600 to-emerald-700 p-8 shadow-2xl shadow-leaf-600/30">
              <div className="text-center text-[7rem] leading-none drop-shadow-xl">🪴</div>
              <div className="mt-6 rounded-3xl bg-white/15 p-4 backdrop-blur-md ring-1 ring-white/10">
                <p className="text-sm font-bold text-white">Momo · Monstera Deliciosa</p>
                <p className="mt-1 text-xs text-leaf-100/80">💧 Disiram 2 jam lalu · 📏 68 cm · 😊 Sehat</p>
              </div>
            </div>
            <div className="absolute -left-10 top-8 animate-float rounded-3xl bg-white px-5 py-3.5 shadow-xl shadow-black/8 [animation-delay:1s]">
              <p className="text-2xl">🛒</p>
              <p className="mt-0.5 text-xs font-bold text-leaf-900">Pesanan dikemas</p>
            </div>
            <div className="absolute -right-6 bottom-10 animate-float rounded-3xl bg-white px-5 py-3.5 shadow-xl shadow-black/8 [animation-delay:2s]">
              <p className="text-2xl">💧</p>
              <p className="mt-0.5 text-xs font-bold text-leaf-900">Pengingat siram</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KATEGORI ===== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-leaf-950 sm:text-3xl">Belanja per kategori</h2>
            <p className="mt-1.5 text-sm text-leaf-700/50">Temukan kebutuhan kebunmu dengan cepat</p>
          </div>
          <Link to="/explore" className="hidden text-sm font-bold text-leaf-600 hover:text-leaf-700 sm:block transition">
            Lihat semua →
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-8 flex gap-4 overflow-x-auto px-4 pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-7">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to={`/explore?category=${c.slug}`}
              className="group min-w-[8.5rem] shrink-0 animate-fade-up sm:min-w-0"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className={`flex aspect-square items-center justify-center rounded-3xl bg-gradient-to-br ${c.gradient} text-5xl shadow-card transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-elevated group-hover:scale-[1.02]`}
              >
                <span className="transition-transform duration-300 group-hover:scale-110 drop-shadow-md">{c.icon}</span>
              </div>
              <p className="mt-3 text-center text-sm font-bold text-leaf-950">{c.name}</p>
              <p className="text-center text-xs text-leaf-600/50">{c.count} produk</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== PRODUK PILIHAN ===== */}
      <section className="bg-gradient-to-b from-white/80 to-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-leaf-950 sm:text-3xl">🔥 Produk paling laris</h2>
              <p className="mt-1.5 text-sm text-leaf-700/50">Favorit komunitas Tanamanku minggu ini</p>
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

      {/* ===== CARA KERJA ===== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-leaf-950 sm:text-3xl">Mulai berkebun dalam 4 langkah</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-leaf-700/50">
            Dari bibit hingga panen — Tanamanku menemani di setiap tahap.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative animate-fade-up rounded-3xl border border-leaf-100/80 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-elevated"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="absolute right-5 top-4 text-5xl font-extrabold text-leaf-100/80">{i + 1}</span>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf-100 to-leaf-200/80 text-3xl shadow-sm">{s.icon}</span>
              <h3 className="mt-4 text-lg font-bold text-leaf-950">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-leaf-700/55">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FITUR CERDAS ===== */}
      <section className="relative overflow-hidden bg-leaf-950 py-20">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-leaf-800/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-leaf-700/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Berkebun jadi lebih cerdas 🧠</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-leaf-200/50">
              Fitur eksklusif Tanamanku yang tidak ada di marketplace biasa.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <Link
                key={f.title}
                to={f.to}
                className="group rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:ring-white/20 hover:shadow-2xl hover:shadow-leaf-500/10"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} text-3xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                  {f.icon}
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-leaf-100/50">{f.desc}</p>
                <span className="mt-4 inline-block text-sm font-bold text-sun-300 transition group-hover:translate-x-1">
                  Coba sekarang →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PREVIEW KOMUNITAS ===== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-leaf-950 sm:text-3xl">💬 Cerita dari komunitas</h2>
            <p className="mt-1.5 text-sm text-leaf-700/50">Hasil kebun para anggota Tanamanku</p>
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
              className="group overflow-hidden rounded-3xl border border-leaf-100/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-elevated"
            >
              <ProductVisual emoji={post.emoji} gradient={post.gradient} className="h-40" emojiClassName="text-6xl" />
              <div className="p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-leaf-100 to-leaf-200 text-lg">{post.avatar}</span>
                  <div>
                    <p className="text-sm font-bold text-leaf-950">{post.author}</p>
                    <p className="text-xs text-leaf-500">2 hari lalu</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-leaf-700/70">{post.content}</p>
                <p className="mt-3 text-xs font-semibold text-leaf-500">❤️ {post.likes} · 💬 {post.comments.length}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-leaf-600 via-leaf-700 to-emerald-800 px-6 py-16 text-center shadow-2xl shadow-leaf-700/30 sm:px-12">
          <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-sun-400/20 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-leaf-400/15 blur-2xl" />
          <div className="animate-float text-5xl drop-shadow-lg">🌻</div>
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
