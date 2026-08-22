import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockGetUsers = vi.fn()
const mockToggleUserActive = vi.fn()
const mockUpdateUserRole = vi.fn()
vi.mock('../../../services/api/admin', () => ({
  adminApi: {
    getUsers: (...args) => mockGetUsers(...args),
    toggleUserActive: (...args) => mockToggleUserActive(...args),
    updateUserRole: (...args) => mockUpdateUserRole(...args),
  },
}))

vi.mock('../../../components/ui/Loading', () => ({ default: () => <div>Loading...</div> }))
vi.mock('../../../components/ui/Badge', () => ({ default: ({ children }) => <span>{children}</span> }))

import AdminUsers from '../Users'

const mockUsers = [
  { id: 1, name: 'Budi', email: 'budi@test.com', role: 'customer', is_active: true },
  { id: 2, name: 'Sari', email: 'sari@test.com', role: 'seller', is_active: true },
  { id: 3, name: 'Andi', email: 'andi@test.com', role: 'customer', is_active: false },
  { id: 4, name: 'Admin', email: 'admin@test.com', role: 'admin', is_active: true },
]

function renderUsers() {
  return render(
    <MemoryRouter>
      <AdminUsers />
    </MemoryRouter>
  )
}

describe('Admin Users Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state', () => {
    mockGetUsers.mockReturnValue(new Promise(() => {}))
    renderUsers()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders user list after loading', async () => {
    mockGetUsers.mockResolvedValue({ data: mockUsers })
    renderUsers()

    await waitFor(() => {
      expect(screen.getByText('Budi')).toBeInTheDocument()
    })

    expect(screen.getByText('Sari')).toBeInTheDocument()
    expect(screen.getByText('Andi')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('shows search input', async () => {
    mockGetUsers.mockResolvedValue({ data: mockUsers })
    renderUsers()

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/cari nama atau email/i)).toBeInTheDocument()
    })
  })

  it('shows filter buttons', async () => {
    mockGetUsers.mockResolvedValue({ data: mockUsers })
    renderUsers()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /semua/i })).toBeInTheDocument()
    })

    expect(screen.getByRole('button', { name: /aktif/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nonaktif/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /seller/i })).toBeInTheDocument()
  })

  it('shows user emails', async () => {
    mockGetUsers.mockResolvedValue({ data: mockUsers })
    renderUsers()

    await waitFor(() => {
      expect(screen.getByText('budi@test.com')).toBeInTheDocument()
    })

    expect(screen.getByText('sari@test.com')).toBeInTheDocument()
  })

  it('shows role select dropdowns', async () => {
    mockGetUsers.mockResolvedValue({ data: mockUsers })
    renderUsers()

    await waitFor(() => {
      const selects = screen.getAllByRole('combobox')
      expect(selects.length).toBe(mockUsers.length)
    })
  })

  it('shows active status badges', async () => {
    mockGetUsers.mockResolvedValue({ data: mockUsers })
    renderUsers()

    await waitFor(() => {
      expect(screen.getByText(/aktif/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/nonaktif/i)).toBeInTheDocument()
  })

  it('shows toggle active buttons', async () => {
    mockGetUsers.mockResolvedValue({ data: mockUsers })
    renderUsers()

    await waitFor(() => {
      const deactivateButtons = screen.getAllByText(/nonaktifkan/i)
      expect(deactivateButtons.length).toBeGreaterThan(0)
    })
  })

  it('shows activate buttons for inactive users', async () => {
    mockGetUsers.mockResolvedValue({ data: mockUsers })
    renderUsers()

    await waitFor(() => {
      const activateButtons = screen.getAllByText(/aktifkan/i)
      expect(activateButtons.length).toBeGreaterThan(0)
    })
  })

  it('shows table headers', async () => {
    mockGetUsers.mockResolvedValue({ data: mockUsers })
    renderUsers()

    await waitFor(() => {
      expect(screen.getByText('Pengguna')).toBeInTheDocument()
    })

    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Peran')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Aksi')).toBeInTheDocument()
  })

  it('shows all user roles', async () => {
    mockGetUsers.mockResolvedValue({ data: mockUsers })
    renderUsers()

    await waitFor(() => {
      // Check that role select options exist
      const selects = screen.getAllByRole('combobox')
      expect(selects.length).toBe(4)
    })
  })
})
