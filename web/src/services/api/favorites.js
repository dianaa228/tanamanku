import { api, apiMode, delay } from './client'

// ===== Mock Data =====

const mockFavorites = [
  { id: 1, user_id: 1, product_id: 1 },
  { id: 2, user_id: 1, product_id: 3 },
  { id: 3, user_id: 1, product_id: 5 },
]

// ===== API =====

export const favoritesApi = {
  getFavorites: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/favorites')
      return { success: true, message: 'Favorit dimuat', data: res.data?.data || res.data || [] }
    }
    await delay()
    return { success: true, message: 'Favorit dimuat', data: mockFavorites }
  },

  toggleFavorite: async (productId) => {
    if (apiMode() === 'api') {
      const res = await api.post(`/favorites/${productId}`)
      return { success: true, message: 'Favorit diperbarui', data: res.data?.data || res.data }
    }
    await delay(300)
    const idx = mockFavorites.findIndex((f) => f.product_id === productId)
    if (idx > -1) {
      mockFavorites.splice(idx, 1)
      return { success: true, message: 'Dihapus dari favorit', data: { is_favorite: false } }
    } else {
      mockFavorites.push({ id: Date.now(), user_id: 1, product_id: productId })
      return { success: true, message: 'Ditambahkan ke favorit', data: { is_favorite: true } }
    }
  },

  isFavorite: async (productId) => {
    if (apiMode() === 'api') {
      const res = await api.get(`/favorites/check/${productId}`)
      return { success: true, message: 'Cek favorit', data: res.data?.data || res.data }
    }
    await delay(100)
    const isFav = mockFavorites.some((f) => f.product_id === productId)
    return { success: true, message: 'Cek favorit', data: { is_favorite: isFav } }
  },
}
