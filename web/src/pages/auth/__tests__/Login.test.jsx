import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock all dependencies before importing Login
vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}))

vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}))

vi.mock('../../../services/api/auth', () => ({
  authApi: { login: vi.fn(), me: vi.fn(), logout: vi.fn() },
}))

vi.mock('../../../services/api/client', () => ({
  apiMode: vi.fn(() => 'mock'),
  onModeChange: vi.fn(() => () => {}),
}))

// Now import Login after mocks are set up
import Login from '../Login'

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

describe('Login Page', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders login form with heading', () => {
    renderLogin()
    expect(screen.getByText(/selamat datang kembali/i)).toBeInTheDocument()
    expect(screen.getByText(/masuk untuk lanjut/i)).toBeInTheDocument()
  })

  it('renders email input with demo value', () => {
    renderLogin()
    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveValue('rina@tanamanku.id')
  })

  it('renders password input', () => {
    renderLogin()
    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toBeInTheDocument()
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('renders submit button', () => {
    renderLogin()
    expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument()
  })

  it('shows forgot password link', () => {
    renderLogin()
    const link = screen.getByText(/lupa password/i)
    expect(link).toHaveAttribute('href', '/forgot-password')
  })

  it('shows register link', () => {
    renderLogin()
    const link = screen.getByText(/daftar gratis/i)
    expect(link).toHaveAttribute('href', '/register')
  })

  it('renders demo mode hint', () => {
    renderLogin()
    expect(screen.getByText(/mode demo/i)).toBeInTheDocument()
  })

  it('has remember me checkbox', () => {
    renderLogin()
    expect(screen.getByText(/ingat saya/i)).toBeInTheDocument()
  })

  it('email input is required', () => {
    renderLogin()
    expect(screen.getByLabelText(/email/i)).toBeRequired()
  })

  it('password input is required', () => {
    renderLogin()
    expect(screen.getByLabelText(/password/i)).toBeRequired()
  })
})
