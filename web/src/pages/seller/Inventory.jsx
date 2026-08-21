import { useEffect, useState } from 'react'
import { sellerApi } from '../../services/api/seller'
import { visualFor } from '../../services/api/normalizers'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'

export default function SellerInventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    sellerApi.getInventory().then((res) => {
      setProducts(res.data)
      setLoading(false)
    })
  }, [])

  const saveStock = async (id) => {
    const qty = parseInt(editValue, 10)
    if (isNaN(qty) || qty < 0) return
    await sellerApi.updateInventory(id, qty)
    setProducts(products.map((p) => p.id === id ? { ...p, stock: qty } : p))
    setEditingId(null)
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-leaf-100 bg-white shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-leaf-100 bg-leaf-50/50">
                <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Produk</th>
                <th className="px-4 py-3 text-right font-semibold text-leaf-900/70">Stok</th>
                <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const v = visualFor(p)
                const isEditing = editingId === p.id
                return (
                  <tr key={p.id} className="border-b border-leaf-50 hover:bg-leaf-50/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-100 text-lg">{v.emoji}</span>
                        <div>
                          <p className="font-semibold text-leaf-950">{p.name}</p>
                          <p className="text-xs text-leaf-900/40">Harga: Rp{p.price?.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 rounded-lg border border-leaf-400 px-2 py-1 text-sm text-right focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveStock(p.id)
                            if (e.key === 'Escape') setEditingId(null)
                          }}
                        />
                      ) : (
                        <span className={`font-bold ${p.stock <= 5 ? 'text-rose-600' : p.stock <= 20 ? 'text-amber-600' : 'text-leaf-900/60'}`}>
                          {p.stock}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.stock === 0 ? (
                        <span className="text-xs font-bold text-rose-600">Habis</span>
                      ) : p.stock <= 5 ? (
                        <span className="text-xs font-bold text-amber-600">Menipis ⚠️</span>
                      ) : p.stock <= 20 ? (
                        <span className="text-xs font-semibold text-amber-500">Sedikit</span>
                      ) : (
                        <span className="text-xs font-semibold text-leaf-600">Aman ✅</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <Button size="xs" onClick={() => saveStock(p.id)}>💾</Button>
                          <Button size="xs" variant="ghost" onClick={() => setEditingId(null)}>✖</Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingId(p.id); setEditValue(String(p.stock)) }}
                          className="text-xs font-semibold text-leaf-700 hover:text-leaf-800 px-3 py-1 rounded-lg hover:bg-leaf-50"
                        >
                          ✏️ Edit Stok
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
