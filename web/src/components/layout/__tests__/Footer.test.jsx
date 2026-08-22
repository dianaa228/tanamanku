import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../../context/ToastContext', () => ({
  useToast: vi.fn(),
}))

const mockShowToast = vi.fn()

import { useToast } from '../../../context/ToastContext'
import Footer from '../Footer'

function renderFooter() {
  useToast.mockReturnValue({ showToast: mockShowToast })
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  )
}

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders brand name and tagline', () => {
    renderFooter()
    expect(screen.getByText('Tanamanku')).toBeInTheDocument()
    expect(screen.getByText(/belanja, rawat, dan tumbuhkan/i)).toBeInTheDocument()
  })

  it('renders copyright', () => {
    renderFooter()
    expect(screen.getByText(/© 2026 Tanamanku/i)).toBeInTheDocument()
  })

  it('renders shopping links column', () => {
    renderFooter()
    expect(screen.getByText('Belanja')).toBeInTheDocument()
    expect(screen.getByText('Tanaman Hias')).toBeInTheDocument()
    expect(screen.getByText('Sayuran & Herbal')).toBeInTheDocument()
    expect(screen.getByText('Pupuk & Nutrisi')).toBeInTheDocument()
    expect(screen.getByText('Pot & Dekorasi')).toBeInTheDocument()
  })

  it('renders feature links column', () => {
    renderFooter()
    expect(screen.getByText('Fitur')).toBeInTheDocument()
    expect(screen.getByText('My Garden')).toBeInTheDocument()
    expect(screen.getByText('Plant Finder')).toBeInTheDocument()
    expect(screen.getByText('Plant Diagnosis')).toBeInTheDocument()
    expect(screen.getByText('Komunitas')).toBeInTheDocument()
  })

  it('renders help links column', () => {
    renderFooter()
    expect(screen.getByText('Bantuan')).toBeInTheDocument()
    expect(screen.getByText('Pesanan saya')).toBeInTheDocument()
    expect(screen.getByText('Profil')).toBeInTheDocument()
    expect(screen.getByText('Cara Belanja')).toBeInTheDocument()
  })

  it('renders newsletter section', () => {
    renderFooter()
    expect(screen.getByText(/dapatkan tips berkebun mingguan/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/alamat email/i)).toBeInTheDocument()
  })

  it('renders social media icons', () => {
    renderFooter()
    expect(screen.getByText('📷')).toBeInTheDocument()
    expect(screen.getByText('🐦')).toBeInTheDocument()
    expect(screen.getByText('▶️')).toBeInTheDocument()
    expect(screen.getByText('🎵')).toBeInTheDocument()
  })

  it('newsletter submit shows toast', async () => {
    const user = userEvent.setup()
    renderFooter()

    const emailInput = screen.getByPlaceholderText(/alamat email/i)
    await user.type(emailInput, 'test@example.com')
    await user.click(screen.getByText('Langganan'))

    expect(mockShowToast).toHaveBeenCalledWith('Berhasil berlangganan! Cek email Anda 🌻')
  })

  it('newsletter submit clears email input', async () => {
    const user = userEvent.setup()
    renderFooter()

    const emailInput = screen.getByPlaceholderText(/alamat email/i)
    await user.type(emailInput, 'test@example.com')
    await user.click(screen.getByText('Langganan'))

    expect(emailInput).toHaveValue('')
  })
})
