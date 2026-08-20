import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productsApi } from '../../services/api/products'
import ProductGrid from '../../components/product/ProductGrid'
import ProductFilter from '../../components/product/ProductFilter'
import ProductSearch from '../../components/product/ProductSearch'
import Loading from '../../components/ui/Loading'
import Pagination from '../../components/ui/Pagination'

const PER_PAGE = 12

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const filters = {
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    care: searchParams.get('care') || '',
    sort: searchParams.get('sort') || 'relevansi',
  }

  useEffect(() => {
    productsApi.getCategories().then((res) => setCategories(res.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => {
      productsApi.getProducts(filters).then((res) => {
        setProducts(res.data)
        setPage(1)
        setLoading(false)
      })
    }, 250)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const update = (next) => {
    const params = new URLSearchParams()
    if (next.search) params.set('q', next.search)
    if (next.category) params.set('category', next.category)
    if (next.care) params.set('care', next.care)
    if (next.sort && next.sort !== 'relevansi') params.set('sort', next.sort)
    setSearchParams(params, { replace: true })
  }

  const paginated = useMemo(() => {
    const start = (page - 1) * PER_PAGE
    return products.slice(start, start + PER_PAGE)
  }, [products, page])

  const totalPages = Math.max(1, Math.ceil(products.length / PER_PAGE))
  const activeCategory = categories.find((c) => c.slug === filters.category)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="text-3xl font-extrabold text-leaf-950">
          {activeCategory ? (
            <>
              {activeCategory.icon} {activeCategory.name}
            </>
          ) : (
            'Jelajahi Katalog 🌿'
          )}
        </h1>
        <p className="mt-1 text-sm text-leaf-900/50">
          {loading ? 'Mencari produk...' : `${products.length} produk ditemukan`}
          {filters.search && ` untuk "${filters.search}"`}
        </p>
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-8">
        {/* Filter sidebar */}
        <div className="mb-6 lg:mb-0">
          <div className="sticky top-20 rounded-3xl border border-leaf-100 bg-white p-5 shadow-soft">
            <h2 className="mb-4 text-base font-bold text-leaf-950">🔎 Filter</h2>
            <ProductFilter categories={categories} active={filters} onChange={update} />
          </div>
        </div>

        {/* Hasil */}
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <ProductSearch value={filters.search} onChange={(v) => update({ ...filters, search: v })} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-leaf-900/50">Urutkan</span>
              <select
                value={filters.sort}
                onChange={(e) => update({ ...filters, sort: e.target.value })}
                className="rounded-xl border border-leaf-200 bg-white px-3 py-2.5 text-sm font-medium text-leaf-900 shadow-sm focus:border-leaf-400 focus:outline-none"
              >
                {[
                  { value: 'relevansi', label: 'Paling relevan' },
                  { value: 'terlaris', label: 'Terlaris' },
                  { value: 'harga-asc', label: 'Harga terendah' },
                  { value: 'harga-desc', label: 'Harga tertinggi' },
                  { value: 'rating', label: 'Rating tertinggi' },
                ].map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <Loading label="Menyiapkan produk terbaik..." />
          ) : (
            <>
              <ProductGrid products={paginated} emptyProps={{ onReset: () => update({ search: '', category: '', care: '', sort: 'relevansi' }) }} />
              <div className="mt-10">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
