import { api, apiMode, mockResponse, delay } from './client'

// ===== Mock Data =====

const mockListings = [
  {
    id: 1,
    user_id: 1,
    user: { id: 1, name: 'Rina Tanaman', avatar: null },
    plant_species_id: 3,
    species: { id: 3, name: 'Monstera Deliciosa', scientific_name: 'Monstera deliciosa' },
    title: 'Monstera Deliciosa 3 Daun',
    description: 'Monstera sehat dengan 3 daun besar. Sudah akar kuat, siap pindah pot. Cocok untuk pemula. Saya mau tukar dengan tanaman hias lain atau jual.',
    price: 85000,
    type: 'sell',
    images: ['/mock/monstera.jpg'],
    status: 'active',
    offers_count: 2,
    created_at: '2026-08-18T09:00:00',
  },
  {
    id: 2,
    user_id: 2,
    user: { id: 2, name: 'Budi Garden', avatar: null },
    plant_species_id: 7,
    species: { id: 7, name: 'Aloe Vera', scientific_name: 'Aloe vera' },
    title: 'Aloe Vera 5 Pohon',
    description: 'Lidah buaya yang sudah besar-besar, bisa untuk obat atau kosmetik. Mau ditukar dengan tanaman sukulen lain.',
    price: null,
    type: 'exchange',
    images: ['/mock/aloe.jpg'],
    status: 'active',
    offers_count: 4,
    created_at: '2026-08-17T14:00:00',
  },
  {
    id: 3,
    user_id: 3,
    user: { id: 3, name: 'Sari Indoor', avatar: null },
    plant_species_id: 5,
    species: { id: 5, name: 'Pothos Golden', scientific_name: 'Epipremnum aureum' },
    title: 'Pothos Golden Rambat Panjang',
    description: 'Pothos golden yang sudah rambat panjang 1.5 meter. Cocok untuk vertical garden. Mau dijual.',
    price: 45000,
    type: 'sell',
    images: ['/mock/pothos.jpg'],
    status: 'active',
    offers_count: 1,
    created_at: '2026-08-16T11:00:00',
  },
  {
    id: 4,
    user_id: 4,
    user: { id: 4, name: 'Dewi Succulent', avatar: null },
    plant_species_id: 9,
    species: { id: 9, name: 'Echeveria Elegans', scientific_name: 'Echeveria elegans' },
    title: 'Echeveria Ecole Warung',
    description: 'Koleksi echeveria 10 pcs campur. Semua sehat, warna bagus. Mau ditukar dengan kaktus atau sukulen langka.',
    price: null,
    type: 'exchange',
    images: ['/mock/echeveria.jpg'],
    status: 'active',
    offers_count: 6,
    created_at: '2026-08-15T08:00:00',
  },
  {
    id: 5,
    user_id: 5,
    user: { id: 5, name: 'Andi Ficus', avatar: null },
    plant_species_id: 2,
    species: { id: 2, name: 'Ficus Benjamina', scientific_name: 'Ficus benjamina' },
    title: 'Ficus Benjamina Bonsai',
    description: 'Ficus benjamina yang sudah dibentuk bonsai sejak 2 tahun lalu. Tinggi 40cm. Mau dijual.',
    price: 350000,
    type: 'sell',
    images: ['/mock/ficus.jpg'],
    status: 'active',
    offers_count: 0,
    created_at: '2026-08-14T16:00:00',
  },
  {
    id: 6,
    user_id: 6,
    user: { id: 6, name: 'Maya Philo', avatar: null },
    plant_species_id: 4,
    species: { id: 4, name: 'Philodendron Birkin', scientific_name: 'Philodendron birkin' },
    title: 'Philodendron Birkin Baby',
    description: 'Anakan Philo Birkin, sudah 4 daun. Mau ditukar dengan Philo lain atau tanaman hias daun.',
    price: null,
    type: 'exchange',
    images: ['/mock/philo.jpg'],
    status: 'active',
    offers_count: 3,
    created_at: '2026-08-13T10:00:00',
  },
  {
    id: 7,
    user_id: 1,
    user: { id: 1, name: 'Rina Tanaman', avatar: null },
    plant_species_id: 8,
    species: { id: 8, name: 'Sansevieria Trifasciata', scientific_name: 'Dracaena trifasciata' },
    title: 'Sansevieria Kuning (3 Pohon)',
    description: 'Sansevieria varian kuning, tinggi 30cm. Sangat mudah dirawat. Dijual murah.',
    price: 30000,
    type: 'sell',
    images: ['/mock/sanse.jpg'],
    status: 'active',
    offers_count: 1,
    created_at: '2026-08-12T12:00:00',
  },
  {
    id: 8,
    user_id: 7,
    user: { id: 7, name: 'Reza Aglaonema', avatar: null },
    plant_species_id: 10,
    species: { id: 10, name: 'Aglaonema Lipstick', scientific_name: 'Aglaonema commutatum' },
    title: 'Aglaonema Lipstick Super Red',
    description: 'Aglaonema warna merah menyala, 6 daun. Mau ditukar dengan Aglaonema varietas lain.',
    price: null,
    type: 'exchange',
    images: ['/mock/aglaonema.jpg'],
    status: 'active',
    offers_count: 2,
    created_at: '2026-08-11T09:00:00',
  },
]

const mockExchanges = [
  {
    id: 1,
    listing_id: 1,
    listing: { id: 1, title: 'Monstera Deliciosa 3 Daun', type: 'sell' },
    offerer_id: 3,
    offerer: { id: 3, name: 'Sari Indoor' },
    message: 'Halo! Monstera-nya masih available? Saya tertarik untuk beli.',
    status: 'pending',
    responded_at: null,
    created_at: '2026-08-19T10:00:00',
  },
  {
    id: 2,
    listing_id: 1,
    listing: { id: 1, title: 'Monstera Deliciosa 3 Daun', type: 'sell' },
    offerer_id: 5,
    offerer: { id: 5, name: 'Andi Ficus' },
    message: 'Bisa saya tukar dengan Ficus Benjamina saya yang kecil?',
    status: 'accepted',
    responded_at: '2026-08-20T08:00:00',
    created_at: '2026-08-18T15:00:00',
  },
  {
    id: 3,
    listing_id: 2,
    listing: { id: 2, title: 'Aloe Vera 5 Pohon', type: 'exchange' },
    offerer_id: 4,
    offerer: { id: 4, name: 'Dewi Succulent' },
    message: 'Saya tawarkan 3 Echeveria untuk 2 Aloe Vera kamu. Gimana?',
    status: 'pending',
    responded_at: null,
    created_at: '2026-08-19T14:00:00',
  },
  {
    id: 4,
    listing_id: 4,
    listing: { id: 4, title: 'Echeveria Ecole Warung', type: 'exchange' },
    offerer_id: 6,
    offerer: { id: 6, name: 'Maya Philo' },
    message: 'Saya tawarkan Philo Birkin untuk 3 Echeveria kamu.',
    status: 'rejected',
    responded_at: '2026-08-18T16:00:00',
    created_at: '2026-08-17T11:00:00',
  },
]

// ===== Helpers =====

const mapListing = (l) => ({
  id: l.id,
  userId: l.user_id,
  user: l.user,
  speciesId: l.plant_species_id,
  species: l.species,
  title: l.title,
  description: l.description,
  price: l.price != null ? Number(l.price) : null,
  type: l.type,
  images: l.images || [],
  status: l.status,
  offersCount: l.offers_count ?? 0,
  createdAt: l.created_at,
})

const mapExchange = (e) => ({
  id: e.id,
  listingId: e.listing_id,
  listing: e.listing,
  offererId: e.offerer_id,
  offerer: e.offerer,
  message: e.message,
  status: e.status,
  respondedAt: e.responded_at,
  createdAt: e.created_at,
})

// ===== API =====

export const exchangeApi = {
  getListings: async (filters = {}) => {
    if (apiMode() === 'api') {
      const res = await api.get('/plant-exchange/listings', { params: filters })
      const items = (res.data?.data?.data || res.data?.data || res.data || []).map(mapListing)
      return { success: true, message: 'Listing dimuat', data: items }
    }
    await delay()
    let filtered = mockListings.filter((l) => l.status === 'active')
    if (filters.type) filtered = filtered.filter((l) => l.type === filters.type)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      filtered = filtered.filter((l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q))
    }
    return { success: true, message: 'Listing dimuat', data: filtered.map(mapListing) }
  },

  getListing: async (id) => {
    if (apiMode() === 'api') {
      const res = await api.get(`/plant-exchange/listings/${id}`)
      return { success: true, message: 'Detail listing dimuat', data: mapListing(res.data?.data || res.data) }
    }
    await delay()
    const listing = mockListings.find((l) => l.id === Number(id))
    if (!listing) throw { response: { status: 404, data: { message: 'Listing tidak ditemukan' } } }
    return { success: true, message: 'Detail listing dimuat', data: mapListing(listing) }
  },

  createListing: async (payload) => {
    if (apiMode() === 'api') {
      const res = await api.post('/plant-exchange/listings', payload)
      return { success: true, message: 'Listing berhasil dibuat', data: mapListing(res.data?.data || res.data) }
    }
    await delay(500)
    const listing = {
      id: Date.now(),
      user_id: 1,
      user: { id: 1, name: 'Rina Tanaman', avatar: null },
      plant_species_id: payload.plant_species_id || null,
      species: null,
      title: payload.title,
      description: payload.description || '',
      price: payload.price ?? null,
      type: payload.type,
      images: payload.images || [],
      status: 'active',
      offers_count: 0,
      created_at: new Date().toISOString(),
    }
    mockListings.unshift(listing)
    return { success: true, message: 'Listing berhasil dibuat', data: mapListing(listing) }
  },

  makeOffer: async (listingId, message) => {
    if (apiMode() === 'api') {
      const res = await api.post(`/plant-exchange/listings/${listingId}/offer`, { message })
      return { success: true, message: 'Tawaran terkirim', data: mapExchange(res.data?.data || res.data) }
    }
    await delay(400)
    const listing = mockListings.find((l) => l.id === Number(listingId))
    const exchange = {
      id: Date.now(),
      listing_id: listingId,
      listing: { id: listing?.id, title: listing?.title, type: listing?.type },
      offerer_id: 1,
      offerer: { id: 1, name: 'Rina Tanaman' },
      message: message || null,
      status: 'pending',
      responded_at: null,
      created_at: new Date().toISOString(),
    }
    mockExchanges.unshift(exchange)
    if (listing) listing.offers_count = (listing.offers_count || 0) + 1
    return { success: true, message: 'Tawaran terkirim', data: mapExchange(exchange) }
  },

  getMyListings: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/plant-exchange/listings/mine')
      const items = (res.data?.data || res.data || []).map(mapListing)
      return { success: true, message: 'Listing saya dimuat', data: items }
    }
    await delay()
    const mine = mockListings.filter((l) => l.user_id === 1)
    return { success: true, message: 'Listing saya dimuat', data: mine.map(mapListing) }
  },

  getMyExchanges: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/plant-exchange/exchanges/mine')
      const items = (res.data?.data || res.data || []).map(mapExchange)
      return { success: true, message: 'Tawaran saya dimuat', data: items }
    }
    await delay()
    return { success: true, message: 'Tawaran saya dimuat', data: mockExchanges.map(mapExchange) }
  },

  respondExchange: async (exchangeId, status) => {
    if (apiMode() === 'api') {
      const res = await api.put(`/plant-exchange/exchanges/${exchangeId}`, { status })
      return { success: true, message: 'Tawaran diperbarui', data: mapExchange(res.data?.data || res.data) }
    }
    await delay(300)
    const exchange = mockExchanges.find((e) => e.id === Number(exchangeId))
    if (exchange) {
      exchange.status = status
      exchange.responded_at = new Date().toISOString()
    }
    return { success: true, message: 'Tawaran diperbarui', data: mapExchange(exchange) }
  },
}
