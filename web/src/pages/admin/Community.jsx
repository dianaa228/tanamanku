import { useEffect, useState } from 'react'
import { adminApi } from '../../services/api/admin'
import { formatDateTime } from '../../utils/format'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'
import EmptyState from '../../components/ui/EmptyState'

export default function AdminCommunity() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getReports()
      .then((res) => setReports(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const resolve = async (id) => {
    await adminApi.resolveReport(id)
    setReports(reports.map((r) => r.id === id ? { ...r, status: 'resolved' } : r))
  }

  if (loading) return <Loading />

  const openReports = reports.filter((r) => r.status === 'open')
  const resolvedReports = reports.filter((r) => r.status === 'resolved')

  return (
    <div className="space-y-6">
      {/* Open reports */}
      <div>
        <h2 className="font-bold text-[var(--text-primary)]">🔴 Laporan Terbuka ({openReports.length})</h2>
        {openReports.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon="✅" title="Tidak ada laporan terbuka" description="Semua laporan sudah ditangani" />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {openReports.map((r) => (
              <div key={r.id} className="rounded-2xl border border-amber-200 bg-amber-800/10 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-100 text-amber-800">🔴 Terbuka</Badge>
                      <span className="text-xs text-[var(--text-muted)]">{formatDateTime(r.created_at)}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                      Dilaporkan oleh: {r.reporter?.name || 'Anonymous'}
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">Alasan: {r.reason}</p>
                    {r.reportable?.content && (
                      <p className="mt-2 rounded-xl bg-[var(--bg-input)] px-4 py-2 text-sm text-[var(--text-secondary)] border border-[var(--border-primary)]">
                        "{r.reportable.content}"
                      </p>
                    )}
                  </div>
                  <Button size="sm" variant="soft" onClick={() => resolve(r.id)}>
                    ✅ Selesaikan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved */}
      {resolvedReports.length > 0 && (
        <div>
          <h2 className="font-bold text-[var(--text-primary)]">✅ Selesai ({resolvedReports.length})</h2>
          <div className="mt-4 space-y-3">
            {resolvedReports.map((r) => (
              <div key={r.id} className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-4 opacity-60">
                <div className="flex items-center gap-2">
                  <Badge className="bg-leaf-100 text-leaf-700">✅ Selesai</Badge>
                  <span className="text-xs text-[var(--text-muted)]">{formatDateTime(r.created_at)}</span>
                </div>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{r.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
