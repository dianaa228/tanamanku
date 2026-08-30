import { api, apiMode, delay } from './client'

// ===== Mock Data =====

const mockReports = [
  {
    id: 1,
    reportable_type: 'post',
    reportable_id: 5,
    reporter_id: 2,
    reason: 'Konten spam atau promosi berlebihan',
    status: 'open',
    created_at: '2026-08-20T10:00:00',
  },
  {
    id: 2,
    reportable_type: 'product',
    reportable_id: 3,
    reporter_id: 3,
    reason: 'Deskripsi produk tidak sesuai',
    status: 'reviewed',
    created_at: '2026-08-19T14:30:00',
  },
]

// ===== Helpers =====

const mapReport = (r) => ({
  id: r.id,
  reportableType: r.reportable_type,
  reportableId: r.reportable_id,
  reporterId: r.reporter_id,
  reason: r.reason,
  status: r.status,
  createdAt: r.created_at,
})

// ===== API =====

export const reportsApi = {
  createReport: async ({ reportableType, reportableId, reason }) => {
    if (apiMode() === 'api') {
      const res = await api.post('/reports', {
        reportable_type: reportableType,
        reportable_id: reportableId,
        reason,
      })
      return { success: true, message: 'Laporan berhasil dikirim', data: mapReport(res.data?.data || res.data) }
    }
    await delay(400)
    const report = {
      id: Date.now(),
      reportable_type: reportableType,
      reportable_id: reportableId,
      reporter_id: 1,
      reason,
      status: 'open',
      created_at: new Date().toISOString(),
    }
    mockReports.push(report)
    return { success: true, message: 'Laporan berhasil dikirim', data: mapReport(report) }
  },

  getMyReports: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/reports/mine')
      const items = (res.data?.data || res.data || []).map(mapReport)
      return { success: true, message: 'Laporan saya dimuat', data: items }
    }
    await delay()
    return { success: true, message: 'Laporan saya dimuat', data: mockReports.map(mapReport) }
  },
}
