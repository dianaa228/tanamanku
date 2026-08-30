import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { exchangeApi } from '../../services/api/exchange'
import { LISTING_TYPES, EXCHANGE_STATUS } from '../../types/constants'
import { formatRupiah, formatDate, timeAgo, cx } from '../../utils/format'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Loading from '../../components/ui/Loading'

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [offerModalOpen, setOfferModalOpen] = useState(false)
  const [offerMessage, setOfferMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    exchangeApi.getListing(id).then((res) => {
      setListing(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const isOwner = user && listing && user.id === listing.userId

  const handleOffer = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    setSubmitting(true)
    try {
      await exchangeApi.makeOffer(id, offerMessage || undefined)
      setOfferModalOpen(false)
      setOfferMessage('')
      showToast('Tawaran berhasil terkirim! 🎉')
      // Refresh listing
      const res = await exchangeApi.getListing(id)
      setListing(res.data)
    } catch {
      showToast('Gagal mengirim tawaran. Coba lagi.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loading label="Memuat detail listing..." />
  if (!listing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-6xl">🔍</p>
        <p className="mt-4 text-lg font-bold text-leaf-950">Listing tidak ditemukan</p>
        <Button to="/plant-exchange" className="mt-4">← Kembali</Button>
      </div>
    )
  }

  const typeInfo = LISTING_TYPES.find((t) => t.value === listing.type)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Back link */}
      <Link to="/plant-exchange" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-leaf-700 hover:text-leaf-800 transition">
        ← Kembali ke Plant Exchange
      </Link>

      <div className="rounded-3xl border border-[var(--border-primary)] bg-[var(--bg-card)] shadow-soft backdrop-blur-sm overflow-hidden">
        {/* Image placeholder */}
        <div className="h-56 sm:h-72 bg-gradient-to-br from-leaf-100 to-leaf-50 flex items-center justify-center text-8xl">
          {listing.species?.scientific_name?.[0]?.toUpperCase() || '🌱'}
        </div>

        <div className="px-6 py-6 sm:px-8 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Badge className={cx(
                listing.type === 'sell' ? 'bg-sun-100 text-sun-700' : 'bg-violet-100 text-violet-700',
              )}>
                {typeInfo?.icon} {typeInfo?.label}
              </Badge>
              <h1 className="display mt-3 text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">{listing.title}</h1>
              <p className="mt-1 text-sm italic text-[var(--text-secondary)]">{listing.species?.name || 'Tanaman hias'}</p>
            </div>
            {listing.price != null && (
              <div className="text-right">
                <p className="text-2xl font-extrabold text-leaf-700">{formatRupiah(listing.price)}</p>
                <p className="text-[11px] text-leaf-900/40">harga jual</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-leaf-800/10 px-4 py-3">
              <span className="text-xl">👤</span>
              <div>
                <p className="text-[11px] text-[var(--text-muted)]">Pemilik</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{listing.user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-leaf-800/10 px-4 py-3">
              <span className="text-xl">💬</span>
              <div>
                <p className="text-[11px] text-[var(--text-muted)]">Tawaran</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{listing.offersCount} tawaran</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Deskripsi</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] whitespace-pre-line">{listing.description}</p>
          </div>

          {/* Posted date */}
          <div className="rounded-xl bg-leaf-800/10 px-4 py-2.5 text-xs text-[var(--text-muted)]">
            📅 Diposting {formatDate(listing.createdAt)}
          </div>

          {/* Action */}
          {isOwner ? (
            <div className="rounded-xl bg-sky-800/10 px-4 py-3 text-center">
              <p className="text-sm font-semibold text-sky-700">📋 Ini adalah listing Anda</p>
              <p className="text-xs text-sky-600/60 mt-1">Kelola tawaran di halaman "Listing Saya"</p>
            </div>
          ) : (
            <Button onClick={() => setOfferModalOpen(true)} size="lg" className="w-full">
              {listing.type === 'sell' ? '💰 Beli / Tawar' : '🔄 Tawarkan Tukaran'}
            </Button>
          )}
        </div>
      </div>

      {/* ── Offer Modal ── */}
      <Modal open={offerModalOpen} onClose={() => setOfferModalOpen(false)} title="💬 Kirim Tawaran">
        <form onSubmit={handleOffer} className="space-y-4">
          {/* Listing summary */}
          <div className="rounded-xl bg-leaf-800/10 px-4 py-3">
            <p className="text-sm font-semibold text-[var(--text-primary)]">{listing.title}</p>
            <p className="text-xs text-[var(--text-muted)]">
              {listing.price != null ? formatRupiah(listing.price) : 'Tukar Tukar'} · {listing.user?.name}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--text-primary)]">
              {listing.type === 'sell' ? 'Pesan (opsional)' : 'Tawarkan tanaman Anda'}
            </label>
            <textarea
              value={offerMessage}
              onChange={(e) => setOfferMessage(e.target.value)}
              rows={4}
              placeholder={
                listing.type === 'sell'
                  ? 'Tulis pesan untuk penjual...'
                  : 'Ceritakan tanaman apa yang ingin Anda tawarkan untuk ditukar...'
              }
              className="w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-leaf-400 focus:outline-none resize-none"
            />
          </div>

          <Button type="submit" loading={submitting} size="lg" className="w-full">
            📨 Kirim Tawaran
          </Button>
        </form>
      </Modal>
    </div>
  )
}
