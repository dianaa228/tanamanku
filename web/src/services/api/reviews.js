import { api, apiMode, delay } from './client'

// ===== Mock Data =====

const mockReviews = [
  {
    id: 1,
    order_item_id: 1,
    user_id: 2,
    user: { id: 2, name: 'Budi Setiawan', avatar: null },
    rating: 5,
    comment: 'Monstera sangat sehat dan sesuai deskripsi. Pengemasan rapi!',
    images: [],
    created_at: '2026-08-20T10:00:00',
  },
  {
    id: 2,
    order_item_id: 2,
    user_id: 3,
    user: { id: 3, name: 'Sari Wulandari', avatar: null },
    rating: 4,
    comment: 'Aglonema bagus, tapi ada 1 daun yang sedikit layu. Overall oke.',
    images: [],
    created_at: '2026-08-19T14:30:00',
  },
  {
    id: 3,
    order_item_id: 3,
    user_id: 4,
    user: { id: 4, name: 'Dewi Lestari', avatar: null },
    rating: 5,
    comment: 'Pupuk NPK bagus, tanaman langsung subur setelah pemakaian.',
    images: [],
    created_at: '2026-08-18T10:00:00',
  },
]

// ===== Helpers =====

const mapReview = (r) => ({
  id: r.id,
  orderItemId: r.order_item_id,
  userId: r.user_id,
  user: r.user,
  rating: r.rating,
  comment: r.comment,
  images: r.images || [],
  createdAt: r.created_at,
})

// ===== API =====

export const reviewsApi = {
  getProductReviews: async (productId) => {
    if (apiMode() === 'api') {
      const res = await api.get(`/products/${productId}/reviews`)
      const items = (res.data?.data || res.data || []).map(mapReview)
      return { success: true, message: 'Ulasan dimuat', data: items }
    }
    await delay()
    const filtered = mockReviews.filter((r) => r.product_id === Number(productId))
    return { success: true, message: 'Ulasan dimuat', data: filtered.map(mapReview) }
  },

  getMyReviews: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/reviews/mine')
      const items = (res.data?.data || res.data || []).map(mapReview)
      return { success: true, message: 'Ulasan saya dimuat', data: items }
    }
    await delay()
    return { success: true, message: 'Ulasan saya dimuat', data: mockReviews.map(mapReview) }
  },

  createReview: async (orderItemId, { rating, comment, images }) => {
    if (apiMode() === 'api') {
      const res = await api.post(`/order-items/${orderItemId}/reviews`, { rating, comment, images })
      return { success: true, message: 'Ulasan berhasil dikirim', data: mapReview(res.data?.data || res.data) }
    }
    await delay(500)
    const review = {
      id: Date.now(),
      order_item_id: orderItemId,
      user_id: 1,
      user: { id: 1, name: 'Rina Kartika', avatar: null },
      rating,
      comment: comment || '',
      images: images || [],
      created_at: new Date().toISOString(),
    }
    mockReviews.unshift(review)
    return { success: true, message: 'Ulasan berhasil dikirim', data: mapReview(review) }
  },

  deleteReview: async (reviewId) => {
    if (apiMode() === 'api') {
      await api.delete(`/reviews/${reviewId}`)
      return { success: true, message: 'Ulasan dihapus' }
    }
    await delay(300)
    const idx = mockReviews.findIndex((r) => r.id === reviewId)
    if (idx > -1) mockReviews.splice(idx, 1)
    return { success: true, message: 'Ulasan dihapus' }
  },
}
