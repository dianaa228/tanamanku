import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { authApi } from '../../services/api/auth'
import { useToast } from '../../context/ToastContext'

export default function ForgotPassword() {
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.forgotPassword({ email })
      setSent(true)
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal mengirim email.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-leaf-950">Lupa password? 🔑</h1>
      <p className="mt-2 text-sm text-leaf-900/60">
        Masukkan email terdaftar Anda — kami kirim link reset password.
      </p>

      {sent ? (
        <div className="mt-8 animate-pop rounded-3xl bg-leaf-50 p-8 text-center">
          <div className="animate-float text-5xl">📬</div>
          <h2 className="mt-4 text-lg font-bold text-leaf-950">Email terkirim!</h2>
          <p className="mt-2 text-sm text-leaf-900/60">
            Link reset password telah dikirim ke <strong>{email}</strong>. Periksa juga folder spam Anda.
          </p>
          <Link to="/login" className="mt-6 inline-block font-bold text-leaf-700 hover:text-leaf-800">
            ← Kembali ke halaman masuk
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4">
          <Input
            label="Email"
            type="email"
            icon="✉️"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Kirim link reset
          </Button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-leaf-900/60">
        Ingat passwordnya?{' '}
        <Link to="/login" className="font-bold text-leaf-700 hover:text-leaf-800">
          Masuk
        </Link>
      </p>
    </div>
  )
}
