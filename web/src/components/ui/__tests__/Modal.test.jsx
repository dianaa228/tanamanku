import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../Modal'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal open={false} onClose={vi.fn()} title="Test">
        <p>Content</p>
      </Modal>
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders when open', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Konfirmasi">
        <p>Yakin?</p>
      </Modal>
    )
    expect(screen.getByText('Konfirmasi')).toBeInTheDocument()
  })

  it('renders without title', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <p>No title modal</p>
      </Modal>
    )
    expect(screen.getByText('No title modal')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <div>Custom content here</div>
      </Modal>
    )
    expect(screen.getByText('Custom content here')).toBeInTheDocument()
  })

  it('renders footer', () => {
    render(
      <Modal open={true} onClose={vi.fn()} footer={<button>Save</button>}>
        <p>Body</p>
      </Modal>
    )
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>
    )

    await user.click(screen.getByRole('button', { name: /tutup/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose} title="Test">
        <p>Content</p>
      </Modal>
    )

    // Click the backdrop (first child of the fixed container)
    const backdrop = document.querySelector('.absolute.inset-0')
    await user.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('has dialog role', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-modal', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })
})
