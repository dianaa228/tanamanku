import { api, apiMode, mockResponse, unwrap } from './client'
import { mapOrder, mapOrders } from './normalizers'
import { orders } from './mock-data'

/**
 * Adapter pesanan (docs/07-web-react.json: orders.js).
 * Checkout backend menghitung subtotal/total SERVER-SIDE dari keranjang
 * server — klien hanya mengirim metode bayar & alamat (docs/16).
 */

const mockImpl = {
  getOrders: () => mockResponse(orders, 'Pesanan berhasil dimuat'),

  getOrder: (id) => {
    const order = orders.find((o) => o.id === id)
    if (!order) return Promise.reject({ response: { status: 404, data: { message: 'Pesanan tidak ditemukan' } } })
    return mockResponse(order, 'Detail pesanan berhasil dimuat')
  },

  createOrder: async (payload) => {
    await new Promise((r) => setTimeout(r, 900))
    const newOrder = {
      id: 'ORD-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + String(Math.floor(Math.random() * 900) + 100),
      date: new Date().toISOString(),
      status: 'pending',
      payment: { method: payload.paymentMethod === 'transfer' ? 'Transfer Bank (VA)' : payload.paymentMethod === 'ewallet' ? 'E-Wallet' : payload.paymentMethod === 'qris' ? 'QRIS' : 'COD', reference: 'Belum ada', status: 'pending' },
      shipment: { courier: 'Tanamanku Express', tracking: 'Belum tersedia', eta: '2–4 hari' },
      address: payload.address,
      items: payload.items,
      subtotal: payload.subtotal,
      shippingCost: payload.shippingCost,
      discount: payload.discount || 0,
      total: payload.subtotal + payload.shippingCost - (payload.discount || 0),
    }
    orders.unshift(newOrder)
    return { success: true, message: 'Pesanan berhasil dibuat', data: newOrder }
  },

  cancelOrder: async (id) => {
    await new Promise((r) => setTimeout(r, 400))
    const order = orders.find((o) => o.id === id)
    if (order) order.status = 'cancelled'
    return { success: true, message: 'Pesanan dibatalkan', data: { id } }
  },
}

export const ordersApi = {
  getOrders: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/orders', { params: { per_page: 30 } })
      return { success: true, message: res.message, data: mapOrders(unwrap(res)) }
    }
    return mockImpl.getOrders()
  },

  getOrder: async (id) => {
    if (apiMode() === 'api') {
      const res = await api.get(`/orders/${id}`)
      return { success: true, message: res.message, data: mapOrder(res.data) }
    }
    return mockImpl.getOrder(id)
  },

  createOrder: async (payload) => {
    if (apiMode() === 'api') {
      // Backend membaca keranjang server + menghitung total sendiri.
      const res = await api.post('/orders', {
        payment_method: payload.paymentMethod,
        courier: payload.shippingMethod || 'reguler',
        address: payload.address,
        note: payload.note || null,
      })
      return { success: true, message: res.message, data: mapOrder(res.data) }
    }
    return mockImpl.createOrder(payload)
  },

  cancelOrder: async (id) => {
    if (apiMode() === 'api') {
      const res = await api.post(`/orders/${id}/cancel`)
      return { success: true, message: res.message, data: mapOrder(res.data) }
    }
    return mockImpl.cancelOrder(id)
  },
}
