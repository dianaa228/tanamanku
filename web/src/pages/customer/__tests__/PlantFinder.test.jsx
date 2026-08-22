import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

const mockFinderRecommend = vi.fn()
const mockFinderQuestions = vi.fn()
const mockShowToast = vi.fn()

vi.mock('../../../services/api/garden', () => ({
  gardenApi: {
    finderRecommend: (...args) => mockFinderRecommend(...args),
    finderQuestions: (...args) => mockFinderQuestions(...args),
  },
}))

vi.mock('../../../services/api/client', () => ({
  apiMode: vi.fn(() => 'mock'),
}))

vi.mock('../../../services/api/mock-data', () => ({
  finderQuestions: [
    {
      id: 'light',
      question: 'Berapa jam sinar matahari?',
      icon: '☀️',
      options: [
        { value: 'low', label: 'Sedikit', desc: '1-3 jam', icon: '🌑' },
        { value: 'medium', label: 'Sedang', desc: '4-6 jam', icon: '⛅' },
      ],
    },
    {
      id: 'water',
      question: 'Seberapa sering kamu mau menyiram?',
      icon: '💧',
      options: [
        { value: 'rare', label: 'Jarang', desc: '1-2x seminggu', icon: '🏜️' },
        { value: 'often', label: 'Sering', desc: 'Setiap hari', icon: '🌊' },
      ],
    },
  ],
}))

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

vi.mock('../../../components/ui/Button', () => ({
  default: ({ children, to, onClick, disabled }) => to ? <a href={to}>{children}</a> : <button onClick={onClick} disabled={disabled}>{children}</button>,
}))

vi.mock('../../../components/product/ProductVisual', () => ({
  default: ({ emoji }) => <div>{emoji}</div>,
}))

vi.mock('../../../types/constants', () => ({
  CARE_LEVEL: {
    mudah: { label: 'Mudah', icon: '🌱', chip: 'bg-leaf-100 text-leaf-700' },
    sedang: { label: 'Sedang', icon: '🌿', chip: 'bg-sun-100 text-sun-600' },
  },
}))

vi.mock('../../../utils/format', () => ({
  cx: (...args) => args.filter(Boolean).join(' '),
}))

import PlantFinder from '../PlantFinder'

function renderPlantFinder() {
  return render(
    <MemoryRouter>
      <PlantFinder />
    </MemoryRouter>
  )
}

describe('PlantFinder Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page title', () => {
    renderPlantFinder()
    expect(screen.getByText(/plant finder/i)).toBeInTheDocument()
    expect(screen.getByText(/tanaman apa yang cocok/i)).toBeInTheDocument()
  })

  it('shows first question', () => {
    renderPlantFinder()
    expect(screen.getByText(/berapa jam sinar matahari/i)).toBeInTheDocument()
  })

  it('shows progress bar', () => {
    renderPlantFinder()
    expect(screen.getByText(/langkah 1 dari 2/i)).toBeInTheDocument()
  })

  it('shows answer options', () => {
    renderPlantFinder()
    expect(screen.getByText(/sedikit/i)).toBeInTheDocument()
    expect(screen.getByText(/sedang/i)).toBeInTheDocument()
  })

  it('shows recommendation engine note', () => {
    renderPlantFinder()
    expect(screen.getByText(/mesin rekomendasi berbasis aturan/i)).toBeInTheDocument()
  })

  it('disables back button on first question', () => {
    renderPlantFinder()
    const backBtn = screen.getByText(/kembali/i)
    expect(backBtn.closest('button')).toHaveClass('invisible')
  })
})
