/**
 * Normalizer: peta respons backend Laravel (Resource) → bentuk data yang
 * dipakai komponen web. Backend tidak mengirim emoji/gradient, jadi visual
 * diturunkan dari nama/slug via aturan sederhana.
 */

const VISUAL_RULES = [
  { re: /monstera/i, emoji: '🌿', gradient: 'from-leaf-400 to-emerald-700' },
  { re: /sirih|pothos/i, emoji: '🍃', gradient: 'from-lime-300 to-green-600' },
  { re: /aglonema/i, emoji: '🪴', gradient: 'from-rose-300 to-red-500' },
  { re: /lidah mertua|sansevieria/i, emoji: '🌵', gradient: 'from-emerald-400 to-teal-600' },
  { re: /cabai|chili/i, emoji: '🌶️', gradient: 'from-red-500 to-rose-700' },
  { re: /tomat|tomato/i, emoji: '🍅', gradient: 'from-orange-400 to-red-600' },
  { re: /kemangi|basil/i, emoji: '🌿', gradient: 'from-lime-400 to-green-500' },
  { re: /aloe|lidah buaya/i, emoji: '🌵', gradient: 'from-green-400 to-emerald-600' },
  { re: /pakcoy|selada|bayam|sayur/i, emoji: '🥬', gradient: 'from-green-400 to-emerald-600' },
  { re: /cocopeat/i, emoji: '🥥', gradient: 'from-amber-200 to-soil-400' },
  { re: /humus|sekam|tanah/i, emoji: '🪨', gradient: 'from-soil-300 to-soil-600' },
  { re: /pupuk|npk|nutrisi|ab mix|kompos/i, emoji: '🧪', gradient: 'from-sky-300 to-blue-500' },
  { re: /sprayer|penyiram/i, emoji: '🚿', gradient: 'from-emerald-300 to-green-600' },
  { re: /terakota/i, emoji: '🏺', gradient: 'from-orange-300 to-soil-600' },
  { re: /rotan|gantung|boho/i, emoji: '🧺', gradient: 'from-amber-300 to-soil-500' },
  { re: /kaktus/i, emoji: '🌵', gradient: 'from-teal-300 to-emerald-600' },
]

export const visualFor = (p) => {
  const hay = `${p?.name || ''} ${p?.slug || ''}`
  for (const rule of VISUAL_RULES) {
    if (rule.re.test(hay)) return { emoji: rule.emoji, gradient: rule.gradient }
  }
  return { emoji: '🌿', gradient: 'from-leaf-300 to-leaf-600' }
}

const num = (v) => Number(v) || 0

export const mapProduct = (p) => {
  const v = visualFor(p)
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    categoryId: p.category?.id ?? p.category_id ?? null,
    categorySlug: p.category?.slug ?? null,
    storeName: p.store?.name || 'Tanamanku',
    price: num(p.price),
    originalPrice: null,
    rating: num(p.rating_avg),
    reviewCount: p.reviews?.length ?? 0,
    stock: p.stock ?? 0,
    sold: num(p.sold_count),
    careLevel: p.care_level || 'mudah',
    tags: [],
    emoji: v.emoji,
    gradient: v.gradient,
    description: p.description || '',
    benefits: [],
    variants: (p.variants || []).map((v) => v.name),
  }
}

export const mapProducts = (list) => (Array.isArray(list) ? list.map(mapProduct) : [])

const CATEGORY_GRADIENTS = [
  'from-leaf-300 to-emerald-500',
  'from-emerald-200 to-teal-500',
  'from-rose-200 to-red-400',
  'from-amber-200 to-yellow-500',
  'from-violet-200 to-purple-400',
  'from-sky-200 to-blue-400',
  'from-orange-200 to-amber-400',
]

export const mapCategory = (c, index = 0) => ({
  id: c.slug,
  slug: c.slug,
  name: c.name,
  icon: c.icon || '🪴',
  count: c.products_count ?? c.count ?? 0,
  gradient: CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length],
  tagline: '',
})

export const mapCategories = (list) => (Array.isArray(list) ? list.map((c, i) => mapCategory(c, i)) : [])

export const mapSpecies = (s) => {
  if (!s) return null
  const v = visualFor(s)
  const tips = []
  if (s.light_requirement) tips.push(`Cahaya: ${s.light_requirement}`)
  if (s.water_requirement) tips.push(`Siram: ${s.water_requirement}`)
  if (s.humidity) tips.push(`Kelembapan: ${s.humidity}`)
  if (tips.length < 2) tips.push('Amati tanaman secara rutin dan catat perkembangannya di My Garden.')
  return {
    id: s.id,
    slug: s.slug,
    name: s.name,
    scientificName: s.scientific_name || '',
    emoji: v.emoji,
    gradient: v.gradient,
    careLevel: s.care_level || 'mudah',
    light: s.light_requirement || '—',
    water: s.water_requirement || '—',
    humidity: s.humidity || '—',
    temperature: s.temperature || '—',
    growth: s.growth_duration || '—',
    description: s.description || '',
    tips,
  }
}

export const mapPlant = (p) => {
  const species = mapSpecies(p.species)
  const careLogs = (p.care_logs || []).map((l) => ({ type: l.type, date: l.done_at || l.created_at }))
  const reminders = (p.reminders || []).map((r) => ({
    id: r.id,
    type: r.type,
    frequency: r.frequency_days,
    nextDue: r.next_due_at,
    lastDoneAt: r.last_done_at,
    isActive: r.is_active !== false,
    userPlantId: p.id,
  }))
  const waterCare = careLogs.find((l) => l.type === 'siram')
  const waterReminder = reminders.find((r) => r.type === 'siram')

  return {
    id: p.id,
    speciesId: p.species?.id ?? p.plant_species_id,
    nickname: p.nickname || species?.name || 'Tanamanku',
    location: p.location || '-',
    pot: p.pot || '-',
    plantedAt: p.planted_at,
    status: p.status || 'sehat',
    height: num(p.height_cm),
    photoGradient: species?.gradient || 'from-leaf-400 to-emerald-700',
    species,
    growthLogs: (p.growth_logs || []).map((l) => ({ date: l.logged_at || l.created_at, height: num(l.height_cm) })),
    careLogs,
    reminders,
    lastWatered: waterCare?.date || p.planted_at || '',
    nextWater: waterReminder?.nextDue || '',
  }
}

export const mapPlants = (list) => (Array.isArray(list) ? list.map(mapPlant) : [])

export const mapOrderItem = (i) => {
  const v = visualFor(i.product || {})
  return {
    productId: i.product_id,
    slug: i.product?.slug,
    name: i.product?.name || `Produk #${i.product_id}`,
    emoji: v.emoji,
    gradient: v.gradient,
    qty: i.quantity,
    price: num(i.unit_price),
    variant: i.variant_id ? `Varian ${i.variant_id}` : '—',
  }
}

export const mapOrder = (o) => ({
  id: o.order_number || o.id,
  date: o.created_at,
  status: o.status,
  payment: {
    method: o.payment?.method || '—',
    reference: o.payment?.reference || 'Belum ada',
    status: o.payment_status,
  },
  shipment: {
    courier: o.shipment?.courier || 'Tanamanku Express',
    tracking: o.shipment?.tracking_number || 'Belum tersedia',
    eta: '—',
  },
  address: o.shipment?.address_snapshot || {},
  items: (o.items || []).map(mapOrderItem),
  subtotal: num(o.subtotal),
  shippingCost: num(o.shipping_cost),
  discount: num(o.discount),
  total: num(o.total),
})

export const mapOrders = (list) => (Array.isArray(list) ? list.map(mapOrder) : [])

const AVATARS = ['🧑‍🌾', '👩‍🌾', '👨‍🔧', '👩‍🎨', '👨‍💻']

export const mapPost = (p, index = 0) => ({
  id: p.id,
  author: p.user?.name || 'Pekebun',
  avatar: p.user?.avatar || AVATARS[index % AVATARS.length],
  time: p.created_at,
  content: p.content,
  emoji: visualFor({ name: p.content }).emoji,
  gradient: visualFor({ name: p.content }).gradient,
  likes: p.likes_count ?? 0,
  liked: false,
  comments: (p.comments || []).map((c) => ({
    author: c.user?.name || 'Pekebun',
    avatar: c.user?.avatar || '🧑‍🌾',
    time: c.created_at,
    content: c.content,
  })),
})

export const mapPosts = (list) => (Array.isArray(list) ? list.map(mapPost) : [])

export const mapUser = (u) => {
  const addresses = (u.addresses || []).map((a) => ({
    label: a.label,
    recipient: a.recipient,
    phone: a.phone,
    province: a.province,
    city: a.city,
    district: a.district,
    street: a.street,
    postalCode: a.postal_code,
    isDefault: a.is_default,
  }))
  const address = addresses.find((a) => a.isDefault) || addresses[0] || null
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    role: u.role || 'customer',
    avatar: u.avatar || '🧑‍🌾',
    memberSince: u.member_since,
    address,
    stats: { plants: 0, orders: 0, posts: 0 },
    token: u.token,
  }
}

/** Normalisasi hasil diagnosis backend → bentuk halaman diagnosis */
export const mapDiagnosis = (d) => ({
  emoji: d.severity === 'berat' ? '⚠️' : d.severity === 'sedang' ? '🩺' : '🌱',
  title: d.diagnosis,
  severity: d.severity,
  description: 'Berdasarkan gejala yang Anda pilih, diagnosis awal dari Plant Diagnosis Tanamanku:',
  advice: Array.isArray(d.advice) ? d.advice : [],
})
