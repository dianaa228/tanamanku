import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import EmptyState from '../EmptyState'

describe('EmptyState', () => {
  it('renders title', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Tidak ada data" />
      </MemoryRouter>
    )
    expect(screen.getByText('Tidak ada data')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Kosong" description="Belum ada item" />
      </MemoryRouter>
    )
    expect(screen.getByText('Belum ada item')).toBeInTheDocument()
  })

  it('renders default icon', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Test" />
      </MemoryRouter>
    )
    expect(screen.getByText('🪴')).toBeInTheDocument()
  })

  it('renders custom icon', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Test" icon="🛒" />
      </MemoryRouter>
    )
    expect(screen.getByText('🛒')).toBeInTheDocument()
  })

  it('renders action button with link when actionTo provided', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Test" actionLabel="Mulai" actionTo="/explore" />
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: /mulai/i })
    expect(link).toHaveAttribute('href', '/explore')
  })

  it('calls onAction when button clicked', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(
      <MemoryRouter>
        <EmptyState title="Test" actionLabel="Klik" onAction={onAction} />
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: /klik/i }))
    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it('does not render button when no action props', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Test" />
      </MemoryRouter>
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
