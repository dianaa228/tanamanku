import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { subscriptionApi } from '../../services/api/subscription'
import { formatRupiah, cx } from '../../utils/format'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Loading from '../../components/ui/Loading'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'

export default function Subscription() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [plans, setPlans] = useState([])
  const [currentPlan, setCurrentPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('ewallet')
  const [subscribing, setSubscribing] = useState(false)
  const [successModal, setSuccessModal] = useState(false)

  useEffect(() => {
    Promise.all([
      subscriptionApi.getPlans(),
      subscriptionApi.getMySubscription(),
    ]).then(([p, s]) => {
      setPlans(p.data)
      setCurrentPlan(s.data)
      setLoading(false)
    })
  }, [])

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    if (!selectedPlan) return
    setSubscribing(true)
    try {
      await subscriptionApi.subscribe(selectedPlan.id, paymentMethod)
      setSelectedPlan(null)
      setSuccessModal(true)
      // Refresh subscription
      const s = await subscriptionApi.getMySubscription()
      setCurrentPlan(s.data)
      showToast('Berlangganan berhasil! 🎉')
    } catch {
      showToast('Gagal berlangganan. Coba lagi.', 'error')
    } finally {
      setSubscribing(false)
    }
  }

  if (loading) return <Loading label="Memuat paket langganan..." />

  const activePlan = currentPlan ? plans.find((p) => p.id === currentPlan.plan_id) : null

  const planColors = {
    free: { bg: 'bg-gray-50', border: 'border-gray-200', accent: 'text-gray-600', btn: 'secondary' },
    'plant-care-pro': { bg: 'bg-leaf-50', border: 'border-leaf-300', accent: 'text-leaf-700', btn: 'primary' },
    'seller-pro': { bg: 'bg-amber-50', border: 'border-amber-300', accent: 'text-amber-700', btn: 'sun' },
  }

  return (
    <div className="page-container max-w-5xl">
      {/* Header */}
      <div className="text-center animate-fade-up">
        <h1 className="page-title">⭐ Pilih Paket Langganan</h1>
        <p className="mt-2 text-sm text-leaf-900/50 max-w-lg mx-auto">
          Tingkatkan pengalaman berkebunmu dengan fitur premium. Mulai dari gratis!
        </p>
      </div>

      {/* Current Subscription Banner */}
      {currentPlan && currentPlan.plan_id !== 'free' && (
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-leaf-500 to-leaf-600 p-5 text-white shadow-lift">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold opacity-80">Paket Aktif</p>
              <p className="text-xl font-extrabold">
                {activePlan?.badge}{' '}{activePlan?.name}
              </p>
            </div>
            <Button to="/subscription/manage" variant="secondary" size="sm">
              Kelola Langganan →
            </Button>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const colors = planColors[plan.id] || planColors.free
          const isCurrent = currentPlan?.plan_id === plan.id

          return (
            <div
              key={plan.id}
              className={cx(
                'relative rounded-3xl border-2 p-6 transition-all',
                colors.bg,
                plan.popular ? colors.border + ' shadow-lift scale-[1.02]' : 'border-leaf-100 shadow-soft',
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-leaf-600 text-white px-4 py-1.5 text-xs">
                    🔥 Paling Populer
                  </Badge>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center">
                <span className="text-5xl">{plan.badge}</span>
                <h2 className="mt-3 text-xl font-semibold text-forest">{plan.name}</h2>
                <p className="mt-1 text-sm text-leaf-900/60">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mt-6 text-center">
                {plan.price === 0 ? (
                  <p className="text-4xl font-extrabold text-forest">Gratis</p>
                ) : (
                  <div>
                    <span className="text-4xl font-extrabold text-forest">{formatRupiah(plan.price)}</span>
                    <span className="text-sm text-leaf-900/50">/{plan.period === 'month' ? 'bulan' : 'selamanya'}</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mt-6 space-y-3">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className={cx('mt-0.5 text-sm', f.included ? 'text-leaf-500' : 'text-gray-300')}>
                      {f.included ? '✓' : '✗'}
                    </span>
                    <span className={cx('text-sm', f.included ? 'text-leaf-900/80' : 'text-leaf-900/30')}>
                      {f.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8">
                {isCurrent ? (
                  <Button variant="secondary" size="lg" className="w-full" disabled>
                    ✓ Paket Aktif
                  </Button>
                ) : plan.price === 0 ? (
                  <Button variant="secondary" size="lg" className="w-full" disabled>
                    Paket Saat Ini
                  </Button>
                ) : (
                  <Button
                    variant={colors.btn}
                    size="lg"
                    className="w-full"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    {plan.cta}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-16">
        <h2 className="section-title text-center">📋 Perbandingan Fitur Lengkap</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-leaf-200">
                <th className="py-3 px-4 text-left font-semibold text-forest">Fitur</th>
                {plans.map((p) => (
                  <th key={p.id} className="py-3 px-4 text-center font-semibold text-forest">
                    {p.badge} {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'My Garden', free: '5 tanaman', pro: 'Unlimited', seller: 'Unlimited' },
                { feature: 'Care Reminder', free: '3 tanaman', pro: 'Unlimited', seller: 'Unlimited' },
                { feature: 'Plant Finder', free: 'Dasar', pro: 'Lengkap', seller: 'Lengkap' },
                { feature: 'Plant Diagnosis', free: '3/bulan', pro: 'Unlimited', seller: 'Unlimited' },
                { feature: 'Konsultasi Ahli', free: '—', pro: '2x/bulan', seller: '2x/bulan' },
                { feature: 'Konten Premium', free: '—', pro: '✓', seller: '✓' },
                { feature: 'Badge Profil', free: '—', pro: 'Plant Pro', seller: 'Verified Seller' },
                { feature: 'Analytics', free: '—', pro: '—', seller: 'Lanjutan' },
                { feature: 'Boost Listing', free: '—', pro: '—', seller: '✓' },
                { feature: 'Komisi', free: '5%', pro: '5%', seller: '3%' },
              ].map((row, i) => (
                <tr key={i} className={cx('border-b border-leaf-100', i % 2 === 0 ? 'bg-leaf-50/50' : 'bg-white')}>
                  <td className="py-3 px-4 font-semibold text-forest">{row.feature}</td>
                  <td className="py-3 px-4 text-center text-leaf-900/60">{row.free}</td>
                  <td className="py-3 px-4 text-center text-leaf-900/60">{row.pro}</td>
                  <td className="py-3 px-4 text-center text-leaf-900/60">{row.seller}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="section-title text-center">❓ Pertanyaan Umum</h2>
        <div className="mt-6 space-y-4">
          {[
            { q: 'Bisa berubah paket kapan saja?', a: 'Ya! Anda bisa upgrade atau downgrade kapan saja. Perubahan berlaku di cycle berikutnya.' },
            { q: 'Bagaimana cara pembayaran?', a: 'Kami menerima transfer bank, e-wallet (GoPay, OVO, DANA), dan QRIS.' },
            { q: 'Ada masa percobaan gratis?', a: 'Plant Care Pro dan Seller Pro menawarkan masa percobaan gratis 7 hari pertama.' },
            { q: 'Bisa berhenti berlangganan?', a: 'Ya, Anda bisa membatalkan langganan kapan saja. Akses premium berakhir hingga akhir periode yang dibayar.' },
          ].map((faq, i) => (
            <div key={i} className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft">
              <p className="font-semibold text-forest">{faq.q}</p>
              <p className="mt-2 text-sm text-leaf-900/60">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe Modal */}
      <Modal open={!!selectedPlan} onClose={() => setSelectedPlan(null)} title="📝 Berlangganan">
        {selectedPlan && (
          <form onSubmit={handleSubscribe} className="space-y-4">
            {/* Plan Summary */}
            <div className="rounded-xl bg-leaf-50 px-4 py-4 text-center">
              <span className="text-4xl">{selectedPlan.badge}</span>
              <p className="mt-2 text-lg font-semibold text-forest">{selectedPlan.name}</p>
              <p className="text-xl font-extrabold text-leaf-700">
                {formatRupiah(selectedPlan.price)}<span className="text-sm font-normal text-leaf-900/50">/bulan</span>
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-leaf-900">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'ewallet', label: 'E-Wallet', icon: '📱', desc: 'GoPay, OVO, DANA' },
                  { value: 'transfer', label: 'Transfer Bank', icon: '🏦', desc: 'VA BCA, BRI, Mandiri' },
                  { value: 'qris', label: 'QRIS', icon: '🔳', desc: 'Scan QR' },
                  { value: 'card', label: 'Kartu', icon: '💳', desc: 'Visa, Mastercard' },
                ].map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setPaymentMethod(m.value)}
                    className={cx(
                      'rounded-xl border-2 px-3 py-3 text-center transition-all',
                      paymentMethod === m.value
                        ? 'border-leaf-500 bg-leaf-50 ring-2 ring-leaf-200'
                        : 'border-leaf-100 hover:border-leaf-200',
                    )}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <p className="mt-1 text-sm font-semibold text-leaf-950">{m.label}</p>
                    <p className="text-[10px] text-leaf-900/40">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="rounded-xl bg-leaf-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-leaf-900/60">Total hari ini</span>
                <span className="text-xl font-extrabold text-leaf-700">{formatRupiah(selectedPlan.price)}</span>
              </div>
            </div>

            <Button type="submit" loading={subscribing} size="lg" className="w-full">
              ✅ Bayar & Mulai Berlangganan
            </Button>
          </form>
        )}
      </Modal>

      {/* Success Modal */}
      <Modal open={successModal} onClose={() => setSuccessModal(false)} title="🎉 Berhasil!">
        <div className="space-y-4 text-center">
          <div className="text-6xl">🎉</div>
          <p className="text-lg font-semibold text-forest">Selamat Datang di Premium!</p>
          <p className="text-sm text-leaf-900/60">
            Langganan Anda sudah aktif. Nikmati semua fitur premium sekarang!
          </p>
          <Button onClick={() => setSuccessModal(false)} size="lg" className="w-full">
            👍 Mulai Jelajahi
          </Button>
        </div>
      </Modal>
    </div>
  )
}
