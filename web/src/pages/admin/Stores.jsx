import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api/admin'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'

export default function AdminStores() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getStores().then((res) => {
      setStores(res.data)
      setLoading(false)
    })
  }, [])

  const verifyStore = async (id) => {
    await adminApi.verifyStore(id)
    setStores(stores.map((s) => s.id === id ? { ...s, status: 'active' } : s))
  }

  const statusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-leaf-100 text-leaf-700'
      case 'pending': return 'bg-amber-100 text-amber-800'
      case 'suspended': return 'bg-rose-100 text-rose-700'
      default: return 'bg-gray-100 text-gray-500'
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-leaf-100 bg-white shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-leaf-100 bg-leaf-50/50">
                <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Toko</th>
                <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Pemilik</th>
                <th className="px-4 py-3 text-right font-semibold text-leaf-900/70">Produk</th>
                <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.id} className="border-b border-leaf-50 hover:bg-leaf-50/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-lg">🏪</span>
                      <div>
                        <p className="font-semibold text-leaf-950">{s.name}</p>
                        <p className="text-xs text-leaf-900/40">ID #{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-leaf-900/60">{s.user?.name || '—'}</td>
                  <td className="px-4 py-3 text-right font-semibold">{s.products_count}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={statusBadge(s.status)}>
                      {{ active: '✅ Aktif', pending: '⏳ Menunggu', suspended: '🚫 Suspended' }[s.status] || s.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.status === 'pending' && (
                      <Button size="xs" onClick={() => verifyStore(s.id)}>
                        ✅ Verifikasi
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
