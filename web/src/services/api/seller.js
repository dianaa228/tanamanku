import { api, apiMode, mockResponse, unwrap } from './client'
import { visualFor } from './normalizers'

// ===== Mock Data =====

const mockProducts = [
  { id: 1, slug: 'monstera-deliciosa', name: 'Monstera Deliciosa 60–80cm', price: 145000, stock: 12, care_level: 'mudah', is_active: true, category: { id: 1, name: 'Tanaman Hias', slug: 'tanaman-hias' }, store: { id: 1, name: 'Nursery Hijau Lestari' }, images: [], variants: [{ id: 1, name: 'Polos 60cm' }, { id: 2, name: 'Polos 80cm' }], reviews: [{ rating: 5 }], sold_count: 340 },
  { id: 2, slug: 'aglonema-lipstick', name: 'Aglonema Lipstick', price: 89000, stock: 8, care_level: 'sedang', is_active: true, category: { id: 1, name: 'Tanaman Hias', slug: 'tanaman-hias' }, store: { id: 1, name: 'Nursery Hijau Lestari' }, images: [], variants: [{ id: 3, name: 'Tinggi 25cm' }], reviews: [{ rating: 5 }], sold_count: 210 },
  { id: 3, slug: 'pupuk-npk-mutiara', name: 'Pupuk NPK Mutiara 16-16-16 1kg', price: 30000, stock: 65, care_level: 'mudah', is_active: true, category: { id: 5, name: 'Pupuk & Nutrisi', slug: 'pupuk-nutrisi' }, store: { id: 1, name: 'Nursery Hijau Lestari' }, images: [], variants: [{ id: 4, name: 'Kemasan 1kg' }], reviews: [{ rating: 4 }], sold_count: 2100 },
  { id: 4, slug: 'pot-terakota-20cm', name: 'Pot Terakota 20cm', price: 42000, stock: 55, care_level: 'mudah', is_active: true, category: { id: 7, name: 'Pot & Dekorasi', slug: 'pot-dekorasi' }, store: { id: 1, name: 'Nursery Hijau Lestari' }, images: [], variants: [{ id: 5, name: '20cm' }], reviews: [{ rating: 5 }], sold_count: 760 },
  { id: 5, slug: 'sirih-gading-golden', name: 'Sirih Gading Golden Pothos', price: 35000, stock: 3, care_level: 'mudah', is_active: true, category: { id: 1, name: 'Tanaman Hias', slug: 'tanaman-hias' }, store: { id: 1, name: 'Nursery Hijau Lestari' }, images: [], variants: [{ id: 6, name: 'Pot 15cm' }], reviews: [{ rating: 5 }], sold_count: 1200 },
]

const mockOrders = [
  { id: 'ORD-20260820-001', order_number: 'ORD-20260820-001', created_at: '2026-08-20T09:15:00', status: 'pending', payment_status: 'pending', user: { id: 2, name: 'Budi Setiawan' }, items: [{ id: 1, product_id: 1, quantity: 1, unit_price: 145000, product: { name: 'Monstera Deliciosa 60–80cm', slug: 'monstera-deliciosa' } }], subtotal: 145000, shipping_cost: 15000, discount: 0, total: 160000 },
  { id: 'ORD-20260819-002', order_number: 'ORD-20260819-002', created_at: '2026-08-19T14:30:00', status: 'processing', payment_status: 'paid', user: { id: 3, name: 'Sari Wulandari' }, items: [{ id: 2, product_id: 2, quantity: 2, unit_price: 89000, product: { name: 'Aglonema Lipstick', slug: 'aglonema-lipstick' } }], subtotal: 178000, shipping_cost: 15000, discount: 0, total: 193000 },
  { id: 'ORD-20260818-003', order_number: 'ORD-20260818-003', created_at: '2026-08-18T10:00:00', status: 'shipped', payment_status: 'paid', user: { id: 4, name: 'Dewi Lestari' }, items: [{ id: 3, product_id: 3, quantity: 3, unit_price: 30000, product: { name: 'Pupuk NPK Mutiara 1kg', slug: 'pupuk-npk-mutiara' } }], subtotal: 90000, shipping_cost: 15000, discount: 5000, total: 100000 },
  { id: 'ORD-20260817-004', order_number: 'ORD-20260817-004', created_at: '2026-08-17T08:20:00', status: 'completed', payment_status: 'paid', user: { id: 5, name: 'Andi Pratama' }, items: [{ id: 4, product_id: 4, quantity: 2, unit_price: 42000, product: { name: 'Pot Terakota 20cm', slug: 'pot-terakota-20cm' } }], subtotal: 84000, shipping_cost: 15000, discount: 0, total: 99000 },
]

// ===== Seller API =====

const mockImpl = {
  getDashboard: () => mockResponse({
    stats: { totalSales: 4250000, totalOrders: 28, newOrders: 3, lowStock: 1 },
    recentOrders: mockOrders.slice(0, 3),
    lowStockProducts: mockProducts.filter((p) => p.stock <= 5),
    salesChart: [
      { date: '2026-08-14', total: 320000 },
      { date: '2026-08-15', total: 580000 },
      { date: '2026-08-16', total: 450000 },
      { date: '2026-08-17', total: 920000 },
      { date: '2026-08-18', total: 650000 },
      { date: '2026-08-19', total: 380000 },
      { date: '2026-08-20', total: 950000 },
    ],
  }, 'Dashboard dimuat'),

  getProducts: () => mockResponse(mockProducts, 'Produk toko dimuat'),

  getOrders: () => mockResponse(mockOrders, 'Pesanan toko dimuat'),

  getOrder: (id) => {
    const order = mockOrders.find((o) => o.order_number === id)
    if (!order) return Promise.reject({ response: { status: 404, data: { message: 'Pesanan tidak ditemukan' } } })
    return mockResponse(order, 'Detail pesanan dimuat')
  },

  updateOrderStatus: async (id, status) => {
    const order = mockOrders.find((o) => o.order_number === id)
    if (order) order.status = status
    return { success: true, message: 'Status diperbarui', data: order }
  },

  getInventory: () => mockResponse(mockProducts.map((p) => ({
    ...p,
    inventory: { quantity: p.stock, reserved_quantity: 0 },
  })), 'Inventaris dimuat'),

  updateInventory: async (productId, quantity) => {
    const product = mockProducts.find((p) => p.id === productId)
    if (product) product.stock = quantity
    return { success: true, message: 'Stok diperbarui', data: product }
  },

  getSales: () => mockResponse({
    totalRevenue: 4250000,
    totalOrders: 28,
    avgOrderValue: 151785,
    topProducts: [
      { name: 'Pupuk NPK Mutiara 1kg', sold: 2100, revenue: 63000000 },
      { name: 'Sirih Gading Golden Pothos', sold: 1200, revenue: 42000000 },
      { name: 'Pot Terakota 20cm', sold: 760, revenue: 31920000 },
      { name: 'Monstera Deliciosa 60–80cm', sold: 340, revenue: 49300000 },
      { name: 'Aglonema Lipstick', sold: 210, revenue: 18690000 },
    ],
    dailySales: [
      { date: '2026-08-14', total: 320000 },
      { date: '2026-08-15', total: 580000 },
      { date: '2026-08-16', total: 450000 },
      { date: '2026-08-17', total: 920000 },
      { date: '2026-08-18', total: 650000 },
      { date: '2026-08-19', total: 380000 },
      { date: '2026-08-20', total: 950000 },
    ],
  }, 'Laporan penjualan dimuat'),
}

const mapServerProduct = (p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  price: Number(p.price) || 0,
  stock: p.stock ?? 0,
  careLevel: p.care_level || 'mudah',
  isActive: p.is_active ?? true,
  category: p.category,
  store: p.store,
  images: p.images || [],
  variants: p.variants || [],
  reviews: p.reviews || [],
  soldCount: p.sold_count ?? 0,
})

const mapServerOrder = (o) => ({
  id: o.order_number || o.id,
  orderNumber: o.order_number,
  createdAt: o.created_at,
  status: o.status,
  paymentStatus: o.payment_status,
  user: o.user,
  items: (o.items || []).map((i) => ({
    id: i.id,
    productId: i.product_id,
    quantity: i.quantity,
    unitPrice: Number(i.unit_price) || 0,
    product: i.product,
  })),
  subtotal: Number(o.subtotal) || 0,
  shippingCost: Number(o.shipping_cost) || 0,
  discount: Number(o.discount) || 0,
  total: Number(o.total) || 0,
})

export const sellerApi = {
  getDashboard: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/seller/dashboard')
      return { success: true, message: res.message, data: res.data }
    }
    return mockImpl.getDashboard()
  },

  getProducts: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/seller/products')
      return { success: true, message: res.message, data: unwrap(res).map(mapServerProduct) }
    }
    return mockImpl.getProducts()
  },

  createProduct: async (data) => {
    if (apiMode() === 'api') {
      const res = await api.post('/seller/products', data)
      return { success: true, message: res.message, data: mapServerProduct(res.data) }
    }
    return mockResponse({ id: Date.now(), ...data }, 'Produk berhasil dibuat')
  },

  updateProduct: async (id, data) => {
    if (apiMode() === 'api') {
      const res = await api.put(`/seller/products/${id}`, data)
      return { success: true, message: res.message, data: mapServerProduct(res.data) }
    }
    const product = mockProducts.find((p) => p.id === id)
    if (product) Object.assign(product, data)
    return { success: true, message: 'Produk diperbarui', data: product }
  },

  deleteProduct: async (id) => {
    if (apiMode() === 'api') {
      await api.delete(`/seller/products/${id}`)
      return { success: true, message: 'Produk dihapus' }
    }
    const idx = mockProducts.findIndex((p) => p.id === id)
    if (idx > -1) mockProducts.splice(idx, 1)
    return { success: true, message: 'Produk dihapus' }
  },

  getOrders: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/seller/orders')
      return { success: true, message: res.message, data: unwrap(res).map(mapServerOrder) }
    }
    return mockImpl.getOrders()
  },

  getOrder: async (id) => {
    if (apiMode() === 'api') {
      const res = await api.get(`/orders/${id}`)
      return { success: true, message: res.message, data: mapServerOrder(res.data) }
    }
    return mockImpl.getOrder(id)
  },

  updateOrderStatus: async (id, status) => {
    if (apiMode() === 'api') {
      const res = await api.put(`/seller/orders/${id}/status`, { status })
      return { success: true, message: res.message, data: mapServerOrder(res.data) }
    }
    return mockImpl.updateOrderStatus(id, status)
  },

  getInventory: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/seller/inventory')
      return { success: true, message: res.message, data: unwrap(res).map(mapServerProduct) }
    }
    return mockImpl.getInventory()
  },

  updateInventory: async (productId, quantity) => {
    if (apiMode() === 'api') {
      await api.put(`/seller/inventory/${productId}`, { quantity })
      return { success: true, message: 'Stok diperbarui' }
    }
    return mockImpl.updateInventory(productId, quantity)
  },

  getSales: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/seller/sales')
      return { success: true, message: res.message, data: res.data }
    }
    return mockImpl.getSales()
  },
}
