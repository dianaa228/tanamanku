import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from '../Pagination'

describe('Pagination', () => {
  it('renders nothing when totalPages is 1', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onChange={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders page buttons', () => {
    render(<Pagination page={1} totalPages={5} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /1/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /5/ })).toBeInTheDocument()
  })

  it('highlights current page', () => {
    render(<Pagination page={2} totalPages={5} onChange={vi.fn()} />)
    const currentPage = screen.getByRole('button', { name: /2/ })
    expect(currentPage.className).toContain('bg-leaf-600')
    expect(currentPage.className).toContain('text-white')
  })

  it('calls onChange when page clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination page={1} totalPages={5} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /3/ }))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('prev button is disabled on first page', () => {
    render(<Pagination page={1} totalPages={5} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /halaman sebelumnya/i })).toBeDisabled()
  })

  it('next button is disabled on last page', () => {
    render(<Pagination page={5} totalPages={5} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /halaman berikutnya/i })).toBeDisabled()
  })

  it('prev button calls onChange with page - 1', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination page={3} totalPages={5} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /halaman sebelumnya/i }))
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('next button calls onChange with page + 1', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination page={3} totalPages={5} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /halaman berikutnya/i }))
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('has aria-label for navigation', () => {
    render(<Pagination page={1} totalPages={3} onChange={vi.fn()} />)
    expect(screen.getByRole('navigation', { name: /paginasi/i })).toBeInTheDocument()
  })
})
