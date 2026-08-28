import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api/admin'
import Badge from '../../components/ui/Badge'
import Loading from '../../components/ui/Loading'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('semua')
  const [view, setView] = useState('table') // 'table' or 'card'

  useEffect(() => {
    adminApi.getUsers().then((res) => {
      setUsers(res.data)
      setLoading(false)
    })
  }, [])

  const toggleActive = async (id) => {
    await adminApi.toggleUserActive(id)
    setUsers(users.map((u) => u.id === id ? { ...u, is_active: !u.is_active } : u))
  }

  const changeRole = async (id, role) => {
    await adminApi.updateUserRole(id, role)
    setUsers(users.map((u) => u.id === id ? { ...u, role } : u))
  }

  const filtered = users.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'active') return u.is_active
    if (filter === 'inactive') return !u.is_active
    if (filter === 'seller') return u.role === 'seller'
    if (filter === 'admin') return u.role === 'admin'
    if (filter === 'customer') return u.role === 'customer'
    return true
  })

  // Stats
  const totalUsers = users.length
  const activeUsers = users.filter(u => u.is_active).length
  const totalAdmins = users.filter(u => u.role === 'admin').length
  const totalSellers = users.filter(u => u.role === 'seller').length
  const totalCustomers = users.filter(u => u.role === 'customer').length

  const roleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-violet-100 text-violet-700'
      case 'seller': return 'bg-amber-100 text-amber-800'
      default: return 'bg-leaf-100 text-leaf-700'
    }
  }

  const roleIcon = (role) => {
    switch (role) {
      case 'admin': return '🛡️'
      case 'seller': return '🏪'
      default: return '🧑‍🌾'
    }
  }

  const avatarGradient = (role) => {
    switch (role) {
      case 'admin': return 'from-violet-400 to-purple-600'
      case 'seller': return 'from-amber-400 to-orange-600'
      default: return 'from-leaf-400 to-emerald-600'
    }
  }

  if (loading) return <Loading label="Memuat data pengguna..." />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-leaf-950">👥 Kelola Pengguna</h1>
        <p className="mt-1 text-sm text-leaf-900/50">Kelola semua pengguna platform Tanamanku</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Total Pengguna', value: totalUsers, icon: '👥', color: 'from-leaf-400 to-emerald-600', bg: 'bg-leaf-50' },
          { label: 'Aktif', value: activeUsers, icon: '✅', color: 'from-emerald-400 to-green-600', bg: 'bg-emerald-50' },
          { label: 'Admin', value: totalAdmins, icon: '🛡️', color: 'from-violet-400 to-purple-600', bg: 'bg-violet-50' },
          { label: 'Seller', value: totalSellers, icon: '🏪', color: 'from-amber-400 to-orange-600', bg: 'bg-amber-50' },
          { label: 'Customer', value: totalCustomers, icon: '🧑‍🌾', color: 'from-sky-400 to-blue-600', bg: 'bg-sky-50' },
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

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-leaf-900/30">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full rounded-xl border border-leaf-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'semua', label: 'Semua', count: totalUsers },
            { key: 'active', label: 'Aktif', count: activeUsers },
            { key: 'inactive', label: 'Nonaktif', count: totalUsers - activeUsers },
            { key: 'admin', label: 'Admin', count: totalAdmins },
            { key: 'seller', label: 'Seller', count: totalSellers },
            { key: 'customer', label: 'Customer', count: totalCustomers },
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
        Menampilkan <span className="font-bold text-leaf-950">{filtered.length}</span> dari {totalUsers} pengguna
      </p>

      {/* Table View */}
      {view === 'table' && (
        <div className="rounded-2xl border border-leaf-100 bg-white shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-leaf-100 bg-leaf-50/50">
                  <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Pengguna</th>
                  <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Telepon</th>
                  <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Peran</th>
                  <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-leaf-50 transition hover:bg-leaf-50/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(u.role)} text-lg text-white shadow-sm`}>
                          {roleIcon(u.role)}
                        </span>
                        <div>
                          <p className="font-semibold text-leaf-950">{u.name}</p>
                          <p className="text-xs text-leaf-900/40">ID #{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-leaf-900/60">{u.email}</td>
                    <td className="px-4 py-3 text-leaf-900/60">{u.phone || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="rounded-lg border border-leaf-200 bg-white px-2 py-1 text-xs font-semibold focus:border-leaf-400 focus:outline-none focus:ring-1 focus:ring-leaf-200"
                      >
                        <option value="customer">🧑‍🌾 Customer</option>
                        <option value="seller">🏪 Seller</option>
                        <option value="admin">🛡️ Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}>
                        {u.is_active ? '✅ Aktif' : '⏸️ Nonaktif'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(u.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                          u.is_active ? 'text-rose-600 hover:bg-rose-50' : 'text-leaf-700 hover:bg-leaf-50'
                        }`}
                      >
                        {u.is_active ? '🔒 Nonaktifkan' : '🔓 Aktifkan'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <span className="text-4xl">🔍</span>
                      <p className="mt-2 text-sm font-semibold text-leaf-900/50">Tidak ada pengguna ditemukan</p>
                      <p className="text-xs text-leaf-900/40">Coba ubah filter atau kata kunci pencarian</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Card View */}
      {view === 'card' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u) => (
            <div key={u.id} className="group rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${avatarGradient(u.role)} text-2xl text-white shadow-sm transition-transform group-hover:scale-110`}>
                    {roleIcon(u.role)}
                  </span>
                  <div>
                    <p className="font-bold text-leaf-950">{u.name}</p>
                    <p className="text-xs text-leaf-900/50">{u.email}</p>
                  </div>
                </div>
                <Badge className={u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}>
                  {u.is_active ? '✅' : '⏸️'}
                </Badge>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-leaf-900/50">Telepon</span>
                  <span className="font-semibold text-leaf-950">{u.phone || '—'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-leaf-900/50">Peran</span>
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="rounded-lg border border-leaf-200 bg-white px-2 py-1 text-xs font-semibold focus:border-leaf-400 focus:outline-none"
                  >
                    <option value="customer">🧑‍🌾 Customer</option>
                    <option value="seller">🏪 Seller</option>
                    <option value="admin">🛡️ Admin</option>
                  </select>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-leaf-900/50">Terdaftar</span>
                  <span className="text-xs text-leaf-900/50">
                    {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-leaf-100 pt-3">
                <button
                  onClick={() => toggleActive(u.id)}
                  className={`w-full rounded-xl py-2 text-xs font-bold transition ${
                    u.is_active
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                >
                  {u.is_active ? '🔒 Nonaktifkan Akun' : '🔓 Aktifkan Akun'}
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-leaf-100 bg-white p-12 text-center shadow-soft">
              <span className="text-5xl">🔍</span>
              <p className="mt-3 text-lg font-bold text-leaf-900/50">Tidak ada pengguna ditemukan</p>
              <p className="mt-1 text-sm text-leaf-900/40">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
