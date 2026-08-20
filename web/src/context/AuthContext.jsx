import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { apiMode, onModeChange } from '../services/api/client'
import { authApi } from '../services/api/auth'

const AuthContext = createContext(null)
const USER_KEY = 'tanamanku_user'

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  // Mode api: pulihkan sesi dari token Sanctum (GET /auth/me)
  useEffect(() => {
    const restore = async () => {
      if (apiMode() !== 'api') return
      const token = localStorage.getItem('tanamanku_token')
      if (!token) return
      try {
        const res = await authApi.me()
        if (res.data) {
          setUser(res.data)
          localStorage.setItem(USER_KEY, JSON.stringify(res.data))
        }
      } catch {
        setUser(null)
      }
    }
    restore()
    const unsubscribe = onModeChange(() => {
      if (apiMode() === 'api') restore()
    })
    return unsubscribe
  }, [])

  const login = useCallback(async (payload) => {
    const res = await authApi.login(payload)
    setUser(res.data.user)
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user))
    return res
  }, [])

  const register = useCallback(async (payload) => {
    const res = await authApi.register(payload)
    setUser(res.data.user)
    localStorage.setItem(USER_KEY, JSON.stringify(res.data.user))
    return res
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    localStorage.removeItem(USER_KEY)
  }, [])

  const isAuthenticated = Boolean(user)

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  return ctx
}
