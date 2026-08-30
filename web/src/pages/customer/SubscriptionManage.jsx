import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { subscriptionApi } from '../../services/api/subscription'
import { formatRupiah, formatDate, cx } from '../../utils/format'
import { useToast } from '../../context/ToastContext'
import Loading from '../../components/ui/Loading'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'

export default function SubscriptionManage() {
  const { showToast } = useToast()
  const [subscription, setSubscription] = useState(null)
  const [plans, setPlans] = useState([])
  const [billing, setBilling] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelModal, setCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    Promise.all([
      subscriptionApi.getMySubscription(),
      subscriptionApi.getPlans(),
      subscriptionApi.getBillingHistory(),
    ]).then(([s, p, b]) => {
      setSubscription(s.data)
      setPlans(p.data)
      setBilling(b.data)
      setLoading(false)
    })
  }, [])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await subscriptionApi.cancelSubscription()
      setCancelModal(false)
      showToast('Langganan dibatalkan. Akses premium berakhir di akhir periode.')
      const s = await subscriptionApi.getMySubscription()
      setSubscription(s.data)
    } catch {
      showToast('Gagal membatalkan. Coba lagi.', 'error')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <Loading label="Memuat data langganan..." />

  const currentPlan = plans.find((p) => p.id === subscription?.plan_id) || plans[0]
  const isActive = subscription?.status === 'active'
  const isFree = subscription?.plan_id === 'free'

  return (
    <div className="page-container max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="page-title">⚙️ Kelola Langganan</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Atur paket dan pembayaran Anda</p>
        </div>
        <Link to="/subscription" className="shrink-0 text-sm font-semibold text-leaf-700 hover:text-leaf-800">
          ← Lihat Paket Lain
        </Link>
      </div>

      {/* Current Plan Card */}
      <div className={cx(
        'mt-8 rounded-3xl border-2 p-6 sm:p-8',
        isFree ? 'border-gray-200 bg-gray-50' : 'border-leaf-300 bg-gradient-to-br from-leaf-50 to-white shadow-lift',
      )}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{currentPlan?.badge}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">{currentPlan?.name}</h2>
                <Badge className={isActive ? 'bg-leaf-100 text-leaf-700' : 'bg-gray-100 text-gray-500'}>
                  {isActive ? '✓ Aktif' : 'Nonaktif'}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{currentPlan?.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold text-leaf-700">
              {currentPlan?.price === 0 ? 'Gratis' : formatRupiah(currentPlan?.price)}
            </p>
            {currentPlan?.price > 0 && (
              <p className="text-xs text-leaf-900/40">/{currentPlan?.period === 'month' ? 'bulan' : 'selamanya'}</p>
            )}
          </div>
        </div>

        {/* Subscription Details */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[var(--bg-card)] px-4 py-3 border border-[var(--border-primary)]">
            <p className="text-[11px] text-[var(--text-muted)]">Mulai Berlangganan</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{subscription?.started_at ? formatDate(subscription.started_at) : '—'}</p>
          </div>
          <div className="rounded-xl bg-[var(--bg-card)] px-4 py-3 border border-[var(--border-primary)]">
            <p className="text-[11px] text-[var(--text-muted)]">Berakhir</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {subscription?.expires_at ? formatDate(subscription.expires_at) : 'Selamanya'}
            </p>
          </div>
          <div className="rounded-xl bg-[var(--bg-card)] px-4 py-3 border border-[var(--border-primary)]">
            <p className="text-[11px] text-[var(--text-muted)]">Pembayaran</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {subscription?.payment_method === 'ewallet' ? '📱 E-Wallet' :
               subscription?.payment_method === 'transfer' ? '🏦 Transfer Bank' :
               subscription?.payment_method === 'qris' ? '🔳 QRIS' :
               subscription?.payment_method === 'card' ? '💳 Kartu' : '—'}
            </p>
          </div>
          <div className="rounded-xl bg-[var(--bg-card)] px-4 py-3 border border-[var(--border-primary)]">
            <p className="text-[11px] text-[var(--text-muted)]">Perpanjangan Otomatis</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {subscription?.auto_renew ? '✅ Aktif' : '❌ Nonaktif'}
            </p>
          </div>
        </div>

        {/* Actions */}
        {!isFree && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button to="/subscription" variant="primary" className="flex-1">
              🔄 Upgrade / Ganti Paket
            </Button>
            {subscription?.auto_renew && (
              <Button variant="danger" className="flex-1" onClick={() => setCancelModal(true)}>
                ✖️ Batalkan Langganan
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Current Features */}
      {!isFree && currentPlan && (
        <div className="mt-8">
          <h2 className="section-title">✨ Fitur Aktif Anda</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {currentPlan.features.filter((f) => f.included).map((f, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl bg-leaf-800/10 px-4 py-2.5">
                <span className="text-leaf-500">✓</span>
                <span className="text-sm text-[var(--text-secondary)]">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing History */}
      <div className="mt-8">
        <h2 className="section-title">🧾 Riwayat Pembayaran</h2>
        {billing.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[var(--border-primary)] bg-[var(--bg-card)] p-8 text-center backdrop-blur-sm">
            <p className="text-4xl">📋</p>
            <p className="mt-2 text-sm text-leaf-900/60">Belum ada riwayat pembayaran</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {billing.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] px-5 py-4 shadow-soft backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className={cx(
                    'flex h-10 w-10 items-center justify-center rounded-xl text-lg',
                    b.status === 'paid' ? 'bg-leaf-100' : 'bg-amber-100',
                  )}>
                    {b.status === 'paid' ? '✅' : '⏳'}
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{b.description}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatDate(b.date)}</p>
                  </div>
                </div>
                <p className="text-lg font-extrabold text-leaf-700">{formatRupiah(b.amount)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <Modal open={cancelModal} onClose={() => setCancelModal(false)} title="⚠️ Batalkan Langganan?">
        <div className="space-y-4">
          <div className="rounded-xl bg-rose-50 px-4 py-4 text-center">
            <p className="text-4xl">😢</p>
            <p className="mt-2 text-sm text-rose-700">
              Anda akan kehilangan akses ke fitur premium di akhir periode berbayar.
            </p>
          </div>

          <div className="rounded-xl bg-leaf-50 px-4 py-3">
            <p className="text-sm text-leaf-900/70">
              <strong>Catatan:</strong> Langganan akan tetap aktif hingga akhir periode yang sudah dibayar.
              Perpanjangan otomatis akan dimatikan.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setCancelModal(false)}>
              Pertahankan
            </Button>
            <Button variant="danger" className="flex-1" loading={cancelling} onClick={handleCancel}>
              Ya, Batalkan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
