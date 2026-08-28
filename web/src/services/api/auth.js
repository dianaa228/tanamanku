import { api, apiMode } from './client'
import { mapUser } from './normalizers'
import { demoUser } from './mock-data'

/**
 * Adapter autentikasi (docs/07-web-react.json: auth.js).
 * 'api'  → Sanctum: POST /auth/register, /auth/login, GET /auth/me, POST /auth/logout.
 * 'mock' → demo lokal (token & profil di localStorage).
 */

const TOKEN_KEY = 'tanamanku_token'
const USER_KEY = 'tanamanku_user'

const persistSession = (user, token) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

const mockImpl = {
  login: async ({ email, password }) => {
    if (!email || !password) {
      throw { response: { status: 422, data: { message: 'Email dan password wajib diisi', errors: { email: ['Email wajib diisi'] } } } }
    }
    // Determine role based on email
    let role = 'customer'
    let name = email.split('@')[0]
    let avatar = '🧑‍🌾'
    
    if (email.includes('admin')) {
      role = 'admin'
      name = 'Admin Tanamanku'
      avatar = '🛡️'
    } else if (email.includes('seller')) {
      role = 'seller'
      name = 'Seller Tanamanku'
      avatar = '🏪'
    }
    
    const user = {
      id: Date.now(),
      name,
      email,
      phone: '0812-3456-7890',
      role,
      avatar,
      memberSince: '2025-11-03',
      address: demoUser.address,
      stats: { plants: 4, orders: 12, posts: 8 },
    }
    const token = 'mock-token-' + Date.now()
    persistSession(user, token)
    return { success: true, message: 'Login berhasil', data: { user, token } }
  },

  register: async ({ name, email, password, passwordConfirmation }) => {
    if (!name || !email || !password || !passwordConfirmation) {
      throw { response: { status: 422, data: { message: 'Semua field wajib diisi' } } }
    }
    if (password !== passwordConfirmation) {
      throw { response: { status: 422, data: { message: 'Konfirmasi password tidak cocok', errors: { passwordConfirmation: ['Konfirmasi password tidak cocok'] } } } }
    }
    const user = { ...demoUser, id: Date.now(), name, email }
    const token = 'mock-token-' + Date.now()
    persistSession(user, token)
    return { success: true, message: 'Pendaftaran berhasil', data: { user, token } }
  },

  forgotPassword: async ({ email }) => {
    if (!email) throw { response: { status: 422, data: { message: 'Email wajib diisi' } } }
    return { success: true, message: 'Link reset password telah dikirim ke email Anda', data: { email } }
  },

  me: async () => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return { success: true, message: 'Profil dimuat', data: raw ? JSON.parse(raw) : null }
    } catch {
      return { success: true, message: 'Profil dimuat', data: null }
    }
  },

  logout: async () => {
    clearSession()
    return { success: true, message: 'Logout berhasil', data: null }
  },
}

export const authApi = {
  login: async (payload) => {
    if (apiMode() === 'api') {
      const res = await api.post('/auth/login', payload)
      persistSession(res.data.user, res.data.token)
      return { success: true, message: res.message, data: { user: mapUser(res.data.user), token: res.data.token } }
    }
    return mockImpl.login(payload)
  },

  register: async (payload) => {
    if (apiMode() === 'api') {
      const res = await api.post('/auth/register', {
        name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        password: payload.password,
        password_confirmation: payload.passwordConfirmation,
      })
      persistSession(res.data.user, res.data.token)
      return { success: true, message: res.message, data: { user: mapUser(res.data.user), token: res.data.token } }
    }
    return mockImpl.register(payload)
  },

  forgotPassword: async (payload) => {
    if (apiMode() === 'api') {
      const res = await api.post('/auth/forgot-password', payload)
      return { success: true, message: res.message, data: res.data }
    }
    return mockImpl.forgotPassword(payload)
  },

  /** Pulihkan sesi dari token (dipanggil AuthContext saat mode api) */
  me: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/auth/me')
      return { success: true, message: res.message, data: mapUser(res.data) }
    }
    return mockImpl.me()
  },

  logout: async () => {
    if (apiMode() === 'api') {
      try {
        await api.post('/auth/logout')
      } catch {
        // token mungkin sudah kedaluwarsa — tetap bersihkan lokal
      }
      clearSession()
      return { success: true, message: 'Logout berhasil', data: null }
    }
    return mockImpl.logout()
  },
}
