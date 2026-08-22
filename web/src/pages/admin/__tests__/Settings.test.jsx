import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockShowToast = vi.fn()

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

vi.mock('../../../components/ui/Button', () => ({
  default: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}))

import AdminSettings from '../Settings'

function renderSettings() {
  return render(
    <MemoryRouter>
      <AdminSettings />
    </MemoryRouter>
  )
}

describe('Admin Settings Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page title', () => {
    renderSettings()
    expect(screen.getByText(/pengaturan platform/i)).toBeInTheDocument()
  })

  it('shows platform name input', () => {
    renderSettings()
    expect(screen.getByDisplayValue('Tanamanku')).toBeInTheDocument()
  })

  it('shows shipping cost inputs', () => {
    renderSettings()
    expect(screen.getByText(/ongkir default/i)).toBeInTheDocument()
    expect(screen.getByText(/ongkir express/i)).toBeInTheDocument()
  })

  it('shows min order input', () => {
    renderSettings()
    expect(screen.getByText(/min\. order/i)).toBeInTheDocument()
  })

  it('shows max cart items input', () => {
    renderSettings()
    expect(screen.getByText(/maks\. item keranjang/i)).toBeInTheDocument()
  })

  it('shows seller commission input', () => {
    renderSettings()
    expect(screen.getByText(/komisi seller/i)).toBeInTheDocument()
  })

  it('shows save button', () => {
    renderSettings()
    expect(screen.getByText(/simpan pengaturan/i)).toBeInTheDocument()
  })

  it('shows default values', () => {
    renderSettings()
    expect(screen.getByDisplayValue('Tanamanku')).toBeInTheDocument()
    expect(screen.getByDisplayValue('15000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('35000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('50')).toBeInTheDocument()
    expect(screen.getByDisplayValue('10000')).toBeInTheDocument()
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
  })
})
