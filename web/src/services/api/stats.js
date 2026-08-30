import { api, apiMode, delay } from './client'

// ===== Mock Data =====

const mockStats = {
  products: 27,
  nurseries: 6,
  gardens: 10000,
}

// ===== API =====

export const statsApi = {
  getStats: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/stats')
      return { success: true, message: 'Stats dimuat', data: res.data?.data || res.data }
    }
    await delay()
    return { success: true, message: 'Stats dimuat', data: mockStats }
  },
}
