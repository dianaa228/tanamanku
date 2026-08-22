import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetMyPlants = vi.fn()
const mockMarkCareDone = vi.fn()
const mockWaterPlant = vi.fn()
const mockShowToast = vi.fn()

vi.mock('../../../services/api/garden', () => ({
  gardenApi: {
    getMyPlants: (...args) => mockGetMyPlants(...args),
    markCareDone: (...args) => mockMarkCareDone(...args),
    waterPlant: (...args) => mockWaterPlant(...args),
  },
}))

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

vi.mock('../../../components/ui/Loading', () => ({
  default: () => <div>Loading...</div>,
}))

vi.mock('../../../components/ui/Button', () => ({
  default: ({ children, to, onClick }) => to ? <a href={to}>{children}</a> : <button onClick={onClick}>{children}</button>,
}))

vi.mock('../../../components/ui/Modal', () => ({
  default: ({ open, children, title }) => open ? <div role="dialog"><h2>{title}</h2>{children}</div> : null,
}))

vi.mock('../../../components/garden/PlantCard', () => ({
  default: ({ plant }) => <div data-testid="plant-card">{plant.nickname}</div>,
}))

vi.mock('../../../components/garden/CareReminder', () => ({
  default: ({ reminder }) => <div data-testid="care-reminder">{reminder.type}</div>,
}))

vi.mock('../../../utils/format', () => ({
  daysUntil: (date) => {
    const diff = new Date(date) - new Date()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  },
  formatRupiah: (v) => `Rp${(v || 0).toLocaleString('id-ID')}`,
  formatDateTime: (v) => v || '—',
  cx: (...args) => args.filter(Boolean).join(' '),
}))

vi.mock('../../../types/constants', () => ({
  CARE_TYPES: {
    siram: { label: 'Siram' },
    pupuk: { label: 'Pupuk' },
    repot: { label: 'Repot' },
    prune: { label: 'Pruning' },
  },
}))

import MyGarden from '../MyGarden'

const mockPlants = [
  {
    id: 1,
    nickname: 'Monstera Momo',
    status: 'sehat',
    species: { name: 'Monstera', emoji: '🪴' },
    reminders: [
      { id: 1, type: 'siram', isActive: true, nextDue: '2026-08-25', userPlantId: 1 },
    ],
  },
  {
    id: 2,
    nickname: 'Aloe Vera Kecil',
    status: 'perlu-air',
    species: { name: 'Aloe Vera', emoji: '🌵' },
    reminders: [
      { id: 2, type: 'pupuk', isActive: true, nextDue: '2026-08-20', userPlantId: 2 },
    ],
  },
]

function renderMyGarden() {
  return render(
    <MemoryRouter>
      <MyGarden />
    </MemoryRouter>
  )
}

describe('MyGarden Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetMyPlants.mockReturnValue(new Promise(() => {}))
    renderMyGarden()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders page title after loading', async () => {
    mockGetMyPlants.mockResolvedValue({ data: mockPlants })
    renderMyGarden()

    await waitFor(() => {
      expect(screen.getByText(/my garden/i)).toBeInTheDocument()
    })
  })

  it('shows health summary', async () => {
    mockGetMyPlants.mockResolvedValue({ data: mockPlants })
    renderMyGarden()

    await waitFor(() => {
      expect(screen.getByText('Sehat')).toBeInTheDocument()
    })

    expect(screen.getByText('Perlu disiram')).toBeInTheDocument()
    expect(screen.getByText('Perlu perhatian')).toBeInTheDocument()
  })

  it('renders plant cards', async () => {
    mockGetMyPlants.mockResolvedValue({ data: mockPlants })
    renderMyGarden()

    await waitFor(() => {
      const monsteraEls = screen.getAllByText('Monstera Momo')
      expect(monsteraEls.length).toBeGreaterThanOrEqual(1)
    })

    const aloeEls = screen.getAllByText('Aloe Vera Kecil')
    expect(aloeEls.length).toBeGreaterThanOrEqual(1)
  })

  it('shows add plant button', async () => {
    mockGetMyPlants.mockResolvedValue({ data: mockPlants })
    renderMyGarden()

    await waitFor(() => {
      expect(screen.getByText(/tambah tanaman/i)).toBeInTheDocument()
    })
  })

  it('shows care reminders section', async () => {
    mockGetMyPlants.mockResolvedValue({ data: mockPlants })
    renderMyGarden()

    await waitFor(() => {
      expect(screen.getByText(/pengingat perawatan/i)).toBeInTheDocument()
    })
  })

  it('shows empty state when no plants', async () => {
    mockGetMyPlants.mockResolvedValue({ data: [] })
    renderMyGarden()

    await waitFor(() => {
      expect(screen.getByText(/belum ada pengingat/i)).toBeInTheDocument()
    })
  })
})
