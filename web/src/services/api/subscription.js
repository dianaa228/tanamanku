import { api, apiMode, mockResponse, delay } from './client'

// ===== Mock Data =====

const mockPlans = [
  {
    id: 'free',
    name: 'Tanamanku Free',
    badge: '🆓',
    price: 0,
    period: 'forever',
    description: 'Fitur dasar untuk memulai berkebun',
    features: [
      { text: 'My Garden (maks 5 tanaman)', included: true },
      { text: 'Plant Care Reminder (3 tanaman)', included: true },
      { text: 'Akses marketplace', included: true },
      { text: 'Community posting', included: true },
      { text: 'Plant Finder (dasar)', included: true },
      { text: 'Plant Diagnosis (3/bulan)', included: true },
      { text: 'Plant Care Reminder unlimited', included: false },
      { text: 'Diagnosis tanaman unlimited', included: false },
      { text: 'Konsultasi ahli tanaman', included: false },
      { text: 'Konten premium & panduan', included: false },
      { text: 'Badge "Plant Pro" profil', included: false },
      { text: 'Prioritas customer support', included: false },
    ],
    popular: false,
    cta: 'Paket Saat Ini',
  },
  {
    id: 'plant-care-pro',
    name: 'Plant Care Pro',
    badge: '🌱',
    price: 29000,
    period: 'month',
    description: 'Untuk penghobi tanaman yang serius',
    features: [
      { text: 'My Garden unlimited tanaman', included: true },
      { text: 'Plant Care Reminder unlimited', included: true },
      { text: 'Akses marketplace', included: true },
      { text: 'Community posting', included: true },
      { text: 'Plant Finder (lengkap)', included: true },
      { text: 'Plant Diagnosis unlimited', included: true },
      { text: 'Konsultasi ahli (2x/bulan)', included: true },
      { text: 'Konten premium & panduan', included: true },
      { text: 'Badge "Plant Pro" profil', included: true },
      { text: 'Prioritas customer support', included: true },
      { text: 'Riwayat tanaman lengkap', included: true },
      { text: 'Export data tanaman', included: false },
    ],
    popular: true,
    cta: 'Mulai Berlangganan',
  },
  {
    id: 'seller-pro',
    name: 'Seller Pro',
    badge: '🏪',
    price: 99000,
    period: 'month',
    description: 'Untuk seller yang ingin berkembang pesat',
    features: [
      { text: 'Semua fitur Plant Care Pro', included: true },
      { text: 'Analytics dashboard lanjutan', included: true },
      { text: 'Listing unggulan (boost)', included: true },
      { text: 'Komisi lebih rendah (3%)', included: true },
      { text: 'Badge "Verified Seller"', included: true },
      { text: 'Promosi produk di homepage', included: true },
      { text: 'Laporan penjualan export', included: true },
      { text: 'Prioritas di hasil pencarian', included: true },
      { text: 'Customer support dedicated', included: true },
      { text: 'Akses API (beta)', included: false },
    ],
    popular: false,
    cta: 'Mulai Berlangganan',
  },
]

const mockUserSubscription = {
  plan_id: 'free',
  status: 'active',
  started_at: '2026-01-15T00:00:00',
  expires_at: null,
  auto_renew: false,
  payment_method: null,
}

const mockBillingHistory = [
  { id: 1, date: '2026-08-01', description: 'Plant Care Pro - Bulanan', amount: 29000, status: 'paid', invoice_url: '#' },
  { id: 2, date: '2026-07-01', description: 'Plant Care Pro - Bulanan', amount: 29000, status: 'paid', invoice_url: '#' },
  { id: 3, date: '2026-06-01', description: 'Seller Pro - Bulanan', amount: 99000, status: 'paid', invoice_url: '#' },
]

// ===== API =====

export const subscriptionApi = {
  getPlans: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/subscription/plans')
      return { success: true, message: 'Paket dimuat', data: res.data?.data || res.data }
    }
    await delay()
    return { success: true, message: 'Paket dimuat', data: mockPlans }
  },

  getMySubscription: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/subscription/current')
      return { success: true, message: 'Langganan dimuat', data: res.data?.data || res.data }
    }
    await delay()
    return { success: true, message: 'Langganan dimuat', data: mockUserSubscription }
  },

  subscribe: async (planId, paymentMethod) => {
    if (apiMode() === 'api') {
      const res = await api.post('/subscription/subscribe', { plan_id: planId, payment_method: paymentMethod })
      return { success: true, message: 'Berlangganan berhasil', data: res.data?.data || res.data }
    }
    await delay(800)
    const plan = mockPlans.find((p) => p.id === planId)
    if (!plan) throw { response: { status: 404, data: { message: 'Paket tidak ditemukan' } } }
    mockUserSubscription.plan_id = planId
    mockUserSubscription.status = 'active'
    mockUserSubscription.started_at = new Date().toISOString()
    mockUserSubscription.expires_at = new Date(Date.now() + 30 * 86400000).toISOString()
    mockUserSubscription.auto_renew = true
    mockUserSubscription.payment_method = paymentMethod
    mockBillingHistory.unshift({
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      description: `${plan.name} - Bulanan`,
      amount: plan.price,
      status: 'paid',
      invoice_url: '#',
    })
    return { success: true, message: 'Berlangganan berhasil', data: mockUserSubscription }
  },

  cancelSubscription: async () => {
    if (apiMode() === 'api') {
      const res = await api.post('/subscription/cancel')
      return { success: true, message: 'Langganan dibatalkan', data: res.data?.data || res.data }
    }
    await delay(500)
    mockUserSubscription.auto_renew = false
    mockUserSubscription.status = 'cancelled'
    return { success: true, message: 'Langganan dibatalkan', data: mockUserSubscription }
  },

  getBillingHistory: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/subscription/billing')
      return { success: true, message: 'Riwayat billing dimuat', data: res.data?.data || res.data }
    }
    await delay()
    return { success: true, message: 'Riwayat billing dimuat', data: mockBillingHistory }
  },
}
