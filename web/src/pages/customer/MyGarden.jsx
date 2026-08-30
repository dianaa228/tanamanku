import { useEffect, useState } from 'react'
import { gardenApi } from '../../services/api/garden'
import { productsApi } from '../../services/api/products'
import { useToast } from '../../context/ToastContext'
import { cx, daysUntil } from '../../utils/format'
import { CARE_TYPES } from '../../types/constants'
import PlantCard from '../../components/garden/PlantCard'
import ProductVisual from '../../components/product/ProductVisual'
import Loading from '../../components/ui/Loading'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

const WATER_OPTIONS = [
  { value: '', label: 'Ikuti rekomendasi' },
  { value: '2', label: '2 hari — intensif' },
  { value: '5', label: '5 hari' },
  { value: '7', label: '7 hari' },
  { value: '14', label: '14 hari — hemat air' },
]

const inputCls =
  'w-full rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-input)] px-4 py-2.5 text-sm text-[var(--text-primary)] shadow-sm transition focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-200/60'

export default function MyGarden() {
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [species, setSpecies] = useState([])
  const [speciesLoading, setSpeciesLoading] = useState(false)
  const [step, setStep] = useState('pick')
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const loadPlants = () => gardenApi.getMyPlants().then((res) => setPlants(res.data))

  useEffect(() => {
    loadPlants().finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!addOpen || species.length || speciesLoading) return
    setSpeciesLoading(true)
    productsApi
      .getPlantSpecies()
      .then((res) => setSpecies(res.data))
      .catch(() => showToast('Gagal memuat daftar spesies 😢'))
      .finally(() => setSpeciesLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addOpen])

  const openAdd = () => {
    setStep('pick')
    setSelected(null)
    setForm({})
    setAddOpen(true)
  }

  const pickSpecies = (s) => {
    setSelected(s)
    setForm({ nickname: s.name })
    setStep('detail')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await gardenApi.addPlant({
        speciesId: selected.id,
        nickname: form.nickname,
        pot: form.pot,
        location: form.location,
        heightCm: Number(form.heightCm) || 0,
        waterFrequencyDays: Number(form.waterFrequencyDays) || 0,
      })
      showToast(res.message)
      setAddOpen(false)
      await loadPlants()
    } catch {
      showToast('Gagal menambah tanaman, coba lagi. 😢')
    } finally {
      setSaving(false)
    }
  }

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
    await loadPlants()
  }

  return (
    <div className="page-container">
      {/* ═══ Header editorial ═══ */}
      <div className="page-hero">
        <span className="page-eyebrow">🌿 Kebun Pribadimu</span>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="page-title">My Garden</h1>
            <p className="page-subtitle">Rawat, pantau, dan tumbuhkan tanamanmu — semua dari satu kebun.</p>
          </div>
          <Button onClick={openAdd}>+ Tambah tanaman</Button>
        </div>
      </div>

      {/* ═══ Ringkasan kesehatan ═══ */}
      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {[
          { key: 'sehat', label: 'Sehat', icon: '😊', color: 'from-leaf-400 to-emerald-500' },
          { key: 'perlu-air', label: 'Perlu disiram', icon: '💧', color: 'from-sky-400 to-cyan-500' },
          { key: 'perhatian', label: 'Perlu perhatian', icon: '⚠️', color: 'from-sun-400 to-amber-500' },
        ].map((s) => (
          <div
            key={s.key}
            className="card-v2 flex items-center gap-4 rounded-2xl p-4 hover:translate-y-0 hover:shadow-soft"
          >
            <span
              className={cx(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-sm',
                s.color,
              )}
            >
              {s.icon}
            </span>
            <div>
              <p className="display text-2xl font-semibold text-[var(--text-primary)]">{healthSummary[s.key]}</p>
              <p className="text-xs font-medium text-[var(--text-secondary)]">{s.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ═══ Kartu tanaman ═══ */}
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <div>
            <span className="page-eyebrow">Koleksi</span>
            <h2 className="section-title">Tanamanku</h2>
          </div>
          <span className="rounded-full bg-leaf-800/20 px-3 py-1 text-xs font-bold text-leaf-300">
            {plants.length} tanaman
          </span>
        </div>

        {loading ? (
          <Loading label="Menyiapkan kebunmu..." />
        ) : plants.length === 0 ? (
          <div className="mt-6 rounded-[2rem] border border-dashed border-[var(--border-primary)] bg-[var(--bg-card)] px-6 py-14 text-center backdrop-blur-sm">
            <span className="text-5xl">🪴</span>
            <h3 className="display mt-4 text-xl font-semibold text-[var(--text-primary)]">Kebunmu masih kosong</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--text-secondary)]">
              Pilih tanaman dari katalog spesies untuk mulai merawat dan menjadwalkan pengingat.
            </p>
            <Button className="mt-6" onClick={openAdd}>
              Tambah tanaman pertama
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {plants.map((p) => (
              <PlantCard key={p.id} plant={p} />
            ))}
          </div>
        )}
      </section>

      {/* ═══ Pengingat ═══ */}
      <section className="mt-14">
        <div className="flex items-end justify-between">
          <div>
            <span className="page-eyebrow">Jadwal</span>
            <h2 className="section-title">🔔 Pengingat Perawatan</h2>
          </div>
          <span className="rounded-full bg-sun-500/20 px-3 py-1 text-xs font-bold text-sun-300">
            {todayReminders.length} aktif
          </span>
        </div>
        <div className="mt-5 space-y-3">
          {todayReminders.length === 0 && (
            <p className="rounded-[2rem] border border-dashed border-[var(--border-primary)] bg-[var(--bg-card)] px-6 py-10 text-center text-sm text-[var(--text-secondary)] backdrop-blur-sm">
              Belum ada pengingat. Tambahkan tanaman untuk mulai menjadwalkan perawatan. 🌱
            </p>
          )}
          {todayReminders.map((r) => {
            const due = daysUntil(r.nextDue)
            return (
              <div
                key={r.id}
                className="card-v2 flex flex-col gap-3 rounded-2xl p-4 hover:-translate-y-0 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-leaf-800/20 text-xl">
                    <span className="absolute inset-0 rounded-2xl opacity-40" />
                    {r.plant.species.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[var(--text-primary)]">
                      {r.plant.nickname} <span className="font-medium text-[var(--text-secondary)]">· {CARE_TYPES[r.type].label}</span>
                    </p>
                    <p className={cx('text-xs font-semibold', due <= 0 ? 'text-terra-400' : 'text-[var(--text-muted)]')}>
                      {CARE_TYPES[r.type].icon} {due <= 0 ? 'Jatuh tempo hari ini!' : `${due} hari lagi`}
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

      {/* ═══ Modal: tambah tanaman ═══ */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title={step === 'pick' ? 'Pilih jenis tanaman 🌱' : `Detail ${selected?.name || 'tanaman'}`}
        className="sm:max-w-2xl"
      >
        {step === 'pick' && (
          <div>
            {speciesLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton aspect-[4/5] rounded-2xl" />
                ))}
              </div>
            ) : species.length === 0 ? (
              <div className="py-10 text-center">
                <span className="text-4xl">🍃</span>
                <p className="mt-3 text-sm text-muted">Belum ada spesies yang tersedia.</p>
              </div>
            ) : (
              <div className="grid max-h-[55vh] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-4">
                {species.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => pickSpecies(s)}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-leaf-400/50 hover:shadow-soft"
                  >
                    <div className="relative">
                      <ProductVisual
                        emoji={s.emoji}
                        gradient={s.gradient}
                        className="h-28 w-full"
                        emojiClassName="text-4xl"
                      />
                      <span className="absolute right-2 top-2 rounded-full bg-[var(--bg-card)] px-2 py-0.5 text-[10px] font-bold text-leaf-400 shadow-sm backdrop-blur">
                        {s.careLevel}
                      </span>
                    </div>
                    <div className="flex-1 p-3">
                      <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-leaf-400">{s.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{s.scientificName}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <p className="mt-4 text-center text-xs text-muted">Pilih spesies untuk menyesuaikan detail & pengingat perawatan.</p>
          </div>
        )}

        {step === 'detail' && selected && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4 rounded-2xl bg-leaf-800/20 p-4">
              <ProductVisual emoji={selected.emoji} gradient={selected.gradient} className="h-16 w-16" emojiClassName="text-3xl" />
              <div className="min-w-0">
                <p className="font-bold text-[var(--text-primary)]">{selected.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{selected.light}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[var(--text-primary)]">Nama panggilan *</span>
                <input
                  value={form.nickname || ''}
                  onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                  className={inputCls}
                  placeholder="Mis. Momo"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[var(--text-primary)]">Lokasi</span>
                <input
                  value={form.location || ''}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className={inputCls}
                  placeholder="Ruang Tamu, Balkon, Dapur"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[var(--text-primary)]">Pot</span>
                <input
                  value={form.pot || ''}
                  onChange={(e) => setForm({ ...form, pot: e.target.value })}
                  className={inputCls}
                  placeholder="Terakota 25cm"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[var(--text-primary)]">Tinggi (cm)</span>
                <input
                  type="number"
                  min="0"
                  value={form.heightCm || ''}
                  onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                  className={inputCls}
                  placeholder="0"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[var(--text-primary)]">Pengingat siram</span>
              <select
                value={form.waterFrequencyDays || ''}
                onChange={(e) => setForm({ ...form, waterFrequencyDays: e.target.value })}
                className={inputCls}
              >
                {WATER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setStep('pick')}>
                ← Pilih lain
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan ke kebun'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}