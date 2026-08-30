import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loyaltyApi } from '../../services/api/loyalty'
import { formatDateTime, cx } from '../../utils/format'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'

const historyTypes = [
  { value: '', label: 'Semua' },
  { value: 'earn', label: '📈 Masuk' },
  { value: 'redeem', label: '🎁 Tukar' },
  { value: 'bonus', label: '🎉 Bonus' },
]

export default function LoyaltyHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('')

  useEffect(() => {
    setLoading(true)
    loyaltyApi.getHistory(tab ? { type: tab } : {}).then((res) => {
      setHistory(res.data)
      setLoading(false)
    })
  }, [tab])

  const totalEarned = history.filter((h) => h.points > 0).reduce((sum, h) => sum + h.points, 0)
  const totalRedeemed = history.filter((h) => h.points < 0).reduce((sum, h) => sum + Math.abs(h.points), 0)

  return (
    <div className="page-container max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up">
        <div>
          <span className="page-eyebrow">Lacak poinmu</span>
          <h1 className="page-title">Riwayat Poin</h1>
          <p className="page-subtitle">{history.length} transaksi</p>
        </div>
        <Link
          to="/loyalty"
          className="shrink-0 text-sm font-semibold text-leaf-700 hover:text-leaf-800"
        >
          ← Kembali ke Rewards
        </Link>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-leaf-50 px-4 py-3 text-center">
          <p className="text-xs text-leaf-900/40">Total Masuk</p>
          <p className="text-lg font-extrabold text-leaf-600">+{totalEarned.toLocaleString('id-ID')}</p>
        </div>
        <div className="rounded-2xl bg-rose-50 px-4 py-3 text-center">
          <p className="text-xs text-leaf-900/40">Total Tukar</p>
          <p className="text-lg font-extrabold text-rose-600">-{totalRedeemed.toLocaleString('id-ID')}</p>
        </div>
        <div className="rounded-2xl bg-sky-50 px-4 py-3 text-center">
          <p className="text-xs text-leaf-900/40">Selisih</p>
          <p className="text-lg font-extrabold text-sky-700">
            {(totalEarned - totalRedeemed) > 0 ? '+' : ''}{(totalEarned - totalRedeemed).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {historyTypes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cx(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
              tab === t.value ? 'bg-leaf-600 text-white' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* History List */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <Loading label="Memuat riwayat..." />
        ) : history.length === 0 ? (
          <EmptyState
            icon="📋"
            title="Belum ada riwayat"
            description="Mulai belanja atau berinteraksi untuk mengumpulkan poin"
          />
        ) : (
          history.map((h) => (
            <div key={h.id} className="flex items-center gap-4 rounded-2xl border border-leaf-100 bg-white px-5 py-4 shadow-soft">
              <span className={cx(
                'flex h-12 w-12 items-center justify-center rounded-2xl text-xl',
                h.type === 'earn' ? 'bg-leaf-100' : h.type === 'redeem' ? 'bg-rose-100' : 'bg-sun-100',
              )}>
                {h.type === 'earn' ? '📈' : h.type === 'redeem' ? '🎁' : '🎉'}
              </span>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-leaf-950">{h.description}</p>
                <p className="text-xs text-leaf-900/40">{formatDateTime(h.createdAt)}</p>
              </div>

              <span className={cx(
                'text-lg font-extrabold whitespace-nowrap',
                h.points > 0 ? 'text-leaf-600' : 'text-rose-600',
              )}>
                {h.points > 0 ? '+' : ''}{h.points.toLocaleString('id-ID')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
