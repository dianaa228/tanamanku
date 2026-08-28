import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api/admin'
import Badge from '../../components/ui/Badge'
import Loading from '../../components/ui/Loading'

export default function AdminStores() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('semua')
  const [view, setView] = useState('card')

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

  const filtered = stores.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !(s.user?.name || '').toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'active') return s.status === 'active'
    if (filter === 'pending') return s.status === 'pending'
    if (filter === 'suspended') return s.status === 'suspended'
    return true
  })

  // Stats
  const totalStores = stores.length
  const activeStores = stores.filter(s => s.status === 'active').length
  const pendingStores = stores.filter(s => s.status === 'pending').length
  const totalProducts = stores.reduce((sum, s) => sum + (s.products_count || 0), 0)

  const statusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700'
      case 'pending': return 'bg-amber-100 text-amber-800'
      case 'suspended': return 'bg-rose-100 text-rose-700'
      default: return 'bg-gray-100 text-gray-500'
    }
  }

  const statusIcon = (status) => {
    switch (status) {
      case 'active': return '✅'
      case 'pending': return '⏳'
      case 'suspended': return '🚫'
      default: return '❓'
    }
  }

  const storeGradient = (index) => {
    const gradients = [
      'from-leaf-400 to-emerald-600',
      'from-amber-400 to-orange-600',
      'from-sky-400 to-blue-600',
      'from-violet-400 to-purple-600',
      'from-rose-400 to-pink-600',
      'from-teal-400 to-cyan-600',
    ]
    return gradients[index % gradients.length]
  }

  if (loading) return <Loading label="Memuat data toko..." />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-leaf-950">🏪 Kelola Toko</h1>
        <p className="mt-1 text-sm text-leaf-900/50">Verifikasi dan kelola semua toko di platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Toko', value: totalStores, icon: '🏪', color: 'from-leaf-400 to-emerald-600', bg: 'bg-leaf-50' },
          { label: 'Aktif', value: activeStores, icon: '✅', color: 'from-emerald-400 to-green-600', bg: 'bg-emerald-50' },
          { label: 'Menunggu Verifikasi', value: pendingStores, icon: '⏳', color: 'from-amber-400 to-orange-600', bg: 'bg-amber-50' },
          { label: 'Total Produk', value: totalProducts, icon: '📦', color: 'from-sky-400 to-blue-600', bg: 'bg-sky-50' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border border-leaf-100 ${s.bg} p-4 transition-all hover:-translate-y-0.5 hover:shadow-md`}>
            <div className="flex items-center gap-3">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-xl text-white shadow-sm`}>
                {s.icon}
              </span>
              <div>
                <p className="text-xs text-leaf-900/50">{s.label}</p>
                <p className="text-xl font-extrabold text-leaf-950">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Alerts */}
      {pendingStores > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-xl">⏳</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-800">{pendingStores} toko menunggu verifikasi</p>
              <p className="text-xs text-amber-600">Toko baru perlu diverifikasi sebelum bisa berjualan</p>
            </div>
            <button
              onClick={() => setFilter('pending')}
              className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700"
            >
              Lihat Semua
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-leaf-900/30">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama toko atau pemilik..."
            className="w-full rounded-xl border border-leaf-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'semua', label: 'Semua', count: totalStores },
            { key: 'active', label: 'Aktif', count: activeStores },
            { key: 'pending', label: 'Menunggu', count: pendingStores },
            { key: 'suspended', label: 'Suspended', count: stores.filter(s => s.status === 'suspended').length },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === f.key ? 'bg-leaf-600 text-white shadow-sm' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50'
              }`}
            >
              {f.label} <span className="ml-1 opacity-70">({f.count})</span>
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex rounded-lg border border-leaf-200 bg-white p-0.5">
          <button
            onClick={() => setView('table')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${view === 'table' ? 'bg-leaf-600 text-white' : 'text-leaf-900/60 hover:bg-leaf-50'}`}
          >
            📋 Tabel
          </button>
          <button
            onClick={() => setView('card')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${view === 'card' ? 'bg-leaf-600 text-white' : 'text-leaf-900/60 hover:bg-leaf-50'}`}
          >
            🃏 Kartu
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-leaf-900/50">
        Menampilkan <span className="font-bold text-leaf-950">{filtered.length}</span> dari {totalStores} toko
      </p>

      {/* Card View */}
      {view === 'card' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s, i) => (
            <div key={s.id} className="group overflow-hidden rounded-2xl border border-leaf-100 bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md">
              {/* Store Header */}
              <div className={`relative bg-gradient-to-br ${storeGradient(i)} px-5 py-6`}>
                <div className="flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm transition-transform group-hover:scale-110">
                    🏪
                  </span>
                  <Badge className={`${statusBadge(s.status)} bg-white/90 backdrop-blur-sm`}>
                    {statusIcon(s.status)} {{ active: 'Aktif', pending: 'Menunggu', suspended: 'Suspended' }[s.status]}
                  </Badge>
                </div>
                <h3 className="mt-3 text-xl font-extrabold text-white">{s.name}</h3>
                <p className="mt-0.5 text-sm text-white/80">ID #{s.id}</p>
              </div>

              {/* Store Info */}
              <div className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    <div>
                      <p className="text-xs text-leaf-900/50">Pemilik</p>
                      <p className="text-sm font-semibold text-leaf-950">{s.user?.name || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📦</span>
                    <div>
                      <p className="text-xs text-leaf-900/50">Total Produk</p>
                      <p className="text-sm font-semibold text-leaf-950">{s.products_count} produk</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <div>
                      <p className="text-xs text-leaf-900/50">Terdaftar</p>
                      <p className="text-sm font-semibold text-leaf-950">
                        {new Date(s.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 border-t border-leaf-100 pt-4">
                  {s.status === 'pending' ? (
                    <button
                      onClick={() => verifyStore(s.id)}
                      className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-2.5 text-sm font-bold text-white shadow-sm transition hover:shadow-md"
                    >
                      ✅ Verifikasi Toko
                    </button>
                  ) : s.status === 'active' ? (
                    <div className="flex gap-2">
                      <button className="flex-1 rounded-xl bg-leaf-50 py-2 text-xs font-bold text-leaf-700 transition hover:bg-leaf-100">
                        📊 Lihat Detail
                      </button>
                      <button className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100">
                        🚫
                      </button>
                    </div>
                  ) : (
                    <button className="w-full rounded-xl bg-emerald-50 py-2 text-xs font-bold text-emerald-600 transition hover:bg-emerald-100">
                      🔓 Aktifkan Kembali
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-leaf-100 bg-white p-12 text-center shadow-soft">
              <span className="text-5xl">🔍</span>
              <p className="mt-3 text-lg font-bold text-leaf-900/50">Tidak ada toko ditemukan</p>
              <p className="mt-1 text-sm text-leaf-900/40">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="rounded-2xl border border-leaf-100 bg-white shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-leaf-100 bg-leaf-50/50">
                  <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Toko</th>
                  <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Pemilik</th>
                  <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Produk</th>
                  <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Terdaftar</th>
                  <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id} className="border-b border-leaf-50 transition hover:bg-leaf-50/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${storeGradient(i)} text-lg text-white shadow-sm`}>
                          🏪
                        </span>
                        <div>
                          <p className="font-semibold text-leaf-950">{s.name}</p>
                          <p className="text-xs text-leaf-900/40">ID #{s.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-leaf-900/60">{s.user?.name || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-1 text-xs font-bold text-sky-700">
                        📦 {s.products_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-leaf-900/50">
                      {new Date(s.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={statusBadge(s.status)}>
                        {statusIcon(s.status)} {{ active: 'Aktif', pending: 'Menunggu', suspended: 'Suspended' }[s.status] || s.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {s.status === 'pending' && (
                        <button
                          onClick={() => verifyStore(s.id)}
                          className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 transition hover:bg-emerald-100"
                        >
                          ✅ Verifikasi
                        </button>
                      )}
                      {s.status === 'active' && (
                        <span className="text-xs text-leaf-900/40">—</span>
                      )}
                      {s.status === 'suspended' && (
                        <button className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600 transition hover:bg-emerald-100">
                          🔓 Aktifkan
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <span className="text-4xl">🔍</span>
                      <p className="mt-2 text-sm font-semibold text-leaf-900/50">Tidak ada toko ditemukan</p>
                      <p className="text-xs text-leaf-900/40">Coba ubah filter atau kata kunci pencarian</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
