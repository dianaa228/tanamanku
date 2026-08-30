import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Button from '../Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Klik saya</Button>)
    expect(screen.getByRole('button', { name: /klik saya/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Klik</Button>)

    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies primary variant by default', () => {
    render(<Button>Test</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-leaf-700')
  })

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Test</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-white')
  })

  it('applies danger variant', () => {
    render(<Button variant="danger">Hapus</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-terra-600')
  })

  it('shows loading spinner when loading', () => {
    render(<Button loading>Simpan</Button>)
    expect(screen.getByText('Simpan')).toBeInTheDocument()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('has pointer-events-none when loading', () => {
    render(<Button loading>Simpan</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('disabled:pointer-events-none')
    expect(button.className).toContain('disabled:opacity-50')
  })

  it('renders as Link when to prop is provided', () => {
    render(
      <MemoryRouter>
        <Button to="/about">Tentang</Button>
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: /tentang/i })).toHaveAttribute('href', '/about')
  })

  it('applies size classes', () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('px-6')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>)
    expect(screen.getByRole('button').className).toContain('custom-class')
  })
})
