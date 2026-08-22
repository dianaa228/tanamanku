import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockRegister = vi.fn()
const mockShowToast = vi.fn()

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ register: mockRegister }),
}))

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

import Register from '../Register'

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
}

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders register form with heading', () => {
    renderRegister()
    expect(screen.getByText(/mulai berkebun/i)).toBeInTheDocument()
    expect(screen.getByText(/gratis selamanya/i)).toBeInTheDocument()
  })

  it('renders name input', () => {
    renderRegister()
    expect(screen.getByPlaceholderText(/rina kartika/i)).toBeInTheDocument()
  })

  it('renders email input', () => {
    renderRegister()
    expect(screen.getByPlaceholderText(/nama@email.com/i)).toBeInTheDocument()
  })

  it('renders password input', () => {
    renderRegister()
    const inputs = screen.getAllByPlaceholderText(/minimal 8 karakter/i)
    expect(inputs.length).toBeGreaterThan(0)
  })

  it('renders password confirmation input', () => {
    renderRegister()
    const inputs = screen.getAllByPlaceholderText(/ulangi password/i)
    expect(inputs.length).toBeGreaterThan(0)
  })

  it('renders submit button', () => {
    renderRegister()
    expect(screen.getByRole('button', { name: /daftar sekarang/i })).toBeInTheDocument()
  })

  it('shows login link', () => {
    renderRegister()
    const link = screen.getByText(/masuk$/i)
    expect(link).toHaveAttribute('href', '/login')
  })

  it('shows terms of service text', () => {
    renderRegister()
    expect(screen.getByText(/ketentuan layanan/i)).toBeInTheDocument()
    expect(screen.getByText(/kebijakan privasi/i)).toBeInTheDocument()
  })

  it('name input is required', () => {
    renderRegister()
    expect(screen.getByPlaceholderText(/rina kartika/i)).toBeRequired()
  })

  it('email input is required', () => {
    renderRegister()
    expect(screen.getByPlaceholderText(/nama@email.com/i)).toBeRequired()
  })
})
