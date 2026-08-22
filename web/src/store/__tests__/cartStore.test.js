import { describe, it, expect } from 'vitest'
import { cartSelectors, loadLocalCart, saveLocalCart, STORAGE_KEY } from '../cartStore'

describe('cartSelectors', () => {
  const items = [
    { lineId: '1', qty: 2, price: 50000 },
    { lineId: '2', qty: 1, price: 30000 },
    { lineId: '3', qty: 3, price: 10000 },
  ]

  it('count sums all quantities', () => {
    expect(cartSelectors.count(items)).toBe(6) // 2 + 1 + 3
  })

  it('count returns 0 for empty cart', () => {
    expect(cartSelectors.count([])).toBe(0)
  })

  it('subtotal calculates total price', () => {
    // 2*50000 + 1*30000 + 3*10000 = 100000 + 30000 + 30000 = 160000
    expect(cartSelectors.subtotal(items)).toBe(160000)
  })

  it('subtotal returns 0 for empty cart', () => {
    expect(cartSelectors.subtotal([])).toBe(0)
  })

  it('subtotal with single item', () => {
    expect(cartSelectors.subtotal([{ qty: 5, price: 20000 }])).toBe(100000)
  })
})

describe('loadLocalCart', () => {
  it('returns empty array when nothing stored', () => {
    localStorage.removeItem(STORAGE_KEY)
    expect(loadLocalCart()).toEqual([])
  })

  it('returns parsed cart from localStorage', () => {
    const cart = [{ lineId: '1', qty: 2, price: 50000 }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    expect(loadLocalCart()).toEqual(cart)
  })

  it('returns empty array on corrupted data', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json')
    expect(loadLocalCart()).toEqual([])
  })
})

describe('saveLocalCart', () => {
  it('saves cart to localStorage', () => {
    const cart = [{ lineId: '1', qty: 3, price: 25000 }]
    saveLocalCart(cart)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(cart)
  })

  it('overwrites existing cart', () => {
    saveLocalCart([{ lineId: '1', qty: 1, price: 100 }])
    saveLocalCart([{ lineId: '2', qty: 2, price: 200 }])
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0].lineId).toBe('2')
  })
})
