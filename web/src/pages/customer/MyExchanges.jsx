import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { exchangeApi } from '../../services/api/exchange'
import { EXCHANGE_STATUS } from '../../types/constants'
import { formatDate, timeAgo, cx } from '../../utils/format'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

export default function MyExchanges() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [exchanges, setExchanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('received')

  useEffect(() => {
    exchangeApi.getMyExchanges().then((res) => {
      setExchanges(res.data)
      setLoading(false)
    })
  }, [])

  // Separate into received (on my listings) and sent (by me)
  const received = exchanges.filter((e) => e.listing && user && e.listing.user_id !== e.offererId)
  const sent = exchanges.filter((e) => user && e.offererId === user?.id)

  const tabs = [
    { value: 'received', label: '📨 Diterima', count: received.length },
    { value: 'sent', label: '📤 Dikirim', count: sent.length },
  ]

  const displayed = tab === 'received' ? received : sent

  const handleRespond = async (exchangeId, status) => {
    try {
      await exchangeApi.respondExchange(exchangeId, status)
      showToast(status === 'accepted' ? 'Tawaran diterima! 🎉' : 'Tawaran ditolak')
      // Update local state
      setExchanges((prev) =>
        prev.map((e) =>
          e.id === exchangeId ? { ...e, status, respondedAt: new Date().toISOString() } : e,
        ),
      )
    } catch {
      showToast('Gagal memproses. Coba lagi.', 'error')
    }
  }

  if (loading) return <Loading label="Memuat tawaran..." />

  return (
    <div className="page-container max-w-3xl">
      <div className="animate-fade-up">
        <span className="page-eyebrow">Negosiasi antar pekebun</span>
        <h1 className="page-title">Tawaran Saya</h1>
        <p className="page-subtitle">{exchanges.length} total tawaran</p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cx(
              'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
              tab === t.value ? 'bg-leaf-600 text-white' : 'bg-white text-leaf-900/60 ring-1 ring-leaf-200 hover:bg-leaf-50',
            )}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-6 space-y-4">
        {displayed.length === 0 ? (
          <EmptyState
            icon="💬"
            title={tab === 'received' ? 'Belum ada tawaran masuk' : 'Belum ada tawaran dikirim'}
            description={tab === 'received' ? 'Tawaran dari pengguna lain akan muncul di sini' : 'Kirim tawaran ke listing yang menarik'}
            actionLabel="Jelajahi Listing"
            actionTo="/plant-exchange"
          />
        ) : (
          displayed.map((e) => {
            const meta = EXCHANGE_STATUS[e.status] || { label: e.status, icon: '❓', badge: 'bg-gray-100 text-gray-500' }
            const isReceived = tab === 'received'
            const canRespond = isReceived && e.status === 'pending'

            return (
              <div key={e.id} className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-soft">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link to={`/plant-exchange/${e.listingId}`} className="font-bold text-leaf-950 hover:text-leaf-700 transition">
                      {e.listing?.title || 'Listing'}
                    </Link>
                    <p className="text-xs text-leaf-900/50">
                      {isReceived ? `Oleh ${e.offerer?.name}` : `Tawaran ke listing`}
                    </p>
                  </div>
                  <Badge className={meta.badge}>{meta.icon} {meta.label}</Badge>
                </div>

                {/* Message */}
                {e.message && (
                  <div className="mt-3 rounded-xl bg-leaf-50 px-4 py-3">
                    <p className="text-[11px] text-leaf-900/40 mb-1">Pesan:</p>
                    <p className="text-sm text-leaf-900/70 italic">"{e.message}"</p>
                  </div>
                )}

                {/* Date */}
                <div className="mt-3 text-xs text-leaf-900/40">
                  📅 {timeAgo(e.createdAt)}
                  {e.respondedAt && <> · Direspons {timeAgo(e.respondedAt)}</>}
                </div>

                {/* Actions for received pending */}
                {canRespond && (
                  <div className="mt-4 flex gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleRespond(e.id, 'accepted')}
                    >
                      ✅ Terima
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRespond(e.id, 'rejected')}
                    >
                      ✖️ Tolak
                    </Button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
