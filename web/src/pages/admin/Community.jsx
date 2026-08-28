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
        <h2 className="font-bold text-leaf-950">🔴 Laporan Terbuka ({openReports.length})</h2>
        {openReports.length === 0 ? (
          <div className="mt-4">
            <EmptyState icon="✅" title="Tidak ada laporan terbuka" description="Semua laporan sudah ditangani" />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {openReports.map((r) => (
              <div key={r.id} className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-100 text-amber-800">🔴 Terbuka</Badge>
                      <span className="text-xs text-leaf-900/40">{formatDateTime(r.created_at)}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-leaf-950">
                      Dilaporkan oleh: {r.reporter?.name || 'Anonymous'}
                    </p>
                    <p className="mt-1 text-sm text-leaf-900/70">Alasan: {r.reason}</p>
                    {r.reportable?.content && (
                      <p className="mt-2 rounded-xl bg-white px-4 py-2 text-sm text-leaf-900/60 border border-leaf-100">
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
          <h2 className="font-bold text-leaf-950">✅ Selesai ({resolvedReports.length})</h2>
          <div className="mt-4 space-y-3">
            {resolvedReports.map((r) => (
              <div key={r.id} className="rounded-2xl border border-leaf-100 bg-white p-4 opacity-60">
                <div className="flex items-center gap-2">
                  <Badge className="bg-leaf-100 text-leaf-700">✅ Selesai</Badge>
                  <span className="text-xs text-leaf-900/40">{formatDateTime(r.created_at)}</span>
                </div>
                <p className="mt-1 text-sm text-leaf-900/60">{r.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
