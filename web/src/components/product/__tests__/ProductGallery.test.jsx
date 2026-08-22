import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductGallery from '../ProductGallery'

const mockProduct = {
  emoji: '🌿',
  gradient: 'from-green-400 to-emerald-700',
}

describe('ProductGallery', () => {
  it('renders main product image container', () => {
    const { container } = render(<ProductGallery product={mockProduct} />)
    expect(container.querySelector('.aspect-square')).toBeInTheDocument()
  })

  it('renders 3 thumbnail buttons', () => {
    const { container } = render(<ProductGallery product={mockProduct} />)
    const thumbnails = container.querySelectorAll('button')
    expect(thumbnails.length).toBe(3)
  })

  it('first thumbnail is active by default', () => {
    const { container } = render(<ProductGallery product={mockProduct} />)
    const thumbnails = container.querySelectorAll('button')
    expect(thumbnails[0].className).toContain('border-leaf-600')
  })

  it('switches active thumbnail on click', async () => {
    const user = userEvent.setup()
    const { container } = render(<ProductGallery product={mockProduct} />)
    const thumbnails = container.querySelectorAll('button')

    await user.click(thumbnails[1])

    expect(thumbnails[1].className).toContain('border-leaf-600')
    expect(thumbnails[0].className).toContain('border-transparent')
  })

  it('can switch to third thumbnail', async () => {
    const user = userEvent.setup()
    const { container } = render(<ProductGallery product={mockProduct} />)
    const thumbnails = container.querySelectorAll('button')

    await user.click(thumbnails[2])

    expect(thumbnails[2].className).toContain('border-leaf-600')
    expect(thumbnails[0].className).toContain('border-transparent')
    expect(thumbnails[1].className).toContain('border-transparent')
  })

  it('renders thumbnail images', () => {
    const { container } = render(<ProductGallery product={mockProduct} />)
    const thumbnails = container.querySelectorAll('button')
    // Each thumbnail should contain a ProductVisual
    thumbnails.forEach(t => {
      expect(t.querySelector('div')).toBeInTheDocument()
    })
  })
})
