import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gardenApi } from '../../services/api/garden'
import { apiMode } from '../../services/api/client'
import { finderQuestions as mockQuestions } from '../../services/api/mock-data'
import { CARE_LEVEL } from '../../types/constants'
import Button from '../../components/ui/Button'
import ProductVisual from '../../components/product/ProductVisual'
import { useToast } from '../../context/ToastContext'
import { cx } from '../../utils/format'

const QUESTION_ICONS = ['🏠', '🧑‍🌾', '🎯', '⏰']

// Lengkapi opsi dari backend yang mungkin tanpa icon/desc
const decorate = (qs) =>
  qs.map((q, i) => ({
    ...q,
    icon: q.icon || QUESTION_ICONS[i] || '❓',
    options: (q.options || []).map((o) => ({
      ...o,
      icon: o.icon || '🌱',
      desc: o.desc || '',
    })),
  }))

export default function PlantFinder() {
  const { showToast } = useToast()
  const [questions, setQuestions] = useState(mockQuestions)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [resultStarted, setResultStarted] = useState(false)

  useEffect(() => {
    if (apiMode() === 'api') {
      gardenApi.finderQuestions().then((res) => {
        if (res.data?.length) setQuestions(decorate(res.data))
      }).catch(() => {})
    }
  }, [])

  const question = questions[step]
  const total = questions.length
  const progress = ((step + (results ? 1 : 0)) / total) * 100

  const choose = async (opt) => {
    const next = { ...answers, [question.id]: opt }
    setAnswers(next)
    if (step < total - 1) {
      setStep(step + 1)
      return
    }
    setResultStarted(true)
    const values = Object.fromEntries(Object.entries(next).map(([k, v]) => [k, v.value]))
    try {
      const res = await gardenApi.finderRecommend(values)
      setResults(res.data)
    } catch {
      showToast('Gagal mendapatkan rekomendasi. Coba lagi.', 'error')
      setResultStarted(false)
    }
  }

  const restart = () => {
    setStep(0)
    setAnswers({})
    setResults(null)
    setResultStarted(false)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-leaf-100 px-4 py-1.5 text-xs font-bold text-leaf-700">
          💡 Plant Finder — Rekomendasi Cerdas
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-leaf-950 sm:text-4xl">Tanaman apa yang cocok untukmu?</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-leaf-900/50">
          Jawab 4 pertanyaan singkat — mesin rekomendasi kami akan menemukan tanaman ideal untuk rumahmu.
        </p>
      </div>

      {/* Progress */}
      <div className="mx-auto mt-8 max-w-md">
        <div className="h-2 overflow-hidden rounded-full bg-leaf-100">
          <div className="h-full rounded-full bg-gradient-to-r from-leaf-500 to-leaf-600 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-center text-xs font-semibold text-leaf-900/50">
          {results ? 'Hasil siap!' : `Langkah ${step + 1} dari ${total}`}
        </p>
      </div>

      {/* Hasil */}
      {results ? (
        <div className="mt-8 animate-fade-up">
          <div className="rounded-3xl bg-leaf-50 p-6 text-center">
            <div className="animate-float text-5xl">🎯</div>
            <h2 className="mt-3 text-2xl font-extrabold text-leaf-950">Tanaman terbaik untukmu</h2>
            <p className="mt-1 text-sm text-leaf-900/55">Berdasarkan jawabanmu: {Object.values(answers).map((a) => a.label).join(' · ')}</p>
          </div>
          <div className="mt-6 space-y-4">
            {results.map((species, i) => {
              const care = CARE_LEVEL[species.careLevel]
              return (
                <div
                  key={species.id}
                  className={cx(
                    'flex flex-col gap-5 rounded-3xl border bg-white p-5 shadow-soft transition hover:shadow-lift sm:flex-row',
                    i === 0 ? 'border-leaf-400 ring-2 ring-leaf-200' : 'border-leaf-100',
                  )}
                >
                  <ProductVisual emoji={species.emoji} gradient={species.gradient} className="h-32 w-full shrink-0 rounded-2xl sm:w-32" emojiClassName="text-6xl" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {i === 0 && <span className="rounded-full bg-sun-400 px-2.5 py-0.5 text-[11px] font-extrabold text-soil-950">🥇 Paling cocok</span>}
                      {care && <span className={cx('rounded-full px-2.5 py-0.5 text-[11px] font-bold', care.chip)}>{care.icon} Perawatan {care.label}</span>}
                    </div>
                    <h3 className="mt-2 text-xl font-extrabold text-leaf-950">{species.name}</h3>
                    <p className="text-xs italic text-leaf-900/45">{species.scientificName}</p>
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-leaf-900/70">
                      <p>☀️ {species.light}</p>
                      <p>💧 {species.water?.split('(')[0].trim()}</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button to={`/explore?q=${encodeURIComponent(species.name)}`} size="sm">
                        Cari di toko
                      </Button>
                      <Button to={`/product/${species.slug}`} size="sm" variant="ghost">
                        Lihat panduan →
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <Button onClick={restart} variant="secondary">↻ Ulangi kuis</Button>
            <Button to="/explore">Jelajahi semua produk</Button>
          </div>
        </div>
      ) : resultStarted ? (
        <div className="flex flex-col items-center gap-4 py-20">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-leaf-200 border-t-leaf-600" />
            <span className="absolute inset-0 flex items-center justify-center text-xl">🔮</span>
          </div>
          <p className="text-sm font-medium text-leaf-900/60">Menganalisis lingkungan & kebiasaanmu...</p>
        </div>
      ) : (
        /* Pertanyaan */
        <div key={step} className="mt-8 animate-fade-up">
          <div className="text-center">
            <div className="animate-float text-6xl">{question.icon}</div>
            <h2 className="mt-4 text-2xl font-extrabold text-leaf-950">{question.question}</h2>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {question.options.map((opt) => {
              const selected = answers[question.id]?.value === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => choose(opt)}
                  className={cx(
                    'group flex items-start gap-4 rounded-3xl border-2 bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lift',
                    selected ? 'border-leaf-600 bg-leaf-50' : 'border-leaf-100 hover:border-leaf-300',
                  )}
                >
                  <span className="text-3xl transition-transform group-hover:scale-110">{opt.icon}</span>
                  <span>
                    <span className="block font-bold text-leaf-950">{opt.label}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-leaf-900/50">{opt.desc}</span>
                  </span>
                </button>
              )
            })}
          </div>
          <div className="mt-6 text-center">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} className={cx('text-sm font-semibold text-leaf-900/50 hover:text-leaf-700', step === 0 && 'invisible')}>
              ← Kembali
            </button>
          </div>
        </div>
      )}

      <p className="mt-10 text-center text-xs text-leaf-900/40">
        Mesin rekomendasi berbasis aturan — versi produksi berjalan di backend PlantFinderService.
      </p>
    </div>
  )
}
