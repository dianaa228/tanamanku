import { useEffect, useState } from 'react'
import { loyaltyApi } from '../../services/api/loyalty'
import { REWARD_TYPES } from '../../types/constants'
import { useToast } from '../../context/ToastContext'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import { cx } from '../../utils/format'

export default function LoyaltyRedeem() {
  const { showToast } = useToast()
  const [profile, setProfile] = useState(null)
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [confirmModal, setConfirmModal] = useState(null)
  const [redeeming, setRedeeming] = useState(false)
  const [successModal, setSuccessModal] = useState(null)

  useEffect(() => {
    Promise.all([
      loyaltyApi.getProfile(),
      loyaltyApi.getRewards(filter ? { type: filter } : {}),
    ]).then(([p, r]) => {
      setProfile(p.data)
      setRewards(r.data)
      setLoading(false)
    })
  }, [filter])

  const handleRedeem = async () => {
    if (!confirmModal) return
    setRedeeming(true)
    try {
      const res = await loyaltyApi.redeemReward(confirmModal.id)
      setConfirmModal(null)
      setSuccessModal({ ...confirmModal, code: res.data.voucher_code })
      // Refresh profile
      const p = await loyaltyApi.getProfile()
      setProfile(p.data)
      showToast('Reward berhasil ditukar! 🎉')
    } catch (err) {
      showToast(err?.response?.data?.message || 'Gagal menukar reward', 'error')
    } finally {
      setRedeeming(false)
    }
  }

  if (loading) return <Loading label="Memuat rewards..." />

  return (
    <div className="page-container max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up">
        <div>
          <span className="page-eyebrow">Hadiah dari poinmu</span>
          <h1 className="page-title">Tukar Poin</h1>
          <p className="page-subtitle">Tukar poin Anda dengan voucher dan hadiah menarik</p>
        </div>
        <div className="shrink-0 rounded-2xl bg-leaf-800/20 px-5 py-3 text-center">
          <p className="text-xs text-[var(--text-muted)]">Poin tersedia</p>
          <p className="text-2xl font-extrabold text-leaf-400">{profile?.points.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('')}
          className={cx(
            'rounded-full px-4 py-2 text-sm font-semibold transition',
            !filter ? 'bg-leaf-600 text-white shadow-soft' : 'bg-[var(--bg-card)] text-[var(--text-muted)] ring-1 ring-[var(--border-primary)] hover:bg-[var(--bg-card-hover)]',
          )}
        >
          Semua
        </button>
        {REWARD_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={cx(
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              filter === t.value ? 'bg-leaf-600 text-white shadow-soft' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50',
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="mt-8">
        {rewards.length === 0 ? (
          <EmptyState
            icon="🎁"
            title="Belum ada reward"
            description="Reward akan segera tersedia"
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {rewards.map((r) => {
              const canAfford = profile?.points >= r.pointsCost
              return (
                <div
                  key={r.id}
                  className={cx(
                    'rounded-2xl border bg-[var(--bg-card)] p-5 shadow-soft backdrop-blur-sm transition-all',
                    canAfford ? 'border-[var(--border-primary)] hover:shadow-lift hover:-translate-y-0.5' : 'border-[var(--border-primary)] opacity-60',
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">{r.icon}</span>
                    <Badge className={canAfford ? 'bg-leaf-100 text-leaf-700' : 'bg-gray-100 text-gray-500'}>
                      {r.type}
                    </Badge>
                  </div>

                  <h3 className="mt-3 text-lg font-semibold text-[var(--text-primary)]">{r.name}</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">{r.description}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Biaya poin</p>
                      <p className={cx('text-xl font-extrabold', canAfford ? 'text-leaf-700' : 'text-gray-400')}>
                        {r.pointsCost.toLocaleString('id-ID')} poin
                      </p>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">Stok: {r.stock}</p>
                  </div>

                  <Button
                    variant={canAfford ? 'primary' : 'secondary'}
                    size="sm"
                    className="w-full mt-4"
                    disabled={!canAfford}
                    onClick={() => setConfirmModal(r)}
                  >
                    {canAfford ? '🎁 Tukar Sekarang' : 'Poin Kurang'}
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <Modal open={!!confirmModal} onClose={() => setConfirmModal(null)} title="✅ Konfirmasi Penukaran">
        {confirmModal && (
          <div className="space-y-4">
            <div className="rounded-xl bg-leaf-800/10 px-4 py-4 text-center">
              <span className="text-4xl">{confirmModal.icon}</span>
              <p className="mt-2 font-semibold text-[var(--text-primary)]">{confirmModal.name}</p>
              <p className="text-sm text-[var(--text-secondary)]">{confirmModal.description}</p>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] px-4 py-3">
              <span className="text-sm text-[var(--text-secondary)]">Poin Anda saat ini</span>
              <span className="font-bold text-[var(--text-primary)]">{profile?.points.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] px-4 py-3">
              <span className="text-sm text-[var(--text-secondary)]">Biaya penukaran</span>
              <span className="font-bold text-rose-600">-{confirmModal.pointsCost.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-leaf-800/10 px-4 py-3">
              <span className="text-sm font-semibold text-[var(--text-primary)]">Sisa poin</span>
              <span className="font-bold text-leaf-700">
                {(profile?.points - confirmModal.pointsCost).toLocaleString('id-ID')}
              </span>
            </div>

            <Button onClick={handleRedeem} loading={redeeming} size="lg" className="w-full">
              ✅ Ya, Tukarkan
            </Button>
          </div>
        )}
      </Modal>

      {/* Success Modal */}
      <Modal open={!!successModal} onClose={() => setSuccessModal(null)} title="🎉 Berhasil Ditukar!">
        {successModal && (
          <div className="space-y-4 text-center">
            <span className="text-6xl">{successModal.icon}</span>
            <p className="text-lg font-semibold text-forest">{successModal.name}</p>
            {successModal.code && (
              <div className="rounded-xl bg-leaf-50 px-4 py-4">
                <p className="text-xs text-leaf-900/40">Kode voucher Anda:</p>
                <p className="mt-1 text-2xl font-extrabold tracking-wider text-leaf-700 font-mono">
                  {successModal.code}
                </p>
              </div>
            )}
            <p className="text-sm text-leaf-900/60">
              Gunakan kode ini saat checkout untuk mendapatkan manfaat reward.
            </p>
            <Button onClick={() => setSuccessModal(null)} size="lg" className="w-full">
              👍 Tutup
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
