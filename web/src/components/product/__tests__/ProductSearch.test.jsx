import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductSearch from '../ProductSearch'

describe('ProductSearch', () => {
  it('renders search input', () => {
    render(<ProductSearch value="" onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText(/cari tanaman/i)).toBeInTheDocument()
  })

  it('displays current value', () => {
    render(<ProductSearch value="monstera" onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('monstera')).toBeInTheDocument()
  })

  it('calls onChange when typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ProductSearch value="" onChange={onChange} />)

    await user.type(screen.getByRole('textbox'), 'rose')

    expect(onChange).toHaveBeenCalled()
  })

  it('renders search icon', () => {
    const { container } = render(<ProductSearch value="" onChange={vi.fn()} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('input has correct styling', () => {
    render(<ProductSearch value="" onChange={vi.fn()} />)
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('rounded-2xl')
  })
})
