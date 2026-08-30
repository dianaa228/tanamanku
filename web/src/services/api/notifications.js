import { api, apiMode, delay } from './client'

// ===== Mock Data =====

const mockNotifications = [
  {
    id: 'n1',
    type: 'order_status',
    notifiable_type: 'user',
    notifiable_id: 1,
    data: { title: 'Pesanan Dikirim', message: 'Pesanan #ORD-20260820-001 sudah dikirim', order_id: 'ORD-20260820-001' },
    read_at: null,
    created_at: '2026-08-25T10:00:00',
  },
  {
    id: 'n2',
    type: 'plant_reminder',
    notifiable_type: 'user',
    notifiable_id: 1,
    data: { title: 'Waktunya Siram!', message: 'Monstera Deliciosa perlu disiram hari ini', plant_id: 1 },
    read_at: '2026-08-24T08:00:00',
    created_at: '2026-08-24T07:00:00',
  },
  {
    id: 'n3',
    type: 'loyalty_points',
    notifiable_type: 'user',
    notifiable_id: 1,
    data: { title: 'Poin Bertambah', message: 'Anda mendapat 850 poin dari Order #ORD-20260820-001', points: 850 },
    read_at: null,
    created_at: '2026-08-20T10:00:00',
  },
  {
    id: 'n4',
    type: 'community',
    notifiable_type: 'user',
    notifiable_id: 1,
    data: { title: 'Komentar Baru', message: 'Sari Wulandari mengomentari postingan Anda', post_id: 5 },
    read_at: null,
    created_at: '2026-08-19T14:30:00',
  },
]

// ===== Helpers =====

const mapNotification = (n) => ({
  id: n.id,
  type: n.type,
  title: n.data?.title || n.type,
  message: n.data?.message || '',
  data: n.data,
  isRead: !!n.read_at,
  readAt: n.read_at,
  createdAt: n.created_at,
})

// ===== API =====

export const notificationsApi = {
  getNotifications: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/notifications')
      const items = (res.data?.data || res.data || []).map(mapNotification)
      return { success: true, message: 'Notifikasi dimuat', data: items }
    }
    await delay()
    return { success: true, message: 'Notifikasi dimuat', data: mockNotifications.map(mapNotification) }
  },

  markAsRead: async (notificationId) => {
    if (apiMode() === 'api') {
      await api.post(`/notifications/${notificationId}/read`)
      return { success: true, message: 'Notifikasi ditandai sudah dibaca' }
    }
    await delay(200)
    const n = mockNotifications.find((n) => n.id === notificationId)
    if (n) n.read_at = new Date().toISOString()
    return { success: true, message: 'Notifikasi ditandai sudah dibaca' }
  },

  markAllAsRead: async () => {
    if (apiMode() === 'api') {
      await api.post('/notifications/read-all')
      return { success: true, message: 'Semua notifikasi ditandai sudah dibaca' }
    }
    await delay(300)
    mockNotifications.forEach((n) => { n.read_at = new Date().toISOString() })
    return { success: true, message: 'Semua notifikasi ditandai sudah dibaca' }
  },

  getUnreadCount: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/notifications/unread-count')
      return { success: true, message: 'Jumlah notifikasi belum dibaca', data: res.data?.data || res.data }
    }
    await delay(100)
    const count = mockNotifications.filter((n) => !n.read_at).length
    return { success: true, message: 'Jumlah notifikasi belum dibaca', data: { count } }
  },
}
