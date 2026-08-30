import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function Register() {
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirmation: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      await register(form)
      showToast('Akun berhasil dibuat! Selamat datang di Tanamanku 🌱')
      navigate('/')
    } catch (err) {
      setErrors(err.response?.data?.errors || { general: err.response?.data?.message || 'Gagal mendaftar.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="display text-3xl font-semibold text-forest dark:text-white">Mulai berkebun 🪴</h1>
      <p className="mt-2 text-sm text-muted dark:text-sage-400">Gratis selamanya. Tanpa kartu kredit.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        {errors.general && (
          <div className="animate-pop rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {errors.general}
          </div>
        )}
        <Input label="Nama lengkap" icon="🧑‍🌾" placeholder="Rina Kartika" value={form.name} onChange={set('name')} error={errors.name?.[0]} required />
        <Input label="Email" type="email" icon="✉️" placeholder="nama@email.com" value={form.email} onChange={set('email')} error={errors.email?.[0]} required />
        <Input
          label="Password"
          type="password"
          icon="🔒"
          placeholder="Minimal 8 karakter"
          value={form.password}
          onChange={set('password')}
          error={errors.password?.[0]}
          hint="Gunakan kombinasi huruf dan angka agar lebih aman."
          required
        />
        <Input
          label="Konfirmasi password"
          type="password"
          icon="🔒"
          placeholder="Ulangi password"
          value={form.passwordConfirmation}
          onChange={set('passwordConfirmation')}
          error={errors.passwordConfirmation?.[0]}
          required
        />
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Daftar sekarang
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-leaf-900/50 dark:text-sage-500">
        Dengan mendaftar, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi Tanamanku.
      </p>
      <p className="mt-6 text-center text-sm text-leaf-900/60 dark:text-sage-400">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-bold text-leaf-700 hover:text-leaf-800 dark:text-leaf-400 dark:hover:text-leaf-300">
          Masuk
        </Link>
      </p>
    </div>
  )
}
