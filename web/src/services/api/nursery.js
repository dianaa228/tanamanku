import { api, apiMode, delay } from './client'

// ===== Mock Data =====

const mockNurseries = [
  {
    id: 1,
    name: 'Nursery Hijau Lestari',
    slug: 'nursery-hijau-lestari',
    description: 'Toko tanaman hias terlengkap di Jakarta Selatan. Menyediakan berbagai macam tanaman hias, pot, media tanam, dan pupuk organik.',
    address: 'Jl. Ragunan No. 45, Pasar Minggu, Jakarta Selatan',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    phone: '081234567890',
    email: 'hijau.lestari@email.com',
    hours: '08:00 - 17:00',
    is_open: true,
    rating_avg: 4.8,
    reviews_count: 245,
    products_count: 156,
    images: ['/mock/nursery-1.jpg'],
    categories: ['Tanaman Hias', 'Pot & Dekorasi', 'Pupuk & Nutrisi'],
    founded_year: 2018,
    owner: { id: 10, name: 'Pak Budi' },
  },
  {
    id: 2,
    name: 'Green Thumb Store',
    slug: 'green-thumb-store',
    description: 'Specialist tanaman sukulen dan kaktus. Koleksi lengkap dari lokal hingga impor. Konsultasi gratis untuk pemula.',
    address: 'Jl. Kemang Selatan XII No. 8, Kemang, Jakarta Selatan',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    phone: '081298765432',
    email: 'greenthumb@email.com',
    hours: '09:00 - 18:00',
    is_open: true,
    rating_avg: 4.6,
    reviews_count: 189,
    products_count: 98,
    images: ['/mock/nursery-2.jpg'],
    categories: ['Sukulen', 'Kaktus', 'Tanaman Hias'],
    founded_year: 2020,
    owner: { id: 11, name: 'Mbak Sari' },
  },
  {
    id: 3,
    name: 'Urban Garden Shop',
    slug: 'urban-garden-shop',
    description: 'Toko urban gardening untuk apartemen dan rumah minimalis. Vertical garden, tanaman indoor, dan perlengkapan hydroponik.',
    address: 'Jl. Fatmawati No. 123, Cilandak, Jakarta Selatan',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    phone: '085678901234',
    email: 'urban.garden@email.com',
    hours: '10:00 - 20:00',
    is_open: true,
    rating_avg: 4.5,
    reviews_count: 132,
    products_count: 75,
    images: ['/mock/nursery-3.jpg'],
    categories: ['Tanaman Indoor', 'Vertical Garden', 'Hydroponik'],
    founded_year: 2021,
    owner: { id: 12, name: 'Mas Andi' },
  },
  {
    id: 4,
    name: 'Toko Tanaman Depok',
    slug: 'toko-tanaman-depok',
    description: 'Pusat tanaman hias termurah di Depok. Stok berlimpah, harga grosir untuk pembelian banyak. Pengiriman se-Jabodetabek.',
    address: 'Jl. Alternatif No. 56, Beji, Depok',
    city: 'Depok',
    province: 'Jawa Barat',
    phone: '081345678901',
    email: 'toko.depok@email.com',
    hours: '07:00 - 16:00',
    is_open: true,
    rating_avg: 4.4,
    reviews_count: 98,
    products_count: 210,
    images: ['/mock/nursery-4.jpg'],
    categories: ['Tanaman Hias', 'Benih & Bibit', 'Media Tanam'],
    founded_year: 2015,
    owner: { id: 13, name: 'Pak Joko' },
  },
  {
    id: 5,
    name: 'Plant Paradise',
    slug: 'plant-paradise',
    description: 'Boutique tanaman premium. Spesialis Philodendron, Monstera, dan tanaman hias langka. Koleksi eksklusif.',
    address: 'Jl. Pondok Indah No. 88, Pondok Indah, Jakarta Selatan',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    phone: '082123456789',
    email: 'paradise@email.com',
    hours: '10:00 - 19:00',
    is_open: false,
    rating_avg: 4.9,
    reviews_count: 87,
    products_count: 45,
    images: ['/mock/nursery-5.jpg'],
    categories: ['Tanaman Langka', 'Philodendron', 'Monstera'],
    founded_year: 2022,
    owner: { id: 14, name: 'Mbak Dewi' },
  },
  {
    id: 6,
    name: 'Eco Garden Care',
    slug: 'eco-garden-care',
    description: 'Solusi lengkap perawatan taman. Jual tanaman, media tanam, dan layanan konsultasi perawatan taman profesional.',
    address: 'Jl. Lebak Bulus I No. 12, Lebak Bulus, Jakarta Selatan',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    phone: '085789012345',
    email: 'eco.garden@email.com',
    hours: '08:00 - 17:00',
    is_open: true,
    rating_avg: 4.3,
    reviews_count: 76,
    products_count: 88,
    images: ['/mock/nursery-6.jpg'],
    categories: ['Tanaman Hias', 'Pupuk & Nutrisi', 'Alat Berkebun'],
    founded_year: 2019,
    owner: { id: 15, name: 'Pak Rio' },
  },
]

const mockNurseryProducts = [
  { id: 101, nursery_id: 1, name: 'Monstera Deliciosa 60cm', price: 145000, stock: 12, category: 'Tanaman Hias', image: '/mock/monstera.jpg' },
  { id: 102, nursery_id: 1, name: 'Aglonema Lipstick', price: 89000, stock: 8, category: 'Tanaman Hias', image: '/mock/aglaonema.jpg' },
  { id: 103, nursery_id: 1, name: 'Pupuk NPK Mutiara 1kg', price: 30000, stock: 65, category: 'Pupuk & Nutrisi', image: '/mock/pupuk.jpg' },
  { id: 104, nursery_id: 1, name: 'Pot Terakota 20cm', price: 42000, stock: 55, category: 'Pot & Dekorasi', image: '/mock/pot.jpg' },
  { id: 201, nursery_id: 2, name: 'Echeveria Elegans', price: 35000, stock: 24, category: 'Sukulen', image: '/mock/echeveria.jpg' },
  { id: 202, nursery_id: 2, name: 'Kaktus Golden Barrel', price: 75000, stock: 8, category: 'Kaktus', image: '/mock/kaktus.jpg' },
  { id: 203, nursery_id: 2, name: 'Aloe Vera 30cm', price: 45000, stock: 18, category: 'Sukulen', image: '/mock/aloe.jpg' },
  { id: 301, nursery_id: 3, name: 'Pothos Golden Rambat', price: 35000, stock: 30, category: 'Tanaman Indoor', image: '/mock/pothos.jpg' },
  { id: 302, nursery_id: 3, name: 'Kit Vertical Garden Starter', price: 250000, stock: 15, category: 'Vertical Garden', image: '/mock/vertical.jpg' },
  { id: 401, nursery_id: 4, name: 'Sirih Gading Golden', price: 25000, stock: 100, category: 'Tanaman Hias', image: '/mock/sirih.jpg' },
  { id: 402, nursery_id: 4, name: 'Media Tanam Premium 10L', price: 35000, stock: 80, category: 'Media Tanam', image: '/mock/media.jpg' },
  { id: 501, nursery_id: 5, name: 'Philodendron Birkin', price: 185000, stock: 5, category: 'Philodendron', image: '/mock/philo.jpg' },
  { id: 502, nursery_id: 5, name: 'Monstera Thai Constellation', price: 850000, stock: 2, category: 'Monstera', image: '/mock/monstera-rare.jpg' },
]

// ===== Helpers =====

const mapNursery = (n) => ({
  id: n.id,
  name: n.name,
  slug: n.slug,
  description: n.description,
  address: n.address,
  city: n.city,
  province: n.province,
  phone: n.phone,
  email: n.email,
  hours: n.hours,
  isOpen: n.is_open,
  ratingAvg: Number(n.rating_avg) || 0,
  reviewsCount: n.reviews_count ?? 0,
  productsCount: n.products_count ?? 0,
  images: n.images || [],
  categories: n.categories || [],
  foundedYear: n.founded_year,
  owner: n.owner,
})

const mapProduct = (p) => ({
  id: p.id,
  nurseryId: p.nursery_id,
  name: p.name,
  price: Number(p.price) || 0,
  stock: p.stock ?? 0,
  category: p.category,
  image: p.image,
})

// ===== API =====

export const nurseryApi = {
  getNurseries: async (filters = {}) => {
    if (apiMode() === 'api') {
      const res = await api.get('/nurseries', { params: filters })
      const items = (res.data?.data || res.data || []).map(mapNursery)
      return { success: true, message: 'Nursery dimuat', data: items }
    }
    await delay()
    let filtered = [...mockNurseries]
    if (filters.city) filtered = filtered.filter((n) => n.city === filters.city)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      filtered = filtered.filter((n) => n.name.toLowerCase().includes(q) || n.description.toLowerCase().includes(q))
    }
    if (filters.open_only === 'true') filtered = filtered.filter((n) => n.is_open)
    return { success: true, message: 'Nursery dimuat', data: filtered.map(mapNursery) }
  },

  getNursery: async (idOrSlug) => {
    if (apiMode() === 'api') {
      const res = await api.get(`/nurseries/${idOrSlug}`)
      return { success: true, message: 'Detail nursery dimuat', data: mapNursery(res.data?.data || res.data) }
    }
    await delay()
    const nursery = mockNurseries.find((n) => n.id === Number(idOrSlug) || n.slug === idOrSlug)
    if (!nursery) throw { response: { status: 404, data: { message: 'Nursery tidak ditemukan' } } }
    return { success: true, message: 'Detail nursery dimuat', data: mapNursery(nursery) }
  },

  getNurseryProducts: async (nurseryId) => {
    if (apiMode() === 'api') {
      const res = await api.get(`/nurseries/${nurseryId}/products`)
      return { success: true, message: 'Produk dimuat', data: (res.data?.data || res.data || []).map(mapProduct) }
    }
    await delay()
    const products = mockNurseryProducts.filter((p) => p.nursery_id === Number(nurseryId))
    return { success: true, message: 'Produk dimuat', data: products.map(mapProduct) }
  },
}
