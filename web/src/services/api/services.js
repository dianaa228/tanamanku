import { api, apiMode, mockResponse, delay } from './client'

// ===== Mock Data =====

const mockServices = [
  {
    id: 1,
    name: 'Landscaping Taman Depan',
    category: 'landscaping',
    description: 'Desain dan pembuatan taman depan rumah dengan konsep minimalis modern. Termasuk konsultasi desain, penyiapan lahan, penanaman, dan pemasangan sistem irigasi sederhana.',
    price_per_visit: 2500000,
    duration: 480,
    service_area: 'Jabodetabek',
    is_active: true,
    provider: { id: 10, name: 'Mas Green Garden', phone: '081234567890' },
    rating_avg: 4.8,
    reviews_count: 32,
  },
  {
    id: 2,
    name: 'Perawatan Taman Bulanan',
    category: 'maintenance',
    description: 'Paket perawatan taman rutin bulanan: pemotongan rumput, pemangkasan tanaman hias, pembersihan area taman, dan penyiraman.',
    price_per_visit: 350000,
    duration: 180,
    service_area: 'Jakarta Selatan & Depok',
    is_active: true,
    provider: { id: 11, name: 'Green Thumb Services', phone: '081298765432' },
    rating_avg: 4.5,
    reviews_count: 48,
  },
  {
    id: 3,
    name: 'Konsultasi Desain Taman',
    category: 'consultation',
    description: 'Sesi konsultasi 1 jam dengan arsitek landscape profesional. Mencakup analisis lahan, rekomendasi tanaman, dan rancangan desain awal.',
    price_per_visit: 500000,
    duration: 60,
    service_area: 'Online / Jabodetabek',
    is_active: true,
    provider: { id: 10, name: 'Mas Green Garden', phone: '081234567890' },
    rating_avg: 4.9,
    reviews_count: 67,
  },
  {
    id: 4,
    name: 'Pengendalian Hama Organik',
    category: 'pest-control',
    description: 'Layanan fumigasi dan pengendalian hama tanaman menggunakan metode organik yang aman untuk keluarga dan lingkungan.',
    price_per_visit: 450000,
    duration: 120,
    service_area: 'Jabodetabek',
    is_active: true,
    provider: { id: 12, name: 'Eco Garden Care', phone: '085678901234' },
    rating_avg: 4.6,
    reviews_count: 21,
  },
  {
    id: 5,
    name: 'Penanaman Vertical Garden',
    category: 'planting',
    description: 'Pemasangan vertical garden di dinding rumah atau apartemen. Termasuk rangka, media tanam, tanaman hias, dan panduan perawatan.',
    price_per_visit: 1800000,
    duration: 360,
    service_area: 'Jakarta & Tangerang',
    is_active: true,
    provider: { id: 11, name: 'Green Thumb Services', phone: '081298765432' },
    rating_avg: 4.7,
    reviews_count: 15,
  },
  {
    id: 6,
    name: 'Pemangkasan Pohon Besar',
    category: 'maintenance',
    description: 'Layanan pemangkasan pohon tinggi dengan peralatan profesional. Aman, bersih, dan sesuai standar keselamatan.',
    price_per_visit: 800000,
    duration: 240,
    service_area: 'Jabodetabek',
    is_active: true,
    provider: { id: 12, name: 'Eco Garden Care', phone: '085678901234' },
    rating_avg: 4.4,
    reviews_count: 9,
  },
  {
    id: 7,
    name: 'Pengantaran Tanaman Hias',
    category: 'delivery',
    description: 'Layanan pengantaran tanaman hias & media tanam dengan pengemasan aman. Gratis ongkir untuk pembelian di atas Rp500.000.',
    price_per_visit: 50000,
    duration: 60,
    service_area: 'Jabodetabek',
    is_active: true,
    provider: { id: 10, name: 'Mas Green Garden', phone: '081234567890' },
    rating_avg: 4.3,
    reviews_count: 120,
  },
  {
    id: 8,
    name: 'Instalasi Sistem Irigasi',
    category: 'landscaping',
    description: 'Pemasangan sistem irigasi otomatis untuk taman dan kebun. Hemat air, terjadwal, dan dapat dikontrol dari smartphone.',
    price_per_visit: 3200000,
    duration: 600,
    service_area: 'Jabodetabek',
    is_active: true,
    provider: { id: 11, name: 'Green Thumb Services', phone: '081298765432' },
    rating_avg: 4.8,
    reviews_count: 11,
  },
]

const mockBookings = [
  {
    id: 1,
    service_id: 1,
    service: { id: 1, name: 'Landscaping Taman Depan', category: 'landscaping' },
    schedule_at: '2026-08-25T09:00:00',
    address_snapshot: { label: 'Rumah', street: 'Jl. Melati No. 12, Ragunan', city: 'Jakarta Selatan', phone: '081211223344' },
    status: 'confirmed',
    total: 2500000,
    note: 'Tolong bawa contoh desain minimalis',
    created_at: '2026-08-18T10:00:00',
  },
  {
    id: 2,
    service_id: 2,
    service: { id: 2, name: 'Perawatan Taman Bulanan', category: 'maintenance' },
    schedule_at: '2026-08-28T08:00:00',
    address_snapshot: { label: 'Rumah', street: 'Jl. Anggrek No. 5, Depok', city: 'Depok', phone: '081211223344' },
    status: 'pending',
    total: 350000,
    note: null,
    created_at: '2026-08-20T14:30:00',
  },
  {
    id: 3,
    service_id: 3,
    service: { id: 3, name: 'Konsultasi Desain Taman', category: 'consultation' },
    schedule_at: '2026-08-15T14:00:00',
    address_snapshot: { label: 'Online', street: 'Zoom Meeting', city: 'Online', phone: '081211223344' },
    status: 'completed',
    total: 500000,
    note: 'Bawa referensi desain zen garden',
    created_at: '2026-08-12T09:00:00',
  },
]

// ===== Services API =====

const mapService = (s) => ({
  id: s.id,
  name: s.name,
  category: s.category,
  description: s.description,
  price: Number(s.price_per_visit) || 0,
  duration: Number(s.duration) || 0,
  serviceArea: s.service_area,
  isActive: s.is_active ?? true,
  provider: s.provider,
  ratingAvg: Number(s.rating_avg) || 0,
  reviewsCount: s.reviews_count ?? 0,
})

const mapBooking = (b) => ({
  id: b.id,
  serviceId: b.service_id,
  service: b.service,
  scheduleAt: b.schedule_at,
  address: b.address_snapshot,
  status: b.status,
  total: Number(b.total) || 0,
  note: b.note,
  createdAt: b.created_at,
})

export const servicesApi = {
  getServices: async (filters = {}) => {
    if (apiMode() === 'api') {
      const res = await api.get('/services', { params: filters })
      const items = (res.data?.data || res.data || []).map(mapService)
      return { success: true, message: 'Layanan dimuat', data: items }
    }
    await delay()
    let filtered = mockServices.filter((s) => s.is_active)
    if (filters.category) filtered = filtered.filter((s) => s.category === filters.category)
    return { success: true, message: 'Layanan dimuat', data: filtered.map(mapService) }
  },

  getService: async (id) => {
    if (apiMode() === 'api') {
      const res = await api.get(`/services/${id}`)
      return { success: true, message: 'Detail layanan dimuat', data: mapService(res.data?.data || res.data) }
    }
    await delay()
    const service = mockServices.find((s) => s.id === Number(id))
    if (!service) throw { response: { status: 404, data: { message: 'Layanan tidak ditemukan' } } }
    return { success: true, message: 'Detail layanan dimuat', data: mapService(service) }
  },

  bookService: async (payload) => {
    if (apiMode() === 'api') {
      const res = await api.post('/service-orders', payload)
      return { success: true, message: 'Pemesanan berhasil', data: mapBooking(res.data?.data || res.data) }
    }
    await delay(600)
    const service = mockServices.find((s) => s.id === payload.service_id)
    const booking = {
      id: Date.now(),
      service_id: payload.service_id,
      service: { id: service?.id, name: service?.name, category: service?.category },
      schedule_at: payload.schedule_at,
      address_snapshot: payload.address,
      status: 'pending',
      total: service?.price_per_visit || 0,
      note: payload.note || null,
      created_at: new Date().toISOString(),
    }
    mockBookings.unshift(booking)
    return { success: true, message: 'Pemesanan berhasil', data: mapBooking(booking) }
  },

  getMyBookings: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/service-orders')
      const items = (res.data?.data || res.data || []).map(mapBooking)
      return { success: true, message: 'Riwayat pemesanan dimuat', data: items }
    }
    await delay()
    return { success: true, message: 'Riwayat pemesanan dimuat', data: mockBookings.map(mapBooking) }
  },

  getBooking: async (id) => {
    if (apiMode() === 'api') {
      const res = await api.get(`/service-orders/${id}`)
      return { success: true, message: 'Detail pemesanan dimuat', data: mapBooking(res.data?.data || res.data) }
    }
    await delay()
    const booking = mockBookings.find((b) => b.id === Number(id))
    if (!booking) throw { response: { status: 404, data: { message: 'Pemesanan tidak ditemukan' } } }
    return { success: true, message: 'Detail pemesanan dimuat', data: mapBooking(booking) }
  },
}
