import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

const mockShowToast = vi.fn()
const mockForgotPassword = vi.fn()

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

vi.mock('../../../services/api/auth', () => ({
  authApi: { forgotPassword: (...args) => mockForgotPassword(...args) },
}))

import ForgotPassword from '../ForgotPassword'

function renderForgotPassword() {
  return render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>
  )
}

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders forgot password form with heading', () => {
    renderForgotPassword()
    expect(screen.getByText(/lupa password/i)).toBeInTheDocument()
    expect(screen.getByText(/masukkan email terdaftar/i)).toBeInTheDocument()
  })

  it('renders email input', () => {
    renderForgotPassword()
    const emailInput = screen.getByPlaceholderText(/nama@email.com/i)
    expect(emailInput).toBeInTheDocument()
  })

  it('renders submit button', () => {
    renderForgotPassword()
    expect(screen.getByRole('button', { name: /kirim link reset/i })).toBeInTheDocument()
  })

  it('shows login link', () => {
    renderForgotPassword()
    const links = screen.getAllByText(/masuk$/i)
    expect(links.length).toBeGreaterThan(0)
    expect(links[0]).toHaveAttribute('href', '/login')
  })

  it('email input is required', () => {
    renderForgotPassword()
    expect(screen.getByPlaceholderText(/nama@email.com/i)).toBeRequired()
  })

  it('shows success state after submitting', async () => {
    mockForgotPassword.mockResolvedValue({})
    renderForgotPassword()

    const emailInput = screen.getByPlaceholderText(/nama@email.com/i)
    await userEvent.type(emailInput, 'test@email.com')
    await userEvent.click(screen.getByRole('button', { name: /kirim link reset/i }))

    await waitFor(() => {
      expect(screen.getByText(/email terkirim/i)).toBeInTheDocument()
    })
  })

  it('calls forgotPassword API with email', async () => {
    mockForgotPassword.mockResolvedValue({})
    renderForgotPassword()

    const emailInput = screen.getByPlaceholderText(/nama@email.com/i)
    await userEvent.type(emailInput, 'user@tanamanku.id')
    await userEvent.click(screen.getByRole('button', { name: /kirim link reset/i }))

    expect(mockForgotPassword).toHaveBeenCalledWith({ email: 'user@tanamanku.id' })
  })
})
