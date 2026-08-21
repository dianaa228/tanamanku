// Konstanta bersama Tanamanku web

export const ORDER_STATUS = {
  pending: { label: 'Menunggu Pembayaran', icon: '⏳', badge: 'bg-amber-100 text-amber-800' },
  paid: { label: 'Pembayaran Diterima', icon: '💳', badge: 'bg-sky-100 text-sky-800' },
  processing: { label: 'Sedang Diproses', icon: '📦', badge: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Dalam Pengiriman', icon: '🚚', badge: 'bg-indigo-100 text-indigo-800' },
  delivered: { label: 'Telah Diterima', icon: '✅', badge: 'bg-leaf-100 text-leaf-800' },
  completed: { label: 'Selesai', icon: '🎉', badge: 'bg-leaf-100 text-leaf-800' },
  cancelled: { label: 'Dibatalkan', icon: '✖️', badge: 'bg-rose-100 text-rose-800' },
}

export const ORDER_FLOW = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'completed']

export const CARE_TYPES = {
  siram: { label: 'Penyiraman', icon: '💧', chip: 'bg-sky-100 text-sky-700' },
  pupuk: { label: 'Pemupukan', icon: '🌱', chip: 'bg-leaf-100 text-leaf-700' },
  repot: { label: 'Repotting', icon: '🪴', chip: 'bg-soil-100 text-soil-700' },
  'cek-hama': { label: 'Cek Hama', icon: '🐛', chip: 'bg-rose-100 text-rose-700' },
  pangkas: { label: 'Pemangkasan', icon: '✂️', chip: 'bg-violet-100 text-violet-700' },
}

export const PLANT_STATUS = {
  sehat: { label: 'Sehat & Bahagia', icon: '😊', chip: 'bg-leaf-100 text-leaf-700' },
  'perlu-air': { label: 'Perlu Disiram', icon: '💧', chip: 'bg-sky-100 text-sky-700' },
  perhatian: { label: 'Perlu Perhatian', icon: '⚠️', chip: 'bg-amber-100 text-amber-800' },
}

export const CARE_LEVEL = {
  mudah: { label: 'Mudah', icon: '🌱', chip: 'bg-leaf-100 text-leaf-700' },
  sedang: { label: 'Sedang', icon: '🌿', chip: 'bg-sun-100 text-sun-600' },
  sulit: { label: 'Sulit', icon: '🪴', chip: 'bg-soil-100 text-soil-700' },
}

export const SORT_OPTIONS = [
  { value: 'relevansi', label: 'Paling Relevan' },
  { value: 'harga-asc', label: 'Harga Terendah' },
  { value: 'harga-desc', label: 'Harga Tertinggi' },
  { value: 'terlaris', label: 'Terlaris' },
  { value: 'rating', label: 'Rating Tertinggi' },
]

export const SHIPPING_OPTIONS = [
  { value: 'reguler', label: 'Reguler', eta: '2–4 hari', price: 15000 },
  { value: 'express', label: 'Express', eta: '1–2 hari', price: 35000 },
  { value: 'same-day', label: 'Same Day (Jabodetabek)', eta: 'Hari ini', price: 60000 },
]

export const PAYMENT_METHODS = [
  { value: 'transfer', label: 'Transfer Bank', icon: '🏦', desc: 'BCA, BRI, Mandiri via Virtual Account' },
  { value: 'ewallet', label: 'E-Wallet', icon: '📱', desc: 'GoPay, OVO, DANA, ShopeePay' },
  { value: 'qris', label: 'QRIS', icon: '🔳', desc: 'Scan QR sekali pakai' },
  { value: 'cod', label: 'COD', icon: '💵', desc: 'Bayar saat pesanan tiba' },
]

// ===== Gardening Services =====

export const SERVICE_CATEGORIES = [
  { value: 'landscaping', label: 'Landscaping', icon: '🌳', desc: 'Desain & pembuatan taman' },
  { value: 'maintenance', label: 'Perawatan Taman', icon: '🔧', desc: 'Pemotongan rumput, pemangkasan, siram' },
  { value: 'planting', label: 'Penanaman', icon: '🌱', desc: 'Penanaman bibit & tanaman hias' },
  { value: 'pest-control', label: 'Pengendalian Hama', icon: '🐛', desc: 'Fumigasi & pestisida organik' },
  { value: 'consultation', label: 'Konsultasi', icon: '📋', desc: 'Konsultasi desain taman & tanaman' },
  { value: 'delivery', label: 'Pengantaran', icon: '🚚', desc: 'Pengantaran tanaman & media tanam' },
]

export const BOOKING_STATUS = {
  pending: { label: 'Menunggu', icon: '⏳', badge: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Dikonfirmasi', icon: '✅', badge: 'bg-sky-100 text-sky-800' },
  'in-progress': { label: 'Sedang Dikerjakan', icon: '🔨', badge: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Selesai', icon: '🎉', badge: 'bg-leaf-100 text-leaf-800' },
  cancelled: { label: 'Dibatalkan', icon: '✖️', badge: 'bg-rose-100 text-rose-800' },
}

// ===== Plant Exchange =====

export const LISTING_TYPES = [
  { value: 'sell', label: 'Dijual', icon: '💰', desc: 'Jual tanaman' },
  { value: 'exchange', label: 'Tukar Tukar', icon: '🔄', desc: 'Tukar tanaman' },
]

export const LISTING_STATUS = {
  active: { label: 'Aktif', icon: '🟢', badge: 'bg-leaf-100 text-leaf-800' },
  completed: { label: 'Selesai', icon: '✅', badge: 'bg-sky-100 text-sky-800' },
  closed: { label: 'Ditutup', icon: '🔒', badge: 'bg-gray-100 text-gray-500' },
}

export const EXCHANGE_STATUS = {
  pending: { label: 'Menunggu', icon: '⏳', badge: 'bg-amber-100 text-amber-800' },
  accepted: { label: 'Diterima', icon: '✅', badge: 'bg-leaf-100 text-leaf-800' },
  rejected: { label: 'Ditolak', icon: '✖️', badge: 'bg-rose-100 text-rose-800' },
  done: { label: 'Selesai', icon: '🎉', badge: 'bg-sky-100 text-sky-800' },
}
