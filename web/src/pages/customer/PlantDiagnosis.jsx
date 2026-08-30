import { useState } from 'react'
import { diagnosisSymptoms } from '../../services/api/mock-data'
import { gardenApi } from '../../services/api/garden'
import Button from '../../components/ui/Button'
import { useToast } from '../../context/ToastContext'
import { cx } from '../../utils/format'

const severityChip = {
  ringan: 'bg-leaf-100 text-leaf-700',
  sedang: 'bg-sun-100 text-sun-600',
  berat: 'bg-rose-100 text-rose-700',
}

export default function PlantDiagnosis() {
  const [selected, setSelected] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const toggle = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  const diagnose = async () => {
    if (!selected.length) {
      showToast('Pilih minimal satu gejala dulu ya 🌱', 'info')
      return
    }
    setLoading(true)
    try {
      const res = await gardenApi.diagnose(undefined, selected)
      if (!res.data) {
        showToast(res.message || 'Gagal mendiagnosis.', 'info')
      } else {
        setResult(res.data)
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal mendiagnosis. Coba lagi.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setSelected([])
    setResult(null)
  }

  return (
    <div className="page-container max-w-3xl">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-100/60 px-4 py-1.5 text-xs font-bold text-rose-700">
          🩺 Plant Diagnosis — Cek Kesehatan
        </span>
        <h1 className="display mt-4 text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">Tanamanmu kenapa?</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-secondary)]">
          Pilih gejala yang terlihat pada tanamanmu — kami berikan diagnosis awal dan langkah penanganannya.
        </p>
      </div>

      {result ? (
        <div className="mt-8 animate-fade-up">
          <div className={cx('overflow-hidden rounded-[2rem] border-2 bg-white shadow-lift', result.severity === 'berat' ? 'border-rose-200' : 'border-leaf-200')}>
            <div className={cx('p-8 text-center', result.severity === 'berat' ? 'bg-rose-50' : 'bg-leaf-50')}>
              <div className="animate-float text-6xl">{result.emoji}</div>
              <h2 className="mt-3 text-2xl font-semibold text-forest">{result.title}</h2>
              <span className={cx('mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold capitalize', severityChip[result.severity])}>
                Tingkat keparahan: {result.severity}
              </span>
            </div>
            <div className="p-8">
              <p className="leading-relaxed text-leaf-900/75">{result.description}</p>
              <h3 className="mt-6 text-lg font-semibold text-forest">✅ Langkah penanganan</h3>
              <ol className="mt-3 space-y-3">
                {(result.advice || []).map((a, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-2xl bg-leaf-50/70 p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-xs font-bold text-white">{i + 1}</span>
                    <p className="text-sm leading-relaxed text-leaf-900/80">{a}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="secondary" className="flex-1" onClick={reset}>
                  ↻ Diagnosis ulang
                </Button>
                <Button to="/explore?category=pupuk-nutrisi" className="flex-1">
                  Beli solusinya 🛒
                </Button>
              </div>
              <p className="mt-4 text-center text-xs text-leaf-900/40">
                ⚠️ Diagnosis ini bersifat awal. Untuk kepastian, konsultasikan dengan ahli tanaman di komunitas.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {diagnosisSymptoms.map((s) => {
              const active = selected.includes(s.id)
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.id)}
                  className={cx(
                    'flex flex-col items-center gap-2 rounded-3xl border-2 bg-[var(--bg-card)] p-5 text-center backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-lift',
                    active ? 'border-leaf-500 bg-leaf-800/20 shadow-soft' : 'border-[var(--border-primary)]',
                  )}
                >
                  <span className={cx('text-3xl transition-transform', active && 'scale-110')}>{s.icon}</span>
                  <span className={cx('text-xs font-semibold', active ? 'text-leaf-400' : 'text-[var(--text-muted)]')}>{s.label}</span>
                  <span className={cx('flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-bold', active ? 'border-leaf-600 bg-leaf-600 text-white' : 'border-leaf-200')}>
                    {active ? '✓' : ''}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button size="lg" onClick={diagnose} loading={loading} disabled={!selected.length}>
              {loading ? 'Menganalisis...' : '🔍 Diagnosa tanaman'}
            </Button>
            {selected.length > 0 && (
              <p className="text-xs text-leaf-900/50">{selected.length} gejala dipilih — pilih lebih banyak untuk hasil akurat.</p>
            )}
          </div>
        </>
      )}

      <p className="mt-10 text-center text-xs text-leaf-900/40">
        Diagnosis berbasis rule engine — versi produksi berjalan di backend PlantDiagnosisService.
      </p>
    </div>
  )
}
