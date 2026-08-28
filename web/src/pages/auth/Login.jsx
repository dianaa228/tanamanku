import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function Login() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'rina@tanamanku.id', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(form)
      showToast('Selamat datang kembali! 🌿')
      // Redirect berdasarkan role
      const userRole = res.data?.user?.role
      if (userRole === 'admin') {
        navigate('/admin')
      } else if (userRole === 'seller') {
        navigate('/seller')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal masuk. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-leaf-950">Selamat datang kembali 👋</h1>
      <p className="mt-2 text-sm text-leaf-900/60">Masuk untuk lanjut merawat kebunmu.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        {error && (
          <div className="animate-pop rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}
        <Input
          label="Email"
          type="email"
          icon="✉️"
          placeholder="nama@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          label="Password"
          type="password"
          icon="🔒"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-leaf-900/60">
            <input type="checkbox" className="h-4 w-4 rounded border-leaf-300 accent-leaf-600" /> Ingat saya
          </label>
          <Link to="/forgot-password" className="font-semibold text-leaf-700 hover:text-leaf-800">
            Lupa password?
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Masuk
        </Button>
      </form>

      <div className="mt-6 rounded-2xl bg-leaf-50 px-4 py-3 text-xs text-leaf-900/60">
        💡 <strong>Mode demo:</strong> email sudah terisi — cukup isi password apa pun lalu klik Masuk.
      </div>

      <p className="mt-8 text-center text-sm text-leaf-900/60">
        Belum punya akun?{' '}
        <Link to="/register" className="font-bold text-leaf-700 hover:text-leaf-800">
          Daftar gratis
        </Link>
      </p>
    </div>
  )
}
