import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api/admin'
import Badge from '../../components/ui/Badge'
import Loading from '../../components/ui/Loading'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('semua')

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
    return true
  })

  const roleBadge = (role) => {
    switch (role) {
      case 'admin': return 'bg-violet-100 text-violet-700'
      case 'seller': return 'bg-amber-100 text-amber-800'
      default: return 'bg-leaf-100 text-leaf-700'
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau email..."
          className="rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none w-64"
        />
        {['semua', 'active', 'inactive', 'seller'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === f ? 'bg-leaf-600 text-white' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200'
            }`}
          >
            {{ semua: 'Semua', active: 'Aktif', inactive: 'Nonaktif', seller: 'Seller' }[f]}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-leaf-100 bg-white shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-leaf-100 bg-leaf-50/50">
                <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Pengguna</th>
                <th className="px-4 py-3 text-left font-semibold text-leaf-900/70">Email</th>
                <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Peran</th>
                <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-leaf-900/70">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-leaf-50 hover:bg-leaf-50/30">
                  <td className="px-4 py-3 font-semibold text-leaf-950">{u.name}</td>
                  <td className="px-4 py-3 text-leaf-900/60">{u.email}</td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="rounded-lg border border-leaf-200 bg-white px-2 py-1 text-xs font-semibold focus:outline-none"
                    >
                      <option value="customer">Customer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={u.is_active ? 'bg-leaf-100 text-leaf-700' : 'bg-rose-100 text-rose-700'}>
                      {u.is_active ? '✅ Aktif' : '⏸️ Nonaktif'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(u.id)}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg transition ${
                        u.is_active ? 'text-rose-600 hover:bg-rose-50' : 'text-leaf-700 hover:bg-leaf-50'
                      }`}
                    >
                      {u.is_active ? '🔒 Nonaktifkan' : '🔓 Aktifkan'}
                    </button>
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
