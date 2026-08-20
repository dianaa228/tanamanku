import { api, apiMode, mockResponse, unwrap } from './client'
import { mapCategories, mapProduct, mapProducts, mapSpecies } from './normalizers'
import { categories, products, plantSpecies } from './mock-data'

/**
 * Adapter layanan produk (docs/07-web-react.json: products.js).
 * 'api'  → axios ke backend /api/v1
 * 'mock' → data mock lokal (demo tanpa backend)
 */

const mockImpl = {
  getCategories: () => mockResponse(categories, 'Kategori berhasil dimuat'),

  getProducts: ({ search = '', category = '', sort = 'relevansi', care = '' } = {}) => {
    let result = [...products]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q))
    }
    if (category) {
      const cat = categories.find((c) => c.slug === category)
      if (cat) result = result.filter((p) => p.categoryId === cat.id)
    }
    if (care) result = result.filter((p) => p.careLevel === care)
    switch (sort) {
      case 'harga-asc': result.sort((a, b) => a.price - b.price); break
      case 'harga-desc': result.sort((a, b) => b.price - a.price); break
      case 'terlaris': result.sort((a, b) => b.sold - a.sold); break
      case 'rating': result.sort((a, b) => b.rating - a.rating); break
      default: break
    }
    return mockResponse(result, 'Produk berhasil dimuat')
  },

  getProduct: (slug) => {
    const product = products.find((p) => p.slug === slug)
    if (!product) return Promise.reject({ response: { status: 404, data: { message: 'Produk tidak ditemukan' } } })
    const related = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4)
    return mockResponse({ ...product, related }, 'Detail produk berhasil dimuat')
  },

  getPlantSpecies: () => mockResponse(plantSpecies, 'Spesies tanaman berhasil dimuat'),
  getSpecies: (slug) => {
    const species = plantSpecies.find((s) => s.slug === slug)
    if (!species) return Promise.reject({ response: { status: 404, data: { message: 'Spesies tidak ditemukan' } } })
    return mockResponse(species, 'Detail spesies berhasil dimuat')
  },
}

export const productsApi = {
  getCategories: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/categories')
      return { success: true, message: res.message, data: mapCategories(unwrap(res)) }
    }
    return mockImpl.getCategories()
  },

  getProducts: async (filters = {}) => {
    if (apiMode() === 'api') {
      // Minta cukup banyak agar halaman web (paginasi lokal 12/halaman) tetap berfungsi
      const res = await api.get('/products', { params: { ...filters, per_page: 60 } })
      return { success: true, message: res.message, data: mapProducts(unwrap(res)) }
    }
    return mockImpl.getProducts(filters)
  },

  getProduct: async (slug) => {
    if (apiMode() === 'api') {
      const res = await api.get(`/products/${slug}`)
      const product = mapProductDetail(res.data)
      // Produk terkait dari kategori yang sama
      const rel = await api.get('/products', { params: { category: product.categorySlug, per_page: 8 } })
      product.related = mapProducts(unwrap(rel)).filter((p) => p.id !== product.id).slice(0, 4)
      return { success: true, message: res.message, data: product }
    }
    return mockImpl.getProduct(slug)
  },

  getPlantSpecies: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/plant-species')
      return { success: true, message: res.message, data: mapProductsToSpecies(unwrap(res)) }
    }
    return mockImpl.getPlantSpecies()
  },

  getSpecies: async (slug) => {
    if (apiMode() === 'api') {
      const res = await api.get(`/plant-species/${slug}`)
      return { success: true, message: res.message, data: mapSpecies(res.data) }
    }
    return mockImpl.getSpecies(slug)
  },
}

// Detail produk: butuh varian & kategori untuk halaman ProductDetail
const mapProductDetail = (raw) => ({
  ...mapProduct(raw),
  variants: (raw.variants || []).map((v) => v.name),
  related: [],
})

const mapProductsToSpecies = (list) => list.map((s) => mapSpecies(s)).filter(Boolean)
