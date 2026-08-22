import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('../../../types/constants', () => ({
  PLANT_STATUS: {
    sehat: { label: 'Sehat & Bahagia', icon: '😊', chip: 'bg-leaf-100 text-leaf-700' },
    'perlu-air': { label: 'Perlu Disiram', icon: '💧', chip: 'bg-sky-100 text-sky-700' },
    perhatian: { label: 'Perlu Perhatian', icon: '⚠️', chip: 'bg-amber-100 text-amber-800' },
  },
}))

vi.mock('../../../utils/format', () => ({
  cx: (...classes) => classes.filter(Boolean).join(' '),
}))

import PlantStatus from '../PlantStatus'

describe('PlantStatus', () => {
  it('renders sehat status with icon and label', () => {
    render(<PlantStatus status="sehat" />)
    expect(screen.getByText('😊')).toBeInTheDocument()
    expect(screen.getByText('Sehat & Bahagia')).toBeInTheDocument()
  })

  it('renders perlu-air status with icon and label', () => {
    render(<PlantStatus status="perlu-air" />)
    expect(screen.getByText('💧')).toBeInTheDocument()
    expect(screen.getByText('Perlu Disiram')).toBeInTheDocument()
  })

  it('renders perhatian status with icon and label', () => {
    render(<PlantStatus status="perhatian" />)
    expect(screen.getByText('⚠️')).toBeInTheDocument()
    expect(screen.getByText('Perlu Perhatian')).toBeInTheDocument()
  })

  it('returns null for unknown status', () => {
    const { container } = render(<PlantStatus status="unknown" />)
    expect(container.firstChild).toBeNull()
  })

  it('applies sm size class', () => {
    render(<PlantStatus status="sehat" size="sm" />)
    const span = screen.getByText('Sehat & Bahagia').closest('span')
    expect(span.className).toContain('text-[11px]')
  })

  it('applies md size class by default', () => {
    render(<PlantStatus status="sehat" />)
    const span = screen.getByText('Sehat & Bahagia').closest('span')
    expect(span.className).toContain('text-xs')
  })

  it('applies correct chip class for status', () => {
    render(<PlantStatus status="sehat" />)
    const span = screen.getByText('Sehat & Bahagia').closest('span')
    expect(span.className).toContain('bg-leaf-100')
  })
})
