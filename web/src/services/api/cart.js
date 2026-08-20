import { api, apiMode, mockResponse } from './client'
import { visualFor } from './normalizers'
import { loadLocalCart, saveLocalCart, cartSelectors } from '../../store/cartStore'

/**
 * Adapter keranjang (docs/07-web-react.json: cart.js).
 *
 * 'api'  → keranjang server-side: GET /cart, POST /cart/items, PUT/DELETE
 *          /cart/items/{cartItem}. Backend memegang harga & stok
 *          (docs/16: server adalah source of truth).
 * 'mock' → keranjang lokal (localStorage) agar demo tetap jalan.
 */

const local = {
  fetchCart() {
    const items = loadLocalCart()
    return mockResponse(
      { items, count: cartSelectors.count(items), subtotal: cartSelectors.subtotal(items) },
      'Keranjang dimuat',
      200,
    )
  },

  addItem(payload) {
    let items = loadLocalCart()
    const existing = items.find((i) => i.lineId === payload.lineId)
    if (existing) {
      items = items.map((i) =>
        i.lineId === payload.lineId ? { ...i, qty: Math.min(i.qty + payload.qty, i.stock) } : i,
      )
    } else {
      items = [...items, payload]
    }
    saveLocalCart(items)
    return mockResponse({ items, count: cartSelectors.count(items), subtotal: cartSelectors.subtotal(items) }, 'Item ditambahkan', 250)
  },

  updateQty(lineId, qty) {
    const items = loadLocalCart().map((i) =>
      i.lineId === lineId ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i,
    )
    saveLocalCart(items)
    return mockResponse({ items, count: cartSelectors.count(items), subtotal: cartSelectors.subtotal(items) }, 'Jumlah diperbarui', 200)
  },

  removeItem(lineId) {
    const items = loadLocalCart().filter((i) => i.lineId !== lineId)
    saveLocalCart(items)
    return mockResponse({ items, count: cartSelectors.count(items), subtotal: cartSelectors.subtotal(items) }, 'Item dihapus', 200)
  },

  clear() {
    saveLocalCart([])
    return mockResponse({ items: [], count: 0, subtotal: 0 }, 'Keranjang dikosongkan', 200)
  },
}

// Peta item keranjang backend (CartItem) → bentuk line item web.
// serverId dipakai untuk PUT/DELETE /cart/items/{cartItem}.
const mapServerItem = (i) => {
  const v = visualFor(i.product)
  return {
    serverId: i.id,
    lineId: `${i.product_id}-${i.variant_id ?? 'default'}`,
    productId: i.product_id,
    slug: i.product?.slug,
    name: i.product?.name || `Produk #${i.product_id}`,
    emoji: v.emoji,
    gradient: v.gradient,
    variant: i.variant_id ? `Varian ${i.variant_id}` : '—',
    price: Number(i.unit_price) || 0,
    stock: i.product?.stock ?? 99,
    qty: i.quantity,
  }
}

const summarize = (items) => ({
  items,
  count: items.reduce((n, i) => n + i.qty, 0),
  subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
})

const fetchServerCart = async () => {
  const res = await api.get('/cart')
  const items = (res.data?.items || []).map(mapServerItem)
  return summarize(items)
}

export const cartApi = {
  /** Muat keranjang saat ini */
  fetchCart: async () => {
    if (apiMode() === 'api') {
      return { success: true, message: 'Keranjang dimuat', data: await fetchServerCart() }
    }
    return local.fetchCart()
  },

  /** Tambah item — backend mengecek stok & mengambil harga dari database */
  addItem: async (payload) => {
    if (apiMode() === 'api') {
      await api.post('/cart/items', {
        product_id: payload.productId,
        quantity: payload.qty,
        // variant_id dikirim saat dukungan varian penuh
      })
      return { success: true, message: 'Item ditambahkan ke keranjang', data: await fetchServerCart() }
    }
    return local.addItem(payload)
  },

  updateQty: async (lineId, qty) => {
    if (apiMode() === 'api') {
      const items = await fetchServerCart()
      const target = items.find((i) => i.lineId === lineId)
      if (target) {
        await api.put(`/cart/items/${target.serverId}`, { quantity: qty })
      }
      return { success: true, message: 'Jumlah diperbarui', data: await fetchServerCart() }
    }
    return local.updateQty(lineId, qty)
  },

  removeItem: async (lineId) => {
    if (apiMode() === 'api') {
      const items = await fetchServerCart()
      const target = items.find((i) => i.lineId === lineId)
      if (target) {
        await api.delete(`/cart/items/${target.serverId}`)
      }
      return { success: true, message: 'Item dihapus', data: await fetchServerCart() }
    }
    return local.removeItem(lineId)
  },

  clear: async () => {
    if (apiMode() === 'api') {
      await api.delete('/cart')
      return { success: true, message: 'Keranjang dikosongkan', data: summarize([]) }
    }
    return local.clear()
  },
}
