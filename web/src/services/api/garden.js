import { api, apiMode, mockResponse, unwrap } from './client'
import { mapDiagnosis, mapPlants, mapSpecies } from './normalizers'
import {
  diagnosisRules,
  finderMatches,
  finderQuestions,
  plantSpecies,
  userPlants,
  reminders,
  waterEveryDaysFor,
} from './mock-data'

/**
 * Adapter My Garden + Smart Plant (docs/07-web-react.json: garden.js).
 * Mencakup: tanaman pengguna, pengingat, Plant Finder & Plant Diagnosis.
 */

// ===== Mock: data & aturan lokal (sama dengan demo sebelumnya) =====
const enrich = (plant) => {
  const species = plantSpecies.find((s) => s.id === plant.speciesId)
  return {
    ...plant,
    species,
    waterEveryDays: waterEveryDaysFor(species.slug),
    reminders: reminders.filter((r) => r.userPlantId === plant.id),
    careLogs: [
      { type: 'siram', date: plant.lastWatered },
      ...(plant.status === 'sehat' ? [{ type: 'pupuk', date: '2026-07-25' }] : []),
    ],
  }
}

const mockImpl = {
  getMyPlants: () => mockResponse(userPlants.map(enrich), 'Tanaman berhasil dimuat'),

  getPlant: (id) => {
    const plant = userPlants.find((p) => p.id === Number(id))
    if (!plant) return Promise.reject({ response: { status: 404, data: { message: 'Tanaman tidak ditemukan' } } })
    return mockResponse(enrich(plant), 'Detail tanaman berhasil dimuat')
  },

  waterPlant: async (id) => {
    await new Promise((r) => setTimeout(r, 400))
    return { success: true, message: 'Penyiraman dicatat! Tanaman senang sekali 💚', data: { id, lastWatered: new Date().toISOString().slice(0, 10) } }
  },

  markCareDone: async (id, type) => {
    await new Promise((r) => setTimeout(r, 400))
    const label = ({ siram: 'Penyiraman', pupuk: 'Pemupukan', repot: 'Repotting' })[type] || 'Perawatan'
    return { success: true, message: `${label} selesai dicatat!`, data: { id, type } }
  },

  getReminders: () => mockResponse(reminders, 'Pengingat berhasil dimuat'),

  finderQuestions: () => mockResponse(finderQuestions, 'Pertanyaan Plant Finder'),

  finderRecommend: async (answers) => {
    await new Promise((r) => setTimeout(r, 700))
    return mockResponse(finderMatches(answers).map(mapSpecies), 'Rekomendasi tanaman', 0)
  },

  diagnose: async (plantId, symptoms) => {
    await new Promise((r) => setTimeout(r, 900))
    let best = null
    let bestScore = 0
    for (const rule of diagnosisRules) {
      const score = rule.symptoms.filter((s) => symptoms.includes(s)).length
      if (score > bestScore) {
        bestScore = score
        best = rule
      }
    }
    if (!best) {
      best = {
        emoji: '🌱', title: 'Gejala belum cukup spesifik', severity: 'ringan',
        description: 'Amati tanaman 2–3 hari lagi, lalu coba diagnosis ulang dengan gejala tambahan.',
        advice: ['Pantau perkembangan tanaman setiap hari', 'Catat perubahan di My Garden', 'Coba diagnosis ulang jika kondisi memburuk'],
      }
    }
    return { success: true, message: 'Hasil diagnosis', data: best }
  },
}

// ===== Adapter publik =====
export const gardenApi = {
  getMyPlants: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/my-garden')
      return { success: true, message: res.message, data: mapPlants(unwrap(res)) }
    }
    return mockImpl.getMyPlants()
  },

  getPlant: async (id) => {
    if (apiMode() === 'api') {
      const res = await api.get(`/my-garden/${id}`)
      return { success: true, message: res.message, data: mapPlants([res.data])[0] }
    }
    return mockImpl.getPlant(id)
  },

  waterPlant: async (id) => {
    if (apiMode() === 'api') {
      await api.post(`/my-garden/${id}/care`, { type: 'siram' })
      return { success: true, message: 'Penyiraman dicatat! 💚', data: { id } }
    }
    return mockImpl.waterPlant(id)
  },

  markCareDone: async (plantId, type) => {
    if (apiMode() === 'api') {
      await api.post(`/my-garden/${plantId}/care`, { type })
      return { success: true, message: 'Perawatan selesai dicatat!', data: { plantId, type } }
    }
    return mockImpl.markCareDone(plantId, type)
  },

  getReminders: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/my-garden/reminders')
      return { success: true, message: res.message, data: res.data }
    }
    return mockImpl.getReminders()
  },

  // ===== Plant Finder =====
  finderQuestions: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/plant-finder/questions')
      return { success: true, message: res.message, data: res.data }
    }
    return mockImpl.finderQuestions()
  },

  finderRecommend: async (answers) => {
    if (apiMode() === 'api') {
      const res = await api.post('/plant-finder/recommend', answers)
      return { success: true, message: res.message, data: (res.data || []).map(mapSpecies) }
    }
    return mockImpl.finderRecommend(answers)
  },

  // ===== Plant Diagnosis =====
  diagnose: async (plantId, symptoms) => {
    if (apiMode() === 'api') {
      let pid = plantId
      if (!pid) {
        const plants = await gardenApi.getMyPlants()
        pid = plants.data?.[0]?.id
      }
      if (!pid) {
        return { success: false, message: 'Tambahkan tanaman dulu di My Garden untuk diagnosis.', data: null }
      }
      const res = await api.post('/plant-diagnosis', { user_plant_id: pid, symptoms })
      return { success: true, message: res.message, data: mapDiagnosis(res.data) }
    }
    return mockImpl.diagnose(plantId, symptoms)
  },
}
