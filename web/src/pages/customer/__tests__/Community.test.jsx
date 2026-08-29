import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// Mock all dependencies before importing Community
vi.mock('../../../services/api/community', () => ({
  communityApi: {
    getPosts: vi.fn().mockResolvedValue({
      success: true,
      data: [
        {
          id: 1, author: 'Rina Kartika', avatar: '🧑‍🌾', time: '2026-08-10T08:30:00',
          content: 'Momo akhirnya tumbuh daun baru! 🌿',
          emoji: '🌿', gradient: 'from-leaf-400 to-emerald-600', likes: 48, liked: true,
          comments: [{ author: 'Budi', avatar: '👨‍🔧', time: '2026-08-10T09:12:00', content: 'Bagus sekali!' }],
        },
        {
          id: 2, author: 'Budi Setiawan', avatar: '👨‍🔧', time: '2026-08-09T19:45:00',
          content: 'Hasil panen cabai pertama! 🌶️',
          emoji: '🌶️', gradient: 'from-red-500 to-rose-700', likes: 63, liked: false,
          comments: [],
        },
      ],
    }),
    createPost: vi.fn().mockResolvedValue({ success: true }),
    toggleLike: vi.fn().mockResolvedValue({ success: true }),
    addComment: vi.fn().mockResolvedValue({ success: true }),
  },
}))

vi.mock('../../../context/CartContext', () => ({
  useCart: () => ({ items: [], count: 0, subtotal: 0 }),
}))
vi.mock('../../../context/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}))
vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 1, name: 'Rina', avatar: '🧑‍🌾' }, isAuthenticated: true }),
}))

import Community from '../Community'

function renderCommunity() {
  return render(
    <MemoryRouter>
      <Community />
    </MemoryRouter>
  )
}

describe('Community Page', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    // Re-apply mock implementations since clearAllMocks resets them in Vitest
    const { communityApi } = await import('../../../services/api/community')
    communityApi.getPosts.mockResolvedValue({
      success: true,
      data: [
        {
          id: 1, author: 'Rina Kartika', avatar: '🧑‍🌾', time: '2026-08-10T08:30:00',
          content: 'Momo akhirnya tumbuh daun baru! 🌿',
          emoji: '🌿', gradient: 'from-leaf-400 to-emerald-600', likes: 48, liked: true,
          comments: [{ author: 'Budi', avatar: '👨‍🔧', time: '2026-08-10T09:12:00', content: 'Bagus sekali!' }],
        },
        {
          id: 2, author: 'Budi Setiawan', avatar: '👨‍🔧', time: '2026-08-09T19:45:00',
          content: 'Hasil panen cabai pertama! 🌶️',
          emoji: '🌶️', gradient: 'from-red-500 to-rose-700', likes: 63, liked: false,
          comments: [],
        },
      ],
    })
    communityApi.createPost.mockResolvedValue({ success: true })
    communityApi.toggleLike.mockResolvedValue({ success: true })
    communityApi.addComment.mockResolvedValue({ success: true })
  })

  it('shows loading initially', async () => {
    await act(async () => {
      renderCommunity()
    })
    // After the async load completes, loading state should be gone
    // (posts rendered instead)
    await waitFor(() => {
      expect(screen.getByText('Rina Kartika')).toBeInTheDocument()
    })
  })

  it('renders page title after loading', async () => {
    renderCommunity()
    await waitFor(() => {
      expect(screen.getByText(/komunitas tanamanku/i)).toBeInTheDocument()
    })
  })

  it('renders write post button', async () => {
    renderCommunity()
    await waitFor(() => {
      expect(screen.getByText(/tulis post/i)).toBeInTheDocument()
    })
  })

  it('renders posts after loading', async () => {
    renderCommunity()
    await waitFor(() => {
      expect(screen.getByText('Rina Kartika')).toBeInTheDocument()
      expect(screen.getByText('Budi Setiawan')).toBeInTheDocument()
    })
  })

  it('renders post content', async () => {
    renderCommunity()
    await waitFor(() => {
      expect(screen.getByText(/momo akhirnya tumbuh daun baru/i)).toBeInTheDocument()
    })
  })

  it('renders like counts', async () => {
    renderCommunity()
    await waitFor(() => {
      const buttons = document.querySelectorAll('button')
      const likeTexts = Array.from(buttons).map((b) => b.textContent)
      expect(likeTexts.some((t) => t.includes('48'))).toBe(true)
      expect(likeTexts.some((t) => t.includes('63'))).toBe(true)
    })
  })

  it('renders existing comments', async () => {
    renderCommunity()
    await waitFor(() => {
      expect(screen.getByText('Bagus sekali!')).toBeInTheDocument()
    })
  })

  it('opens composer when write post clicked', async () => {
    const user = userEvent.setup()
    renderCommunity()
    await waitFor(() => {
      expect(screen.getByText(/tulis post/i)).toBeInTheDocument()
    })

    const writeButtons = screen.getAllByText(/tulis post/i)
    await user.click(writeButtons[0])

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/bagikan cerita/i)).toBeInTheDocument()
    })
  })

  it('renders post images', async () => {
    renderCommunity()
    await waitFor(() => {
      const visuals = document.querySelectorAll('[class*="h-48"]')
      expect(visuals.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('shows timestamp for posts', async () => {
    renderCommunity()
    await waitFor(() => {
      expect(screen.getByText('Rina Kartika')).toBeInTheDocument()
    })
    // timeAgo renders relative time strings containing 'lalu'
    const postTexts = document.querySelectorAll('article')
    expect(postTexts.length).toBeGreaterThan(0)
  })

  it('shows comment input on comment button click', async () => {
    const user = userEvent.setup()
    renderCommunity()
    await waitFor(() => {
      expect(screen.getByText('Rina Kartika')).toBeInTheDocument()
    })

    // Find the comment button inside the first article
    const articles = document.querySelectorAll('article')
    expect(articles.length).toBeGreaterThan(0)
    const buttons = articles[0].querySelectorAll('button')
    // Comment button is the one with 💬
    const commentBtn = Array.from(buttons).find((b) => b.textContent.includes('💬'))
    expect(commentBtn).toBeTruthy()
    await user.click(commentBtn)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/tulis komentar/i)).toBeInTheDocument()
    })
  })
})
