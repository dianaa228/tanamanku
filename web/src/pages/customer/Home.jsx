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
      // Map API categories to include gradient colors
      const gradients = [
        'from-leaf-200 to-leaf-400',
        'from-emerald-100 to-emerald-300',
        'from-rose-100 to-rose-300',
        'from-amber-100 to-amber-300',
        'from-violet-100 to-violet-300',
        'from-sky-100 to-sky-300',
        'from-orange-100 to-orange-300',
      ]
      const mappedCategories = catsRes.data.map((c, i) => ({
        ...c,
        count: c.products_count || 0,
        gradient: gradients[i % gradients.length],
      }))
      setCategories(mappedCategories)
      setCommunityPosts(postsRes.data.slice(0, 3))
      setLoading(false)
    })
  }, [])

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-leaf-100/70 via-cream to-cream">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-leaf-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-sun-200/40 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:pb-24 lg:pt-20">
          <div className="relative z-10 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-leaf-700 shadow-soft">
              🌱 Untuk penghuni kota & pemula
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-leaf-950 sm:text-5xl lg:text-6xl">
              Tumbuhkan{' '}
              <span className="relative whitespace-nowrap text-leaf-600">
                kebun kecilmu
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 9" fill="none">
                  <path d="M2 7C50 2 150 2 198 6" stroke="#f5a714" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{' '}
              di tengah kota.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-leaf-900/60 sm:text-lg">
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
            <div className="mt-10 flex flex-wrap gap-8">
              {[
                { value: '500+', label: 'Produk pilihan' },
                { value: '120+', label: 'Nursery lokal' },
                { value: '10rb+', label: 'Kebun aktif' },
                { value: '4.9★', label: 'Rating pembeli' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-leaf-800">{s.value}</p>
                  <p className="text-xs font-medium text-leaf-900/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual hero */}
          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="animate-float rounded-[2.5rem] bg-gradient-to-br from-leaf-400 to-leaf-700 p-8 shadow-lift">
              <div className="text-center text-[7rem] leading-none">🪴</div>
              <div className="mt-6 rounded-3xl bg-white/15 p-4 backdrop-blur">
                <p className="text-sm font-bold text-white">Momo · Monstera Deliciosa</p>
                <p className="mt-1 text-xs text-leaf-100/90">💧 Disiram 2 jam lalu · 📏 68 cm · 😊 Sehat</p>
              </div>
            </div>
            <div className="absolute -left-10 top-8 animate-float rounded-3xl bg-white px-4 py-3 shadow-lift [animation-delay:1s]">
              <p className="text-2xl">🛒</p>
              <p className="text-xs font-bold text-leaf-900">Pesanan dikemas</p>
            </div>
            <div className="absolute -right-6 bottom-10 animate-float rounded-3xl bg-white px-4 py-3 shadow-lift [animation-delay:2s]">
              <p className="text-2xl">💧</p>
              <p className="text-xs font-bold text-leaf-900">Pengingat siram</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KATEGORI ===== */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-leaf-950 sm:text-3xl">Belanja per kategori</h2>
            <p className="mt-1 text-sm text-leaf-900/50">Temukan kebutuhan kebunmu dengan cepat</p>
          </div>
          <Link to="/explore" className="hidden text-sm font-bold text-leaf-700 hover:text-leaf-800 sm:block">
            Lihat semua →
          </Link>
        </div>
        <div className="no-scrollbar -mx-4 mt-6 flex gap-4 overflow-x-auto px-4 pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible lg:grid-cols-7">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to={`/explore?category=${c.slug}`}
              className="group min-w-[8.5rem] shrink-0 animate-fade-up sm:min-w-0"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className={`flex aspect-square items-center justify-center rounded-3xl bg-gradient-to-br ${c.gradient} text-5xl shadow-soft transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lift`}
              >
                <span className="transition-transform duration-300 group-hover:scale-110">{c.icon}</span>
              </div>
              <p className="mt-3 text-center text-sm font-bold text-leaf-950">{c.name}</p>
              <p className="text-center text-xs text-leaf-900/40">{c.count} produk</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== PRODUK PILIHAN ===== */}
      <section className="bg-white/60 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-leaf-950 sm:text-3xl">🔥 Produk paling laris</h2>
              <p className="mt-1 text-sm text-leaf-900/50">Favorit komunitas Tanamanku minggu ini</p>
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
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-leaf-950 sm:text-3xl">Mulai berkebun dalam 4 langkah</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-leaf-900/50">
            Dari bibit hingga panen — Tanamanku menemani di setiap tahap.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative animate-fade-up rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="absolute right-5 top-4 text-5xl font-extrabold text-leaf-100">{i + 1}</span>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-100 text-3xl">{s.icon}</span>
              <h3 className="mt-4 text-lg font-bold text-leaf-950">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-leaf-900/55">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FITUR CERDAS ===== */}
      <section className="bg-leaf-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Berkebun jadi lebih cerdas 🧠</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-leaf-100/60">
              Fitur eksklusif Tanamanku yang tidak ada di marketplace biasa.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <Link
                key={f.title}
                to={f.to}
                className="group rounded-3xl bg-leaf-900/50 p-6 ring-1 ring-leaf-800 transition hover:-translate-y-1 hover:bg-leaf-900"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} text-3xl shadow-soft transition-transform duration-300 group-hover:scale-110`}>
                  {f.icon}
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-leaf-100/60">{f.desc}</p>
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
            <p className="mt-1 text-sm text-leaf-900/50">Hasil kebun para anggota Tanamanku</p>
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
              className="group overflow-hidden rounded-3xl border border-leaf-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <ProductVisual emoji={post.emoji} gradient={post.gradient} className="h-40" emojiClassName="text-6xl" />
              <div className="p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-100 text-lg">{post.avatar}</span>
                  <div>
                    <p className="text-sm font-bold text-leaf-950">{post.author}</p>
                    <p className="text-xs text-leaf-900/40">2 hari lalu</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-leaf-900/70">{post.content}</p>
                <p className="mt-3 text-xs font-semibold text-leaf-900/50">❤️ {post.likes} · 💬 {post.comments.length}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-leaf-600 to-leaf-800 px-6 py-14 text-center shadow-lift sm:px-12">
          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -right-8 h-56 w-56 rounded-full bg-sun-400/20 blur-2xl" />
          <div className="animate-float text-5xl">🌻</div>
          <h2 className="mx-auto mt-4 max-w-xl text-3xl font-extrabold text-white sm:text-4xl">
            Siap mengubah sudut rumahmu jadi kebun hijau?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-leaf-100/80">
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
