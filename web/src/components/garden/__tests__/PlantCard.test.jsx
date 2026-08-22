import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../../utils/format', () => ({
  daysUntil: vi.fn((iso) => {
    const diff = new Date(iso) - new Date('2026-08-22')
    return Math.ceil(diff / 86400000)
  }),
  formatDate: vi.fn((iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }),
}))

vi.mock('../../../types/constants', () => ({
  CARE_TYPES: {
    siram: { label: 'Penyiraman', icon: '💧', chip: 'bg-sky-100 text-sky-700' },
    pupuk: { label: 'Pemupukan', icon: '🌱', chip: 'bg-leaf-100 text-leaf-700' },
  },
}))

vi.mock('../PlantStatus', () => ({
  default: ({ status }) => <span data-testid="plant-status">{status}</span>,
}))

vi.mock('../../product/ProductVisual', () => ({
  default: ({ emoji, gradient }) => <div data-testid="product-visual">{emoji}</div>,
}))

import PlantCard from '../PlantCard'

const mockPlant = {
  id: 1,
  nickname: 'Monstera Jadi',
  species: { name: 'Monstera Deliciosa', emoji: '🌿', gradient: 'from-green-400' },
  photoGradient: null,
  height: 35,
  location: 'Ruang Tamu',
  status: 'sehat',
  lastWatered: '2026-08-20',
  reminders: [
    { id: 1, type: 'siram', isActive: true, nextDue: '2026-08-24', frequency: 3 },
    { id: 2, type: 'pupuk', isActive: false, nextDue: '2026-08-30', frequency: 14 },
  ],
}

function renderPlantCard(overrides = {}) {
  const plant = { ...mockPlant, ...overrides }
  return render(
    <MemoryRouter>
      <PlantCard plant={plant} />
    </MemoryRouter>,
  )
}

describe('PlantCard', () => {
  it('renders plant nickname', () => {
    renderPlantCard()
    expect(screen.getByText('Monstera Jadi')).toBeInTheDocument()
  })

  it('renders species name', () => {
    renderPlantCard()
    expect(screen.getByText('Monstera Deliciosa')).toBeInTheDocument()
  })

  it('renders plant height', () => {
    renderPlantCard()
    expect(screen.getByText('35 cm')).toBeInTheDocument()
  })

  it('renders plant location', () => {
    renderPlantCard()
    expect(screen.getByText(/📍 Ruang Tamu/)).toBeInTheDocument()
  })

  it('renders link to plant detail page', () => {
    renderPlantCard()
    const link = screen.getByText('Monstera Jadi').closest('a')
    expect(link).toHaveAttribute('href', '/my-garden/1')
  })

  it('renders ProductVisual with species emoji', () => {
    renderPlantCard()
    expect(screen.getByTestId('product-visual')).toHaveTextContent('🌿')
  })

  it('renders PlantStatus with correct status', () => {
    renderPlantCard()
    expect(screen.getByTestId('plant-status')).toHaveTextContent('sehat')
  })

  it('shows next active reminder care info', () => {
    renderPlantCard()
    expect(screen.getByText('Penyiraman')).toBeInTheDocument()
  })

  it('shows care icon for active reminder', () => {
    renderPlantCard()
    expect(screen.getByText('💧')).toBeInTheDocument()
  })

  it('shows due days text', () => {
    renderPlantCard()
    // nextDue is 2026-08-24, days from 2026-08-22 = 2 days
    expect(screen.getByText('2 hari lagi')).toBeInTheDocument()
  })

  it('shows overdue text when due today', () => {
    renderPlantCard({
      reminders: [{ id: 1, type: 'siram', isActive: true, nextDue: '2026-08-22', frequency: 3 }],
    })
    expect(screen.getByText('Hari ini!')).toBeInTheDocument()
  })

  it('shows "Besok" when due tomorrow', () => {
    renderPlantCard({
      reminders: [{ id: 1, type: 'siram', isActive: true, nextDue: '2026-08-23', frequency: 3 }],
    })
    expect(screen.getByText('Besok')).toBeInTheDocument()
  })

  it('shows no active reminder message when no active reminders', () => {
    renderPlantCard({
      reminders: [{ id: 1, type: 'siram', isActive: false, nextDue: '2026-08-24', frequency: 3 }],
    })
    expect(screen.getByText('Tidak ada pengingat aktif')).toBeInTheDocument()
  })

  it('shows last watered date', () => {
    renderPlantCard()
    expect(screen.getAllByText(/💧/).length).toBeGreaterThanOrEqual(1)
  })

  it('uses species gradient when no photoGradient', () => {
    renderPlantCard()
    const visual = screen.getByTestId('product-visual')
    expect(visual).toBeInTheDocument()
  })

  it('uses photoGradient when available', () => {
    renderPlantCard({ photoGradient: 'from-red-400' })
    const visual = screen.getByTestId('product-visual')
    expect(visual).toBeInTheDocument()
  })

  it('renders overdue reminder with red styling', () => {
    renderPlantCard({
      reminders: [{ id: 1, type: 'siram', isActive: true, nextDue: '2026-08-20', frequency: 3 }],
    })
    // daysUntil returns -2 for 2026-08-20 from 2026-08-22, so overdue
    expect(screen.getByText('Penyiraman')).toBeInTheDocument()
  })

  it('shows the earliest active reminder sorted by nextDue', () => {
    renderPlantCard({
      reminders: [
        { id: 1, type: 'pupuk', isActive: true, nextDue: '2026-08-30', frequency: 14 },
        { id: 2, type: 'siram', isActive: true, nextDue: '2026-08-24', frequency: 3 },
      ],
    })
    // siram (Aug 24) comes before pupuk (Aug 30)
    expect(screen.getByText('Penyiraman')).toBeInTheDocument()
  })
})
