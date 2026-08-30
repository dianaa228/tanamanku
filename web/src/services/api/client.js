import axios from 'axios'

/**
 * API client Tanamanku.
 *
 * Mode otomatis:
 *  - 'api'  → backend Laravel terdeteksi (ping GET /health) — semua service
 *             memakai axios ke VITE_API_BASE_URL (default http://localhost:8000/api/v1).
 *  - 'mock' → backend tidak tersedia — service memakai data mock lokal
 *             sehingga demo tetap berjalan.
 *
 * Saat backend nyala (cd backend && php artisan serve), web otomatis beralih
 * ke API tanpa perlu ubah kode.
 */
export const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { Accept: 'application/json' },
})

// Sisipkan token Bearer dari localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tanamanku_token') // konsisten dengan TOKEN_KEY di auth.js
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Tangani error API secara terpusat + unwrap wrapper { success, message, data }
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('tanamanku_token')
      localStorage.removeItem('tanamanku_user')
    }
    return Promise.reject(err)
  },
)

// ===== Deteksi mode =====
let backendAvailable = null // null = belum dicek
const modeListeners = new Set()

export const isBackendAvailable = () => backendAvailable === true
export const apiMode = () => (backendAvailable === true ? 'api' : 'mock')

/** Berlangganan perubahan mode — mengembalikan fungsi unsubscribe. */
export const onModeChange = (cb) => {
  modeListeners.add(cb)
  return () => modeListeners.delete(cb)
}

const notifyModeChange = () => modeListeners.forEach((cb) => cb())

/**
 * Ping /health dengan timeout pendek. Connection-refused akan gagal cepat,
 * jadi deteksi berlangsung dalam puluhan milidetik saat backend mati.
 */
export const checkBackend = async () => {
  try {
    const res = await api.get('/health', { timeout: 2000 })
    backendAvailable = res.success === true
  } catch {
    backendAvailable = false
  }
  notifyModeChange()
  return backendAvailable
}

// Mulai deteksi sejak modul dimuat
if (typeof window !== 'undefined') checkBackend()

// ===== Helper =====
/** Simulasi latensi jaringan untuk mode mock */
export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

/** Helper: bentuk response mock yang konsisten dengan response API backend */
export const mockResponse = (data, message = 'Success', delayMs = 400) =>
  delay(delayMs).then(() => ({ success: true, message, data }))

/** Helper: bentuk error mock yang konsisten dengan error axios/backend */
export const mockError = (message, errors = {}, status = 422) =>
  Promise.reject({ response: { status, data: { message, errors } } })

/** Unwrap wrapper Laravel: terima { success, message, data } lalu ambil isi data */
export const unwrap = (res, fallback = []) => {
  if (!res) return fallback
  const d = res.data
  // Paginator Laravel: data.data = [items], data.meta = {...}
  if (d && Array.isArray(d.data)) return d.data
  if (Array.isArray(d)) return d
  return fallback
}
