import { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react'
import { apiMode, onModeChange } from '../services/api/client'
import { cartApi } from '../services/api/cart'
import { cartSelectors } from '../store/cartStore'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [ready, setReady] = useState(false)
  const mounted = useRef(true)

  const refresh = useCallback(async () => {
    try {
      const res = await cartApi.fetchCart()
      if (mounted.current) setItems(res.data?.items || [])
    } catch {
      if (mounted.current) setItems([])
    } finally {
      if (mounted.current) setReady(true)
    }
  }, [])

  // Muat keranjang saat awal & sinkron ulang setiap mode berubah
  useEffect(() => {
    mounted.current = true
    refresh()
    const unsubscribe = onModeChange(() => refresh())
    return () => {
      mounted.current = false
      unsubscribe()
    }
  }, [refresh])

  const run = useCallback(async (fn) => {
    try {
      const res = await fn()
      setItems(res.data?.items || [])
    } catch (err) {
      // Error stok/validasi dari server — biarkan halaman menampilkan toast
      throw err
    }
  }, [])

  const addItem = useCallback((payload) => run(() => cartApi.addItem(payload)), [run])
  const updateQty = useCallback((lineId, qty) => run(() => cartApi.updateQty(lineId, qty)), [run])
  const removeItem = useCallback((lineId) => run(() => cartApi.removeItem(lineId)), [run])
  const clearCart = useCallback(() => run(() => cartApi.clear()), [run])

  const value = {
    items,
    ready,
    count: cartSelectors.count(items),
    subtotal: cartSelectors.subtotal(items),
    addItem,
    updateQty,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart harus dipakai di dalam <CartProvider>')
  return ctx
}
