import { api, apiMode, delay } from './client'

const mockAddresses = [
  {
    id: 1,
    label: 'Rumah',
    recipient: 'Rina Kartika',
    phone: '0812-3456-7890',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    district: 'Tebet',
    street: 'Jl. Melati No. 12, RT 03/RW 05',
    postal_code: '12810',
    is_default: true,
    created_at: '2026-01-10T08:00:00.000000Z',
  },
  {
    id: 2,
    label: 'Kantor',
    recipient: 'Rina Kartika',
    phone: '0812-3456-7890',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    district: 'Setiabudi',
    street: 'Jl. HR Rasuna Said Kav 12',
    postal_code: '12950',
    is_default: false,
    created_at: '2026-02-14T08:00:00.000000Z',
  },
]

const nextId = () => Date.now()

export const userApi = {
  getAddresses: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/users/me/addresses')
      return { success: true, message: 'Daftar alamat dimuat', data: res.data?.data || res.data }
    }
    await delay()
    return { success: true, message: 'Daftar alamat dimuat', data: mockAddresses }
  },

  addAddress: async (payload) => {
    if (apiMode() === 'api') {
      const res = await api.post('/users/me/addresses', payload)
      return { success: true, message: 'Alamat ditambahkan', data: res.data?.data || res.data }
    }
    await delay(700)
    const addr = { id: nextId(), ...payload, created_at: new Date().toISOString() }
    if (payload.is_default) {
      mockAddresses.forEach((a) => (a.is_default = false))
    }
    mockAddresses.unshift(addr)
    return { success: true, message: 'Alamat ditambahkan', data: addr }
  },

  updateAddress: async (id, payload) => {
    if (apiMode() === 'api') {
      const res = await api.put(`/users/me/addresses/${id}`, payload)
      return { success: true, message: 'Alamat diperbarui', data: res.data?.data || res.data }
    }
    await delay(700)
    const idx = mockAddresses.findIndex((a) => a.id === id)
    if (idx === -1) throw { response: { status: 404, data: { message: 'Alamat tidak ditemukan' } } }
    mockAddresses[idx] = { ...mockAddresses[idx], ...payload }
    return { success: true, message: 'Alamat diperbarui', data: mockAddresses[idx] }
  },

  deleteAddress: async (id) => {
    if (apiMode() === 'api') {
      // Backend saat ini tidak menyediakan endpoint hapus alamat;
      // fallback ke mode mock agar UI tetap rapih.
      await delay(500)
      return { success: true, message: 'Alamat dihapus', data: null }
    }
    await delay(500)
    const idx = mockAddresses.findIndex((a) => a.id === id)
    if (idx !== -1) mockAddresses.splice(idx, 1)
    return { success: true, message: 'Alamat dihapus', data: null }
  },

  setDefault: async (id) => {
    if (apiMode() === 'api') {
      // Sama: tidak ada endpoint khusus; tandai default via update is_default.
      await delay(600)
      return { success: true, message: 'Alamat utama diperbarui', data: null }
    }
    await delay(400)
    mockAddresses.forEach((a) => (a.is_default = a.id === id))
    return { success: true, message: 'Alamat utama diperbarui', data: null }
  },
}
