import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { servicesApi } from '../../services/api/services'
import { SERVICE_CATEGORIES } from '../../types/constants'
import { formatRupiah, formatDateTime } from '../../utils/format'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Loading from '../../components/ui/Loading'

const durationText = (min) => {
  if (!min) return '—'
  if (min < 60) return `${min} menit`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h}j ${m}m` : `${h} jam`
}

export default function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [booking, setBooking] = useState(false)
  const [form, setForm] = useState({
    schedule_date: '',
    schedule_time: '09:00',
    address_label: 'Rumah',
    address_street: '',
    address_city: '',
    address_phone: user?.phone || '',
    note: '',
  })

  useEffect(() => {
    servicesApi.getService(id).then((res) => {
      setService(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleBook = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    setBooking(true)
    try {
      await servicesApi.bookService({
        service_id: Number(id),
        schedule_at: `${form.schedule_date}T${form.schedule_time}:00`,
        address: {
          label: form.address_label,
          street: form.address_street,
          city: form.address_city,
          phone: form.address_phone,
        },
        note: form.note || undefined,
      })
      setModalOpen(false)
      showToast('Pemesanan berhasil! 🎉 Cek di "Pesanan Saya"')
    } catch {
      showToast('Gagal memesan. Coba lagi.', 'error')
    } finally {
      setBooking(false)
    }
  }

  // Min date = tomorrow
  const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  if (loading) return <Loading label="Memuat detail layanan..." />
  if (!service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-6xl">🔍</p>
        <p className="mt-4 text-lg font-bold text-leaf-950">Layanan tidak ditemukan</p>
        <Button to="/services" className="mt-4">← Kembali</Button>
      </div>
    )
  }

  const cat = SERVICE_CATEGORIES.find((c) => c.value === service.category)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Back link */}
      <Link to="/services" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-leaf-700 hover:text-leaf-800 transition">
        ← Kembali ke layanan
      </Link>

      {/* Card */}
      <div className="rounded-3xl border border-leaf-100 bg-white shadow-soft overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-leaf-50 to-leaf-100 px-6 py-8 sm:px-8">
          <Badge className="bg-white/80 text-leaf-700">
            {cat?.icon} {cat?.label || service.category}
          </Badge>
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-leaf-950">{service.name}</h1>
          <p className="mt-1 text-sm text-leaf-900/60">oleh <span className="font-semibold text-leaf-900">{service.provider?.name}</span></p>
        </div>

        {/* Body */}
        <div className="px-6 py-6 sm:px-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-leaf-50 px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-leaf-700">{formatRupiah(service.price)}</p>
              <p className="text-[11px] text-leaf-900/50">per kunjungan</p>
            </div>
            <div className="rounded-2xl bg-sky-50 px-4 py-3 text-center">
              <p className="text-2xl font-extrabold text-sky-700">{durationText(service.duration)}</p>
              <p className="text-[11px] text-leaf-900/50">durasi</p>
            </div>
            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg">⭐</span>
                <p className="text-2xl font-extrabold text-amber-700">{service.ratingAvg}</p>
              </div>
              <p className="text-[11px] text-leaf-900/50">{service.reviewsCount} ulasan</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-base font-bold text-leaf-950">Deskripsi Layanan</h2>
            <p className="mt-2 text-sm leading-relaxed text-leaf-900/70">{service.description}</p>
          </div>

          {/* Info */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-leaf-50 px-4 py-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="text-[11px] text-leaf-900/40">Area Layanan</p>
                <p className="text-sm font-semibold text-leaf-950">{service.serviceArea}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-leaf-50 px-4 py-3">
              <span className="text-xl">📞</span>
              <div>
                <p className="text-[11px] text-leaf-900/40">Provider</p>
                <p className="text-sm font-semibold text-leaf-950">{service.provider?.name}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button onClick={() => setModalOpen(true)} size="lg" className="w-full">
            🗓️ Pesan Layanan Ini
          </Button>
        </div>
      </div>

      {/* ── Booking Modal ── */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="📝 Pesan Layanan">
        <form onSubmit={handleBook} className="space-y-4">
          {/* Service summary */}
          <div className="rounded-xl bg-leaf-50 px-4 py-3">
            <p className="text-sm font-bold text-leaf-950">{service.name}</p>
            <p className="text-xs text-leaf-900/50">{formatRupiah(service.price)} · {durationText(service.duration)}</p>
          </div>

          {/* Schedule */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-leaf-900">Tanggal *</label>
              <input
                type="date"
                value={form.schedule_date}
                onChange={set('schedule_date')}
                min={minDate}
                required
                className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-leaf-900">Jam *</label>
              <select
                value={form.schedule_time}
                onChange={set('schedule_time')}
                className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
              >
                {['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map((t) => (
                  <option key={t} value={t}>{t} WIB</option>
                ))}
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Label Lokasi</label>
            <input
              value={form.address_label}
              onChange={set('address_label')}
              placeholder="Rumah, Kantor, dll."
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Alamat Lengkap *</label>
            <textarea
              value={form.address_street}
              onChange={set('address_street')}
              required
              rows={2}
              placeholder="Jl. ... No. ... RT/RW ... Kelurahan ..."
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none resize-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-leaf-900">Kota *</label>
              <input
                value={form.address_city}
                onChange={set('address_city')}
                required
                placeholder="Jakarta Selatan"
                className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-leaf-900">No. Telepon *</label>
              <input
                value={form.address_phone}
                onChange={set('address_phone')}
                required
                placeholder="0812..."
                className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="mb-1 block text-sm font-semibold text-leaf-900">Catatan (opsional)</label>
            <textarea
              value={form.note}
              onChange={set('note')}
              rows={2}
              placeholder="Instruksi tambahan untuk provider..."
              className="w-full rounded-xl border border-leaf-200 bg-white px-4 py-2.5 text-sm focus:border-leaf-400 focus:outline-none resize-none"
            />
          </div>

          {/* Total */}
          <div className="rounded-xl bg-leaf-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-leaf-900/60">Total Biaya</span>
              <span className="text-xl font-extrabold text-leaf-700">{formatRupiah(service.price)}</span>
            </div>
          </div>

          <Button type="submit" loading={booking} size="lg" className="w-full">
            ✅ Konfirmasi Pemesanan
          </Button>
        </form>
      </Modal>
    </div>
  )
}
