import { useEffect, useState } from 'react'
import { gardenApi } from '../../services/api/garden'
import { useToast } from '../../context/ToastContext'
import { daysUntil } from '../../utils/format'
import { CARE_TYPES } from '../../types/constants'
import PlantCard from '../../components/garden/PlantCard'
import CareReminder from '../../components/garden/CareReminder'
import Loading from '../../components/ui/Loading'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

export default function MyGarden() {
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    gardenApi.getMyPlants().then((res) => {
      setPlants(res.data)
      setLoading(false)
    })
  }, [])

  const todayReminders = plants
    .flatMap((p) => p.reminders.filter((r) => r.isActive).map((r) => ({ ...r, plant: p })))
    .sort((a, b) => new Date(a.nextDue) - new Date(b.nextDue))

  const healthSummary = {
    sehat: plants.filter((p) => p.status === 'sehat').length,
    'perlu-air': plants.filter((p) => p.status === 'perlu-air').length,
    perhatian: plants.filter((p) => p.status === 'perhatian').length,
  }

  const handleDone = async (reminder) => {
    await gardenApi.markCareDone(reminder.userPlantId, reminder.type)
    showToast(`${CARE_TYPES[reminder.type].label} selesai dicatat! 💚`)
  }

  const handleWater = async (plantId) => {
    await gardenApi.waterPlant(plantId)
    showToast('Penyiraman dicatat! Tanaman senang sekali 💚')
    const res = await gardenApi.getMyPlants()
    setPlants(res.data)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-leaf-950">My Garden 🪴</h1>
          <p className="mt-1 text-sm text-leaf-900/50">Kebun pribadimu — rawat, pantau, dan tumbuhkan.</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>+ Tambah tanaman</Button>
      </div>

      {/* Ringkasan kesehatan */}
      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { key: 'sehat', label: 'Sehat', icon: '😊', color: 'bg-leaf-100 text-leaf-700' },
          { key: 'perlu-air', label: 'Perlu disiram', icon: '💧', color: 'bg-sky-100 text-sky-700' },
          { key: 'perhatian', label: 'Perlu perhatian', icon: '⚠️', color: 'bg-amber-100 text-amber-800' },
        ].map((s) => (
          <div key={s.key} className="flex items-center gap-3 rounded-3xl border border-leaf-100 bg-white p-4 shadow-soft">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${s.color}`}>{s.icon}</span>
            <div>
              <p className="text-2xl font-extrabold text-leaf-950">{healthSummary[s.key]}</p>
              <p className="text-xs font-medium text-leaf-900/50">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Kartu tanaman */}
      {loading ? (
        <Loading />
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {plants.map((p) => (
            <PlantCard key={p.id} plant={p} />
          ))}
        </div>
      )}

      {/* Pengingat */}
      <section className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-leaf-950">🔔 Pengingat Perawatan</h2>
          <span className="rounded-full bg-sun-100 px-3 py-1 text-xs font-bold text-sun-600">
            {todayReminders.length} aktif
          </span>
        </div>
        <div className="mt-5 space-y-3">
          {todayReminders.length === 0 && (
            <p className="rounded-3xl border border-dashed border-leaf-200 bg-leaf-50/50 px-6 py-10 text-center text-sm text-leaf-900/50">
              Belum ada pengingat. Tambahkan tanaman untuk mulai menjadwalkan perawatan. 🌱
            </p>
          )}
          {todayReminders.map((r) => {
            const due = daysUntil(r.nextDue)
            return (
              <div key={r.id} className="flex flex-col gap-3 rounded-3xl border border-leaf-100 bg-white p-4 shadow-soft sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-100 text-xl">{r.plant.species.emoji}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-leaf-950">
                      {r.plant.nickname} <span className="font-medium text-leaf-900/40">· {CARE_TYPES[r.type].label}</span>
                    </p>
                    <p className={`text-xs font-semibold ${due <= 0 ? 'text-rose-600' : 'text-leaf-900/50'}`}>
                      {due <= 0 ? 'Jatuh tempo hari ini!' : `${due} hari lagi`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {r.type === 'siram' && (
                    <Button size="sm" variant="soft" onClick={() => handleWater(r.plant.id)}>
                      💧 Siram sekarang
                    </Button>
                  )}
                  <Button size="sm" onClick={() => handleDone(r)}>
                    ✓ Tandai selesai
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Modal tambah tanaman */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Tambahkan tanaman baru 🌱">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {['monstera-deliciosa', 'sirih-gading', 'cabai-rawit', 'tomat-cherry', 'kemangi', 'aloe-vera', 'aglonema', 'lidah-mertua'].map((slug) => (
            <button
              key={slug}
              onClick={() => {
                showToast('Fitur demo: pilih tanaman dari katalog untuk menambah ke kebunmu 🪴')
                setAddOpen(false)
              }}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-leaf-100 p-4 transition hover:border-leaf-400 hover:bg-leaf-50"
            >
              <span className="text-4xl transition-transform group-hover:scale-110">🪴</span>
              <span className="text-xs font-semibold text-leaf-900/70">{slug.replace(/-/g, ' ')}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-leaf-900/45">
          🚧 Mode demo — di versi penuh, Anda dapat memilih dari database spesies & menambahkan foto.
        </p>
      </Modal>
    </div>
  )
}
