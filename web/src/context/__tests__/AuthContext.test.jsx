import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../AuthContext'

// Mock the auth API
vi.mock('../../services/api/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    forgotPassword: vi.fn(),
    me: vi.fn(),
    logout: vi.fn(),
  },
}))

vi.mock('../../services/api/client', () => ({
  apiMode: vi.fn(() => 'mock'),
  onModeChange: vi.fn(() => () => {}),
}))

// Test component that uses useAuth
function TestComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  return (
    <div>
      <span data-testid="authenticated">{isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="user-name">{user?.name || 'none'}</span>
      <button onClick={() => login({ email: 'test@test.com', password: '123' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('provides initial unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('authenticated')).toHaveTextContent('no')
    expect(screen.getByTestId('user-name')).toHaveTextContent('none')
  })

  it('provides authenticated state from localStorage', () => {
    const mockUser = { id: 1, name: 'Rina', email: 'rina@test.com' }
    localStorage.setItem('tanamanku_user', JSON.stringify(mockUser))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('authenticated')).toHaveTextContent('yes')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Rina')
  })

  it('login updates state', async () => {
    const { authApi } = await import('../../services/api/auth')
    const mockUser = { id: 1, name: 'Rina', email: 'rina@test.com' }
    authApi.login.mockResolvedValue({
      success: true,
      data: { user: mockUser, token: 'token123' },
    })

    const user = userEvent.setup()
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByText('Login'))

    expect(authApi.login).toHaveBeenCalledWith({ email: 'test@test.com', password: '123' })
    expect(screen.getByTestId('authenticated')).toHaveTextContent('yes')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Rina')
  })

  it('logout clears state', async () => {
    const { authApi } = await import('../../services/api/auth')
    const mockUser = { id: 1, name: 'Rina', email: 'rina@test.com' }
    localStorage.setItem('tanamanku_user', JSON.stringify(mockUser))
    authApi.logout.mockResolvedValue({ success: true })

    const user = userEvent.setup()
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('authenticated')).toHaveTextContent('yes')

    await user.click(screen.getByText('Logout'))

    expect(screen.getByTestId('authenticated')).toHaveTextContent('no')
    expect(screen.getByTestId('user-name')).toHaveTextContent('none')
  })

  it('throws when useAuth is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    function BadComponent() {
      useAuth()
      return null
    }

    expect(() => render(<BadComponent />)).toThrow(/useAuth harus dipakai di dalam <AuthProvider>/)

    consoleSpy.mockRestore()
  })
})
