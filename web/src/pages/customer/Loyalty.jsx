import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loyaltyApi } from '../../services/api/loyalty'
import { formatDateTime, cx } from '../../utils/format'
import Loading from '../../components/ui/Loading'

const tierColors = {
  bronze: { bg: 'from-amber-100 to-orange-100', text: 'text-amber-800', ring: 'ring-amber-300' },
  silver: { bg: 'from-gray-100 to-slate-100', text: 'text-slate-700', ring: 'ring-gray-300' },
  gold: { bg: 'from-yellow-100 to-amber-100', text: 'text-amber-800', ring: 'ring-yellow-300' },
  platinum: { bg: 'from-violet-100 to-indigo-100', text: 'text-violet-800', ring: 'ring-violet-300' },
}

export default function Loyalty() {
  const [profile, setProfile] = useState(null)
  const [tiers, setTiers] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      loyaltyApi.getProfile(),
      loyaltyApi.getTiers(),
      loyaltyApi.getHistory(),
    ]).then(([p, t, h]) => {
      setProfile(p.data)
      setTiers(t.data)
      setHistory(h.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <Loading label="Memuat data loyalitas..." />

  const currentTier = tiers.find((tier) => tier.id === profile?.tier) || tiers[0]
  const nextTier = tiers[tiers.indexOf(currentTier) + 1]
  const progress = nextTier
    ? Math.min(100, ((profile.points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100)
    : 100
  const colors = tierColors[profile?.tier] || tierColors.bronze

  return (
    <div className="page-container max-w-3xl">
      <div className="animate-fade-up">
        <span className="page-eyebrow">Apresiasi untukmu</span>
        <h1 className="page-title">Tanamanku Rewards</h1>
        <p className="page-subtitle">Kumpulkan poin, naik tier, tukar hadiah</p>
      </div>

      {/* Points Card */}
      <div className={cx('mt-8 rounded-3xl bg-gradient-to-br p-6 sm:p-8 shadow-lift', colors.bg)}>
        <div className="flex items-center gap-3">
          <span className="text-5xl">{currentTier?.icon}</span>
          <div>
            <p className={cx('text-sm font-semibold opacity-70', colors.text)}>Tier Anda</p>
            <p className={cx('text-2xl font-extrabold', colors.text)}>{currentTier?.name}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-baseline gap-2">
            <span className={cx('text-5xl font-extrabold', colors.text)}>{profile.points.toLocaleString('id-ID')}</span>
            <span className={cx('text-lg font-semibold', colors.text)}>poin</span>
          </div>
          <p className={cx('mt-1 text-sm opacity-70', colors.text)}>
            Total terkumpul: {profile.totalEarned.toLocaleString('id-ID')} poin
          </p>
        </div>

        {/* Tier Progress */}
        {nextTier && (
          <div className="mt-6">
            <div className={cx('flex items-center justify-between text-xs opacity-70', colors.text)}>
              <span>{currentTier.icon} {currentTier.name}</span>
              <span>{nextTier.icon} {nextTier.name} ({nextTier.minPoints.toLocaleString('id-ID')} poin)</span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-white shadow-sm transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className={cx('mt-1 text-xs opacity-60', colors.text)}>
              {(nextTier.minPoints - profile.points).toLocaleString('id-ID')} poin lagi ke {nextTier.name}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <Link
          to="/loyalty/redeem"
          className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 shadow-soft backdrop-blur-sm transition-all hover:shadow-lift hover:-translate-y-0.5 text-center"
        >
          <span className="text-3xl">🎁</span>
          <p className="mt-2 font-semibold text-[var(--text-primary)]">Tukar Poin</p>
          <p className="text-xs text-[var(--text-muted)]">Tukar dengan voucher & hadiah</p>
        </Link>
        <Link
          to="/loyalty/history"
          className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-5 shadow-soft backdrop-blur-sm transition-all hover:shadow-lift hover:-translate-y-0.5 text-center"
        >
          <span className="text-3xl">📊</span>
          <p className="mt-2 font-semibold text-[var(--text-primary)]">Riwayat Poin</p>
          <p className="text-xs text-[var(--text-muted)]">Lihat transaksi poin</p>
        </Link>
      </div>

      {/* How to Earn */}
      <div className="mt-8">
        <h2 className="section-title">💰 Cara Mendapatkan Poin</h2>
        <div className="mt-4 space-y-3">
          {[
            { icon: '🛒', action: 'Belanja produk', points: '1 poin / Rp1.000', color: 'bg-leaf-50' },
            { icon: '⭐', action: 'Review produk', points: '25-100 poin', color: 'bg-sun-50' },
            { icon: '🪴', action: 'Log perawatan tanaman', points: '10-50 poin/hari', color: 'bg-sky-50' },
            { icon: '💬', action: 'Post di komunitas', points: '25 poin', color: 'bg-violet-50' },
            { icon: '🏆', action: 'Milestone pencapaian', points: 'Bonus spesial', color: 'bg-amber-50' },
          ].map((item, i) => (
            <div key={i} className={cx('flex items-center gap-4 rounded-xl px-4 py-3', item.color)}>
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{item.action}</p>
              </div>
              <p className="text-sm font-bold text-leaf-700">{item.points}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tier Benefits */}
      <div className="mt-8">
        <h2 className="section-title">🎯 Tier Benefits</h2>
        <div className="mt-4 space-y-4">
          {tiers.map((tier) => {
            const tc = tierColors[tier.id] || tierColors.bronze
            const isActive = profile.tier === tier.id
            return (
              <div
                key={tier.id}
                className={cx(
                  'rounded-2xl border-2 p-5 transition-all',
                  isActive ? `border-current ${tc.ring} shadow-soft` : 'border-[var(--border-primary)] bg-[var(--bg-card)]',
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{tier.icon}</span>
                  <div>
                    <p className={cx('font-bold', isActive ? tc.text : 'text-[var(--text-primary)]')}>{tier.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">≥ {tier.minPoints.toLocaleString('id-ID')} poin</p>
                  </div>
                  {isActive && (
                    <span className={cx('ml-auto rounded-full px-3 py-1 text-xs font-bold', tc.bg, tc.text)}>
                      Tier Anda
                    </span>
                  )}
                </div>
                <ul className="mt-3 space-y-1">
                  {tier.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <span className="mt-0.5 text-leaf-500">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent History */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="section-title">📋 Aktivitas Terakhir</h2>
          <Link to="/loyalty/history" className="text-sm font-semibold text-leaf-700 hover:text-leaf-800">
            Lihat semua →
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {history.slice(0, 5).map((h) => (
            <div key={h.id} className="flex items-center gap-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] px-4 py-3">
              <span className={cx(
                'flex h-10 w-10 items-center justify-center rounded-xl text-lg',
                h.type === 'earn' ? 'bg-leaf-100' : h.type === 'redeem' ? 'bg-rose-100' : 'bg-sun-100',
              )}>
                {h.type === 'earn' ? '📈' : h.type === 'redeem' ? '🎁' : '🎉'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{h.description}</p>
                <p className="text-xs text-[var(--text-muted)]">{formatDateTime(h.createdAt)}</p>
              </div>
              <span className={cx(
                'text-sm font-bold',
                h.points > 0 ? 'text-leaf-600' : 'text-rose-600',
              )}>
                {h.points > 0 ? '+' : ''}{h.points.toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
