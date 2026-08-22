import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from '../Badge'

describe('Badge', () => {
  it('renders with text', () => {
    render(<Badge>Aktif</Badge>)
    expect(screen.getByText('Aktif')).toBeInTheDocument()
  })

  it('renders with icon', () => {
    render(<Badge icon="🌱">Baru</Badge>)
    expect(screen.getByText('🌱')).toBeInTheDocument()
    expect(screen.getByText('Baru')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Badge className="bg-red-100">Error</Badge>)
    const badge = screen.getByText('Error').closest('span')
    expect(badge.className).toContain('bg-red-100')
  })

  it('has base styling', () => {
    render(<Badge>Test</Badge>)
    const badge = screen.getByText('Test').closest('span')
    expect(badge.className).toContain('inline-flex')
    expect(badge.className).toContain('rounded-full')
  })
})
