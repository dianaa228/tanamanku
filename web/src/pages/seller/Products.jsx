import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { sellerApi } from '../../services/api/seller'
import { formatRupiah } from '../../utils/format'
import { visualFor } from '../../services/api/normalizers'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'

export default function SellerProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    sellerApi.getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = async (id, name) => {
    if (!confirm(`Hapus produk "${name}"?`)) return
    await sellerApi.deleteProduct(id)
    setProducts(products.filter((p) => p.id !== id))
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari produk..."
          className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-leaf-400 focus:outline-none w-64"
        />
        <Button to="/seller/products/create">+ Tambah Produk</Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="📦" title="Belum ada produk" description="Mulai tambahkan produk pertamamu" actionLabel="Tambah Produk" actionTo="/seller/products/create" />
      ) : (
        <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-soft backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-card)]">
                  <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Produk</th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Kategori</th>
                  <th className="px-4 py-3 text-right font-semibold text-[var(--text-secondary)]">Harga</th>
                  <th className="px-4 py-3 text-right font-semibold text-[var(--text-secondary)]">Stok</th>
                  <th className="px-4 py-3 text-center font-semibold text-[var(--text-secondary)]">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-[var(--text-secondary)]">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const v = visualFor(p)
                  return (
                    <tr key={p.id} className="border-b border-[var(--border-secondary)] hover:bg-[var(--bg-card-hover)]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-100 text-lg">{v.emoji}</span>
                          <div>
                            <p className="font-semibold text-[var(--text-primary)]">{p.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">SKU #{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{p.category?.name || '—'}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatRupiah(p.price)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={p.stock <= 5 ? 'text-rose-600 font-bold' : 'text-leaf-900/60'}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={p.is_active ? 'bg-leaf-100 text-leaf-700' : 'bg-gray-100 text-gray-500'}>
                          {p.is_active ? '✅ Aktif' : '⏸️ Nonaktif'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link to={`/seller/products/${p.id}/edit`} className="text-xs font-semibold text-leaf-700 hover:text-leaf-800 px-2 py-1 rounded-lg hover:bg-leaf-50">
                            ✏️ Edit
                          </Link>
                          <button onClick={() => handleDelete(p.id, p.name)} className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50">
                            🗑️ Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
