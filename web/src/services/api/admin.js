import { api, apiMode, mockResponse, unwrap } from './client'

// ===== Mock Data =====

const mockUsers = [
  { id: 1, name: 'Rina Kartika', email: 'rina@tanamanku.id', role: 'customer', is_active: true, created_at: '2025-11-03T00:00:00' },
  { id: 2, name: 'Budi Setiawan', email: 'budi@garden.id', role: 'seller', is_active: true, created_at: '2025-12-10T00:00:00' },
  { id: 3, name: 'Sari Wulandari', email: 'sari@nursery.id', role: 'seller', is_active: true, created_at: '2026-01-15T00:00:00' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi@email.com', role: 'customer', is_active: true, created_at: '2026-02-20T00:00:00' },
  { id: 5, name: 'Andi Pratama', email: 'andi@farm.id', role: 'customer', is_active: false, created_at: '2026-03-01T00:00:00' },
  { id: 6, name: 'Admin Utama', email: 'admin@tanamanku.id', role: 'admin', is_active: true, created_at: '2025-10-01T00:00:00' },
]

const mockStores = [
  { id: 1, name: 'Nursery Hijau Lestari', slug: 'nursery-hijau-lestari', status: 'active', user: { id: 2, name: 'Budi Setiawan' }, products_count: 15, created_at: '2025-12-15T00:00:00' },
  { id: 2, name: 'KebunKita', slug: 'kebunkita', status: 'active', user: { id: 3, name: 'Sari Wulandari' }, products_count: 12, created_at: '2026-01-20T00:00:00' },
  { id: 3, name: 'Urban Farm Serpong', slug: 'urban-farm-serpong', status: 'pending', user: { id: 4, name: 'Dewi Lestari' }, products_count: 8, created_at: '2026-04-10T00:00:00' },
]

const mockCategories = [
  { id: 1, name: 'Tanaman Hias', slug: 'tanaman-hias', icon: '🪴', products_count: 24, sort_order: 0 },
  { id: 2, name: 'Sayuran & Herbal', slug: 'sayuran-herbal', icon: '🥬', products_count: 18, sort_order: 1 },
  { id: 3, name: 'Buah', slug: 'buah', icon: '🍅', products_count: 9, sort_order: 2 },
  { id: 4, name: 'Media Tanam', slug: 'media-tanam', icon: '🪨', products_count: 15, sort_order: 3 },
  { id: 5, name: 'Pupuk & Nutrisi', slug: 'pupuk-nutrisi', icon: '🧪', products_count: 12, sort_order: 4 },
  { id: 6, name: 'Peralatan Berkebun', slug: 'peralatan', icon: '🛠️', products_count: 20, sort_order: 5 },
  { id: 7, name: 'Pot & Dekorasi', slug: 'pot-dekorasi', icon: '🏺', products_count: 16, sort_order: 6 },
]

const mockOrders = [
  { id: 'ORD-20260820-001', order_number: 'ORD-20260820-001', created_at: '2026-08-20T09:15:00', status: 'pending', payment_status: 'pending', user: { name: 'Budi Setiawan' }, store: { name: 'Nursery Hijau Lestari' }, total: 160000 },
  { id: 'ORD-20260819-002', order_number: 'ORD-20260819-002', created_at: '2026-08-19T14:30:00', status: 'shipped', payment_status: 'paid', user: { name: 'Sari Wulandari' }, store: { name: 'KebunKita' }, total: 193000 },
  { id: 'ORD-20260818-003', order_number: 'ORD-20260818-003', created_at: '2026-08-18T10:00:00', status: 'completed', payment_status: 'paid', user: { name: 'Dewi Lestari' }, store: { name: 'Nursery Hijau Lestari' }, total: 100000 },
]

const mockReports = [
  { id: 1, reporter: { name: 'Rina Kartika' }, reason: 'Konten tidak pantas', status: 'open', created_at: '2026-08-18T12:00:00', reportable: { content: 'Post sampel', user: { name: 'Unknown' } } },
  { id: 2, reporter: { name: 'Budi Setiawan' }, reason: 'Spam', status: 'resolved', created_at: '2026-08-15T08:00:00', reportable: { content: 'Post spam', user: { name: 'Bot' } } },
]

// ===== Admin API =====

const mockImpl = {
  getDashboard: () => mockResponse({
    stats: {
      totalUsers: 156,
      totalStores: 12,
      totalProducts: 847,
      totalOrders: 342,
      gmv: 48750000,
      newUsersThisMonth: 23,
    },
    recentOrders: mockOrders,
    userGrowth: [
      { date: '2026-08-14', count: 5 },
      { date: '2026-08-15', count: 8 },
      { date: '2026-08-16', count: 3 },
      { date: '2026-08-17', count: 12 },
      { date: '2026-08-18', count: 7 },
      { date: '2026-08-19', count: 4 },
      { date: '2026-08-20', count: 9 },
    ],
  }, 'Dashboard admin dimuat'),

  getUsers: () => mockResponse(mockUsers, 'Pengguna dimuat'),
  getStores: () => mockResponse(mockStores, 'Toko dimuat'),
  getCategories: () => mockResponse(mockCategories, 'Kategori dimuat'),
  getOrders: () => mockResponse(mockOrders, 'Pesanan dimuat'),
  getReports: () => mockResponse(mockReports, 'Laporan dimuat'),
}

export const adminApi = {
  getDashboard: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/admin/dashboard')
      return { success: true, message: res.message, data: res.data }
    }
    return mockImpl.getDashboard()
  },

  getUsers: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/admin/users')
      return { success: true, message: res.message, data: unwrap(res) }
    }
    return mockImpl.getUsers()
  },

  updateUserRole: async (userId, role) => {
    if (apiMode() === 'api') {
      const res = await api.put(`/admin/users/${userId}/role`, { role })
      return { success: true, message: res.message, data: res.data }
    }
    const user = mockUsers.find((u) => u.id === userId)
    if (user) user.role = role
    return { success: true, message: 'Peran diperbarui', data: user }
  },

  toggleUserActive: async (userId) => {
    if (apiMode() === 'api') {
      const res = await api.post(`/admin/users/${userId}/toggle`)
      return { success: true, message: res.message, data: res.data }
    }
    const user = mockUsers.find((u) => u.id === userId)
    if (user) user.is_active = !user.is_active
    return { success: true, message: 'Status diperbarui', data: user }
  },

  getStores: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/admin/stores')
      return { success: true, message: res.message, data: unwrap(res) }
    }
    return mockImpl.getStores()
  },

  verifyStore: async (storeId) => {
    if (apiMode() === 'api') {
      const res = await api.post(`/admin/stores/${storeId}/verify`)
      return { success: true, message: res.message, data: res.data }
    }
    const store = mockStores.find((s) => s.id === storeId)
    if (store) store.status = 'active'
    return { success: true, message: 'Toko diverifikasi', data: store }
  },

  getCategories: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/categories')
      return { success: true, message: res.message, data: unwrap(res) }
    }
    return mockImpl.getCategories()
  },

  createCategory: async (data) => {
    if (apiMode() === 'api') {
      const res = await api.post('/admin/categories', data)
      return { success: true, message: res.message, data: res.data }
    }
    return mockResponse({ id: Date.now(), ...data, products_count: 0 }, 'Kategori dibuat')
  },

  updateCategory: async (id, data) => {
    if (apiMode() === 'api') {
      const res = await api.put(`/admin/categories/${id}`, data)
      return { success: true, message: res.message, data: res.data }
    }
    const cat = mockCategories.find((c) => c.id === id)
    if (cat) Object.assign(cat, data)
    return { success: true, message: 'Kategori diperbarui', data: cat }
  },

  deleteCategory: async (id) => {
    if (apiMode() === 'api') {
      await api.delete(`/admin/categories/${id}`)
      return { success: true, message: 'Kategori dihapus' }
    }
    return { success: true, message: 'Kategori dihapus' }
  },

  getOrders: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/admin/reports')
      return { success: true, message: res.message, data: unwrap(res) }
    }
    return mockImpl.getOrders()
  },

  getReports: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/admin/community/reports')
      return { success: true, message: res.message, data: unwrap(res) }
    }
    return mockImpl.getReports()
  },

  resolveReport: async (reportId) => {
    if (apiMode() === 'api') {
      const res = await api.post(`/admin/community/reports/${reportId}/resolve`)
      return { success: true, message: res.message, data: res.data }
    }
    const report = mockReports.find((r) => r.id === reportId)
    if (report) report.status = 'resolved'
    return { success: true, message: 'Laporan diselesaikan', data: report }
  },
}
