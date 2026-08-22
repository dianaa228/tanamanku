import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../../../utils/format', () => ({
  daysUntil: vi.fn((iso) => {
    const diff = new Date(iso) - new Date('2026-08-22')
    return Math.ceil(diff / 86400000)
  }),
  formatDate: vi.fn((iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }),
  cx: (...classes) => classes.filter(Boolean).join(' '),
}))

vi.mock('../../../types/constants', () => ({
  CARE_TYPES: {
    siram: { label: 'Penyiraman', icon: '💧', chip: 'bg-sky-100 text-sky-700' },
    pupuk: { label: 'Pemupukan', icon: '🌱', chip: 'bg-leaf-100 text-leaf-700' },
  },
}))

vi.mock('../../ui/Button', () => ({
  default: ({ children, onClick, size, variant }) => (
    <button onClick={onClick} data-size={size} data-variant={variant}>
      {children}
    </button>
  ),
}))

import CareReminder from '../CareReminder'

const mockReminder = {
  id: 1,
  type: 'siram',
  frequency: 3,
  nextDue: '2026-08-24',
  lastDoneAt: '2026-08-21',
  isActive: true,
}

function renderReminder(overrides = {}, handlers = {}) {
  const reminder = { ...mockReminder, ...overrides }
  return render(
    <CareReminder
      reminder={reminder}
      onDone={handlers.onDone}
      onToggle={handlers.onToggle}
    />,
  )
}

describe('CareReminder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders care type label', () => {
    renderReminder()
    expect(screen.getByText('Penyiraman')).toBeInTheDocument()
  })

  it('renders care icon', () => {
    renderReminder()
    expect(screen.getByText('💧')).toBeInTheDocument()
  })

  it('renders frequency text', () => {
    renderReminder()
    expect(screen.getByText(/tiap 3 hari/)).toBeInTheDocument()
  })

  it('renders "Selesai" button', () => {
    renderReminder()
    expect(screen.getByText('✓ Selesai')).toBeInTheDocument()
  })

  it('renders toggle button', () => {
    renderReminder()
    expect(screen.getByTitle('Nonaktifkan')).toBeInTheDocument()
  })

  it('shows due in X days text for future reminder', () => {
    renderReminder()
    // nextDue is 2026-08-24, days from 2026-08-22 = 2 days
    expect(screen.getByText(/2 hari lagi/)).toBeInTheDocument()
  })

  it('shows overdue text when due today', () => {
    renderReminder({ nextDue: '2026-08-22' })
    expect(screen.getByText(/Jatuh tempo hari ini/)).toBeInTheDocument()
  })

  it('shows overdue text when past due', () => {
    renderReminder({ nextDue: '2026-08-20' })
    expect(screen.getByText(/Jatuh tempo hari ini/)).toBeInTheDocument()
  })

  it('shows "besok" when due tomorrow', () => {
    renderReminder({ nextDue: '2026-08-23' })
    expect(screen.getByText(/besok/)).toBeInTheDocument()
  })

  it('calls onDone when Selesai button is clicked', async () => {
    const onDone = vi.fn()
    const user = userEvent.setup()
    renderReminder({}, { onDone })

    await user.click(screen.getByText('✓ Selesai'))
    expect(onDone).toHaveBeenCalledWith(mockReminder)
  })

  it('calls onToggle when toggle button is clicked', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()
    renderReminder({}, { onToggle })

    await user.click(screen.getByTitle('Nonaktifkan'))
    expect(onToggle).toHaveBeenCalledWith(1)
  })

  it('shows "Aktifkan" title when reminder is inactive', () => {
    renderReminder({ isActive: false })
    expect(screen.getByTitle('Aktifkan')).toBeInTheDocument()
  })

  it('renders pupuk type correctly', () => {
    renderReminder({ type: 'pupuk' })
    expect(screen.getByText('Pemupukan')).toBeInTheDocument()
    expect(screen.getByText('🌱')).toBeInTheDocument()
  })

  it('returns null for unknown care type', () => {
    const { container } = renderReminder({ type: 'unknown' })
    expect(container.firstChild).toBeNull()
  })

  it('applies overdue styling for past due reminder', () => {
    const { container } = renderReminder({ nextDue: '2026-08-20' })
    const card = container.firstChild
    expect(card.className).toContain('border-rose-200')
  })

  it('applies warning styling for reminder due within 2 days', () => {
    const { container } = renderReminder({ nextDue: '2026-08-23' })
    const card = container.firstChild
    expect(card.className).toContain('border-sun-200')
  })

  it('applies normal styling for reminder due in >2 days', () => {
    const { container } = renderReminder({ nextDue: '2026-08-30' })
    const card = container.firstChild
    expect(card.className).toContain('border-leaf-100')
  })

  it('applies opacity when reminder is inactive', () => {
    const { container } = renderReminder({ isActive: false })
    const toggleBtn = screen.getByTitle('Aktifkan')
    expect(toggleBtn.className).toContain('opacity-30')
  })
})
