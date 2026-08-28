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

vi.mock('../../../components/ui/Badge', () => ({
  default: ({ children }) => <span>{children}</span>,
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

  it('shows tab navigation buttons', () => {
    renderSettings()
    const buttons = screen.getAllByRole('button')
    const tabLabels = buttons.map(b => b.textContent).filter(t => t)
    expect(tabLabels.some(t => /pengiriman/i.test(t))).toBe(true)
    expect(tabLabels.some(t => /pembayaran/i.test(t))).toBe(true)
    expect(tabLabels.some(t => /notifikasi/i.test(t))).toBe(true)
  })

  it('shows min order input on general tab', () => {
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

  it('shows default platform name', () => {
    renderSettings()
    expect(screen.getByDisplayValue('Tanamanku')).toBeInTheDocument()
  })
})
