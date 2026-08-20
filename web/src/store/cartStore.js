// Helper keranjang Tanamanku — bentuk line item + persistensi lokal (mock).
// Catatan: saat backend tersedia (mode 'api'), keranjang disimpan server-side;
// harga & stok final selalu divalidasi backend (docs/16).

export const STORAGE_KEY = 'tanamanku_cart'

export const cartSelectors = {
  count: (items) => items.reduce((n, i) => n + i.qty, 0),
  subtotal: (items) => items.reduce((n, i) => n + i.qty * i.price, 0),
}

export const loadLocalCart = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const saveLocalCart = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // abaikan — mis. storage penuh
  }
}
