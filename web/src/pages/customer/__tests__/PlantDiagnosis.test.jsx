import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

const mockDiagnose = vi.fn()
const mockShowToast = vi.fn()

vi.mock('../../../services/api/garden', () => ({
  gardenApi: {
    diagnose: (...args) => mockDiagnose(...args),
  },
}))

vi.mock('../../../services/api/mock-data', () => ({
  diagnosisSymptoms: [
    { id: 'yellow_leaves', label: 'Daun menguning', icon: '🍂' },
    { id: 'wilting', label: 'Layu', icon: '🥀' },
    { id: 'spots', label: 'Bercak daun', icon: '🔵' },
    { id: 'pests', label: 'Hama', icon: '🐛' },
  ],
}))

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

vi.mock('../../../components/ui/Button', () => ({
  default: ({ children, onClick, disabled, loading }) => (
    <button onClick={onClick} disabled={disabled}>{loading ? 'Loading...' : children}</button>
  ),
}))

vi.mock('../../../utils/format', () => ({
  cx: (...args) => args.filter(Boolean).join(' '),
}))

import PlantDiagnosis from '../PlantDiagnosis'

function renderPlantDiagnosis() {
  return render(
    <MemoryRouter>
      <PlantDiagnosis />
    </MemoryRouter>
  )
}

describe('PlantDiagnosis Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page title', () => {
    renderPlantDiagnosis()
    expect(screen.getByText(/plant diagnosis/i)).toBeInTheDocument()
    expect(screen.getByText(/tanamanmu kenapa/i)).toBeInTheDocument()
  })

  it('shows symptom options', () => {
    renderPlantDiagnosis()
    expect(screen.getByText(/daun menguning/i)).toBeInTheDocument()
    expect(screen.getByText(/layu/i)).toBeInTheDocument()
    expect(screen.getByText(/bercak daun/i)).toBeInTheDocument()
    expect(screen.getByText(/hama/i)).toBeInTheDocument()
  })

  it('shows diagnose button', () => {
    renderPlantDiagnosis()
    expect(screen.getByText(/diagnosa tanaman/i)).toBeInTheDocument()
  })

  it('shows diagnosis engine note', () => {
    renderPlantDiagnosis()
    expect(screen.getByText(/diagnosis berbasis rule engine/i)).toBeInTheDocument()
  })

  it('shows selected count when symptoms selected', async () => {
    renderPlantDiagnosis()
    await userEvent.click(screen.getByText(/daun menguning/i))
    expect(screen.getByText(/1 gejala dipilih/i)).toBeInTheDocument()
  })

  it('shows disabled button when no symptoms selected', () => {
    renderPlantDiagnosis()
    const btn = screen.getByRole('button', { name: /diagnosa tanaman/i })
    expect(btn).toBeDisabled()
  })
})
