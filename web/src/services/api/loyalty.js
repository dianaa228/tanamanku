import { api, apiMode, delay } from './client'

// ===== Mock Data =====

const mockProfile = {
  user_id: 1,
  points: 2450,
  total_earned: 5800,
  total_redeemed: 3350,
  tier: 'silver',
  joined_at: '2026-01-15T00:00:00',
}

const mockTiers = [
  { id: 'bronze', name: 'Bronze', icon: '🥉', minPoints: 0, benefits: ['1x poin per Rp1.000 belanja', 'Akses promo dasar'] },
  { id: 'silver', name: 'Silver', icon: '🥈', minPoints: 1000, benefits: ['1.5x poin per Rp1.000 belanja', 'Gratis ongkir 2x/bulan', 'Prioritas support'] },
  { id: 'gold', name: 'Gold', icon: '🥇', minPoints: 5000, benefits: ['2x poin per Rp1.000 belanja', 'Gratis ongkir unlimited', 'Early access produk baru', 'Bonus poin ulang tahun'] },
  { id: 'platinum', name: 'Platinum', icon: '💎', minPoints: 15000, benefits: ['3x poin per Rp1.000 belanja', 'Semua benefit Gold', 'Personal plant advisor', 'Exclusive merchandise'] },
]

const mockRewards = [
  {
    id: 1,
    name: 'Voucher Rp10.000',
    description: 'Voucher diskon untuk pembelian produk apa saja',
    points_cost: 500,
    type: 'voucher',
    icon: '🎫',
    stock: 100,
    max_per_user: 3,
    is_active: true,
  },
  {
    id: 2,
    name: 'Voucher Rp25.000',
    description: 'Voucher diskon besar untuk pembelian produk',
    points_cost: 1000,
    type: 'voucher',
    icon: '🎫',
    stock: 50,
    max_per_user: 2,
    is_active: true,
  },
  {
    id: 3,
    name: 'Gratis Ongkir',
    description: 'Voucher gratis ongkir untuk satu kali pengiriman',
    points_cost: 300,
    type: 'shipping',
    icon: '🚚',
    stock: 200,
    max_per_user: 5,
    is_active: true,
  },
  {
    id: 4,
    name: 'Bonus 100 Poin',
    description: 'Tambahan 100 poin langsung masuk ke akun',
    points_cost: 200,
    type: 'points',
    icon: '✨',
    stock: 500,
    max_per_user: 10,
    is_active: true,
  },
  {
    id: 5,
    name: 'Tanaman Gratis',
    description: 'Pilih satu tanaman hias dari katalog hadiah',
    points_cost: 3000,
    type: 'product',
    icon: '🌱',
    stock: 10,
    max_per_user: 1,
    is_active: true,
  },
  {
    id: 6,
    name: 'Premium Plant Care Guide',
    description: 'Akses panduan perawatan tanaman premium selama 1 bulan',
    points_cost: 1500,
    type: 'subscription',
    icon: '📖',
    stock: 999,
    max_per_user: 1,
    is_active: true,
  },
  {
    id: 7,
    name: 'Custom Pot Exclusive',
    description: 'Pot keramik handmade dengan nama custom',
    points_cost: 5000,
    type: 'product',
    icon: '🏺',
    stock: 5,
    max_per_user: 1,
    is_active: true,
  },
  {
    id: 8,
    name: 'Konsultasi Tanaman 30 Menit',
    description: 'Sesi konsultasi online dengan ahli tanaman',
    points_cost: 2000,
    type: 'service',
    icon: '👩‍🌾',
    stock: 20,
    max_per_user: 2,
    is_active: true,
  },
]

const mockHistory = [
  { id: 1, type: 'earn', points: 850, description: 'Pembelian Order #ORD-2026-001', reference: 'order', created_at: '2026-08-18T10:00:00' },
  { id: 2, type: 'earn', points: 50, description: 'Review produk Monstera Deliciosa', reference: 'review', created_at: '2026-08-17T14:00:00' },
  { id: 3, type: 'redeem', points: -500, description: 'Tukar: Voucher Rp10.000', reference: 'reward', created_at: '2026-08-16T09:00:00' },
  { id: 4, type: 'earn', points: 100, description: 'Log perawatan tanaman (7 hari berturut)', reference: 'garden', created_at: '2026-08-15T08:00:00' },
  { id: 5, type: 'earn', points: 350, description: 'Pembelian Order #ORD-2026-002', reference: 'order', created_at: '2026-08-14T16:00:00' },
  { id: 6, type: 'redeem', points: -300, description: 'Tukar: Gratis Ongkir', reference: 'reward', created_at: '2026-08-13T11:00:00' },
  { id: 7, type: 'earn', points: 25, description: 'Post di komunitas', reference: 'community', created_at: '2026-08-12T09:00:00' },
  { id: 8, type: 'earn', points: 1200, description: 'Pembelian Order #ORD-2026-003', reference: 'order', created_at: '2026-08-11T13:00:00' },
  { id: 9, type: 'bonus', points: 200, description: 'Bonus milestone: 50 transaksi', reference: 'system', created_at: '2026-08-10T00:00:00' },
  { id: 10, type: 'earn', points: 75, description: 'Review 3 produk', reference: 'review', created_at: '2026-08-09T15:00:00' },
  { id: 11, type: 'redeem', points: -1000, description: 'Tukar: Voucher Rp25.000', reference: 'reward', created_at: '2026-08-08T10:00:00' },
  { id: 12, type: 'earn', points: 500, description: 'Pembelian Order #ORD-2026-004', reference: 'order', created_at: '2026-08-07T14:00:00' },
]

// ===== Helpers =====

const mapProfile = (p) => ({
  userId: p.user_id,
  points: p.points,
  totalEarned: p.total_earned,
  totalRedeemed: p.total_redeemed,
  tier: p.tier,
  joinedAt: p.joined_at,
})

const mapReward = (r) => ({
  id: r.id,
  name: r.name,
  description: r.description,
  pointsCost: r.points_cost,
  type: r.type,
  icon: r.icon,
  stock: r.stock,
  maxPerUser: r.max_per_user,
  isActive: r.is_active,
})

const mapHistory = (h) => ({
  id: h.id,
  type: h.type,
  points: h.points,
  description: h.description,
  reference: h.reference,
  createdAt: h.created_at,
})

// ===== API =====

export const loyaltyApi = {
  getProfile: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/loyalty/profile')
      return { success: true, message: 'Profil loyalitas dimuat', data: mapProfile(res.data?.data || res.data) }
    }
    await delay()
    return { success: true, message: 'Profil loyalitas dimuat', data: mapProfile(mockProfile) }
  },

  getTiers: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/loyalty/tiers')
      return { success: true, message: 'Tier dimuat', data: (res.data?.data || res.data || []).map(mapReward) }
    }
    await delay()
    return { success: true, message: 'Tier dimuat', data: mockTiers }
  },

  getRewards: async (filters = {}) => {
    if (apiMode() === 'api') {
      const res = await api.get('/loyalty/rewards', { params: filters })
      return { success: true, message: 'Rewards dimuat', data: (res.data?.data || res.data || []).map(mapReward) }
    }
    await delay()
    let filtered = mockRewards.filter((r) => r.is_active)
    if (filters.type) filtered = filtered.filter((r) => r.type === filters.type)
    return { success: true, message: 'Rewards dimuat', data: filtered.map(mapReward) }
  },

  redeemReward: async (rewardId) => {
    if (apiMode() === 'api') {
      const res = await api.post(`/loyalty/rewards/${rewardId}/redeem`)
      return { success: true, message: 'Reward berhasil ditukar', data: res.data?.data || res.data }
    }
    await delay(500)
    const reward = mockRewards.find((r) => r.id === Number(rewardId))
    if (!reward) throw { response: { status: 404, data: { message: 'Reward tidak ditemukan' } } }
    if (mockProfile.points < reward.points_cost) {
      throw { response: { status: 400, data: { message: 'Poin tidak cukup' } } }
    }
    mockProfile.points -= reward.points_cost
    mockProfile.total_redeemed += reward.points_cost
    mockHistory.unshift({
      id: Date.now(),
      type: 'redeem',
      points: -reward.points_cost,
      description: `Tukar: ${reward.name}`,
      reference: 'reward',
      created_at: new Date().toISOString(),
    })
    return { success: true, message: 'Reward berhasil ditukar', data: { voucher_code: `TMR-${Date.now().toString(36).toUpperCase()}` } }
  },

  getHistory: async (filters = {}) => {
    if (apiMode() === 'api') {
      const res = await api.get('/loyalty/history', { params: filters })
      return { success: true, message: 'Riwayat dimuat', data: (res.data?.data || res.data || []).map(mapHistory) }
    }
    await delay()
    let filtered = [...mockHistory]
    if (filters.type) filtered = filtered.filter((h) => h.type === filters.type)
    return { success: true, message: 'Riwayat dimuat', data: filtered.map(mapHistory) }
  },
}
