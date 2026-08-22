import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from '../Input'

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('renders without label', () => {
    render(<Input placeholder="Enter..." />)
    expect(screen.getByPlaceholderText(/enter/i)).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<Input label="Email" error="Email wajib diisi" />)
    expect(screen.getByText(/email wajib diisi/i)).toBeInTheDocument()
  })

  it('displays hint when no error', () => {
    render(<Input label="Email" hint="Masukkan email aktif" />)
    expect(screen.getByText(/masukkan email aktif/i)).toBeInTheDocument()
  })

  it('does not show hint when error is present', () => {
    render(<Input label="Email" error="Error" hint="Hint text" />)
    expect(screen.queryByText(/hint text/i)).not.toBeInTheDocument()
  })

  it('applies error styling', () => {
    render(<Input error="Error" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('border-rose-300')
  })

  it('applies normal styling without error', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('border-leaf-200')
  })

  it('handles value change', async () => {
    const user = userEvent.setup()
    render(<Input />)
    const input = screen.getByRole('textbox')

    await user.type(input, 'hello')
    expect(input).toHaveValue('hello')
  })

  it('supports different input types', () => {
    render(<Input type="password" />)
    const input = document.querySelector('input[type="password"]')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'password')
  })

  it('renders with icon', () => {
    render(<Input icon="✉️" />)
    expect(screen.getByText('✉️')).toBeInTheDocument()
  })

  it('applies icon padding', () => {
    render(<Input icon="✉️" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('pl-11')
  })

  it('forwards ref', () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
