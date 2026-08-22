import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Loading from '../Loading'

describe('Loading', () => {
  it('renders default label', () => {
    render(<Loading />)
    expect(screen.getByText('Memuat data...')).toBeInTheDocument()
  })

  it('renders custom label', () => {
    render(<Loading label="Mencari produk..." />)
    expect(screen.getByText('Mencari produk...')).toBeInTheDocument()
  })

  it('renders spinner animation', () => {
    const { container } = render(<Loading />)
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('renders plant emoji', () => {
    render(<Loading />)
    expect(screen.getByText('🌿')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Loading className="my-class" />)
    expect(container.firstChild.className).toContain('my-class')
  })

  it('has centered layout', () => {
    const { container } = render(<Loading />)
    expect(container.firstChild.className).toContain('flex')
    expect(container.firstChild.className).toContain('items-center')
    expect(container.firstChild.className).toContain('justify-center')
  })
})
