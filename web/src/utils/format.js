export const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

export const formatDateTime = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export const timeAgo = (iso) => {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  const ranges = [
    { limit: 60, text: 'baru saja' },
    { limit: 3600, divisor: 60, text: 'menit' },
    { limit: 86400, divisor: 3600, text: 'jam' },
    { limit: 604800, divisor: 86400, text: 'hari' },
    { limit: 2629800, divisor: 604800, text: 'minggu' },
    { limit: 31557600, divisor: 2629800, text: 'bulan' },
  ]
  for (const r of ranges) {
    if (seconds < r.limit) {
      if (!r.divisor) return r.text
      const n = Math.floor(seconds / r.divisor)
      return `${n} ${r.text} lalu`
    }
  }
  const years = Math.floor(seconds / 31557600)
  return `${years} tahun lalu`
}

export const cx = (...classes) => classes.filter(Boolean).join(' ')

export const daysUntil = (iso) => Math.ceil((new Date(iso) - Date.now()) / 86400000)

export const durationText = (min) => {
  if (!min) return '—'
  if (min < 60) return `${min} menit`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h}j ${m}m` : `${h} jam`
}
