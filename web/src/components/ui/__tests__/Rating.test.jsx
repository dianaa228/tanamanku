import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Rating from '../Rating'

describe('Rating', () => {
  it('renders 5 stars', () => {
    const { container } = render(<Rating value={3} />)
    const stars = container.querySelectorAll('span[aria-hidden] span')
    expect(stars.length).toBe(5)
  })

  it('highlights correct number of stars', () => {
    const { container } = render(<Rating value={4} />)
    const starsContainer = container.querySelector('span[aria-hidden]')
    const filledStars = starsContainer.querySelectorAll('span:not(.opacity-25)')
    expect(filledStars.length).toBe(4)
  })

  it('shows value when showValue is true', () => {
    render(<Rating value={4.5} showValue />)
    expect(screen.getByText('4.5')).toBeInTheDocument()
  })

  it('does not show value by default', () => {
    render(<Rating value={4.5} />)
    expect(screen.queryByText('4.5')).not.toBeInTheDocument()
  })

  it('applies small size by default', () => {
    const { container } = render(<Rating value={3} />)
    const stars = container.querySelector('span[aria-hidden]')
    expect(stars.className).toContain('text-xs')
  })

  it('applies medium size', () => {
    const { container } = render(<Rating value={3} size="md" />)
    const stars = container.querySelector('span[aria-hidden]')
    expect(stars.className).toContain('text-sm')
  })

  it('rounds value for star highlighting', () => {
    const { container } = render(<Rating value={3.7} />)
    const starsContainer = container.querySelector('span[aria-hidden]')
    const filledStars = starsContainer.querySelectorAll('span:not(.opacity-25)')
    expect(filledStars.length).toBe(4) // 3.7 rounds to 4
  })

  it('applies custom className', () => {
    const { container } = render(<Rating value={3} className="custom" />)
    expect(container.firstChild.className).toContain('custom')
  })
})
