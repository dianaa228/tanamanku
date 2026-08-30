import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { gardenApi } from '../../services/api/garden'
import { useToast } from '../../context/ToastContext'
import { formatDate } from '../../utils/format'
import { CARE_TYPES } from '../../types/constants'
import PlantStatus from '../../components/garden/PlantStatus'
import GrowthChart from '../../components/garden/GrowthChart'
import CareReminder from '../../components/garden/CareReminder'
import ProductVisual from '../../components/product/ProductVisual'
import Loading from '../../components/ui/Loading'
import Button from '../../components/ui/Button'
import { cx } from '../../utils/format'

export default function PlantDetail() {
  const { id } = useParams()
  const [plant, setPlant] = useState(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    gardenApi.getPlant(id).then((res) => {
      setPlant(res.data)
      setLoading(false)
    })
  }, [id])

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6"><Loading /></div>
  if (!plant) return null
  const species = plant.species

  const handleDone = async (reminder) => {
    await gardenApi.markCareDone(reminder.userPlantId, reminder.type)
    showToast(`${CARE_TYPES[reminder.type].label} selesai dicatat! 💚`)
    const res = await gardenApi.getPlant(id)
    setPlant(res.data)
  }

  const handleWater = async () => {
    await gardenApi.waterPlant(plant.id)
    showToast('Penyiraman dicatat! Tanaman senang sekali 💚')
    const res = await gardenApi.getPlant(id)
    setPlant(res.data)
  }

  const infoRows = [
    { label: 'Cahaya', value: species.light, icon: '☀️' },
    { label: 'Kebutuhan air', value: species.water, icon: '💧' },
    { label: 'Kelembapan', value: species.humidity, icon: '💨' },
    { label: 'Suhu ideal', value: species.temperature, icon: '🌡️' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link to="/my-garden" className="text-sm font-semibold text-leaf-900/50 hover:text-leaf-700">
        ← Kembali ke My Garden
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[20rem_1fr]">
        {/* Kartu info tanaman */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-leaf-100 bg-white shadow-soft">
            <ProductVisual
              emoji={species.emoji}
              gradient={plant.photoGradient || species.gradient}
              className="h-52 w-full"
              emojiClassName="text-8xl"
            />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h1 className="display text-2xl font-semibold text-forest">{plant.nickname}</h1>
                <PlantStatus status={plant.status} />
              </div>
              <p className="mt-0.5 text-sm italic text-muted">{species.scientificName}</p>
              <div className="mt-4 space-y-2.5 text-sm">
                <p className="flex items-center gap-2 text-forest/70">📍 {plant.location} · Pot {plant.pot}</p>
                <p className="flex items-center gap-2 text-forest/70">📅 Ditanam {formatDate(plant.plantedAt)}</p>
                <p className="flex items-center gap-2 text-forest/70">📏 Tinggi {plant.height} cm</p>
                <p className="flex items-center gap-2 text-forest/70">💧 Terakhir disiram {formatDate(plant.lastWatered)}</p>
              </div>
              <Button className="mt-5 w-full" onClick={handleWater}>
                💧 Siram sekarang
              </Button>
            </div>
          </div>

          {/* Panduan spesies */}
          <div className="rounded-3xl border border-leaf-100 bg-white p-5 shadow-soft">
            <h2 className="text-lg font-semibold text-forest">Panduan {species.name}</h2>
            <div className="mt-3 space-y-2.5">
              {infoRows.map((r) => (
                <div key={r.label} className="flex items-start gap-3 text-sm">
                  <span className="text-base">{r.icon}</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-leaf-900/45">{r.label}</p>
                    <p className="text-leaf-900/75">{r.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grafik & perawatan */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="section-title">📈 Riwayat Pertumbuhan</h2>
              <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-bold text-leaf-700">+{plant.height - plant.growthLogs[0].height} cm total</span>
            </div>
            <div className="mt-4">
              <GrowthChart logs={plant.growthLogs} />
            </div>
          </div>

          <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft">
            <h2 className="section-title">🔔 Jadwal Perawatan</h2>
            <div className="mt-4 space-y-3">
              {plant.reminders.map((r) => (
                <CareReminder key={r.id} reminder={r} onDone={handleDone} />
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-leaf-600 to-leaf-800 p-6 text-white shadow-soft">
            <h2 className="text-lg font-bold">💡 Tips dari Tanamanku</h2>
            <ul className="mt-3 space-y-2.5">
              {species.tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-leaf-100/90">
                  <span className="mt-0.5 text-sun-300">●</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Catatan perawatan */}
          <div className="rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft">
            <h2 className="section-title">📒 Catatan Perawatan</h2>
            <div className="mt-4 space-y-3">
              {plant.careLogs.map((log, i) => {
                const care = CARE_TYPES[log.type]
                return (
                  <div key={i} className="flex items-center gap-3 rounded-2xl bg-leaf-50/70 px-4 py-3">
                    <span className={cx('flex h-9 w-9 items-center justify-center rounded-xl text-lg', care?.chip)}>{care?.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-forest">{care?.label}</p>
                      <p className="text-xs text-leaf-900/50">{formatDate(log.date)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
