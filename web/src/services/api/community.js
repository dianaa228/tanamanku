import { api, apiMode, mockResponse, unwrap } from './client'
import { mapPosts } from './normalizers'
import { communityPosts } from './mock-data'

/**
 * Adapter komunitas (docs/07-web-react.json: community.js).
 */

const mockImpl = {
  getPosts: () => mockResponse(communityPosts, 'Post komunitas berhasil dimuat'),

  createPost: async ({ content, emoji, gradient }) => {
    await new Promise((r) => setTimeout(r, 600))
    const post = {
      id: Date.now(),
      author: 'Rina Kartika',
      avatar: '🧑‍🌾',
      time: new Date().toISOString(),
      content,
      emoji: emoji || '🌿',
      gradient: gradient || 'from-leaf-400 to-emerald-600',
      likes: 0,
      liked: false,
      comments: [],
    }
    communityPosts.unshift(post)
    return { success: true, message: 'Post berhasil dibagikan', data: post }
  },

  toggleLike: async (id) => {
    await new Promise((r) => setTimeout(r, 300))
    const post = communityPosts.find((p) => p.id === id)
    if (post) {
      post.liked = !post.liked
      post.likes += post.liked ? 1 : -1
    }
    return { success: true, message: 'Suka diperbarui', data: { id, liked: post?.liked, likes: post?.likes } }
  },

  addComment: async (id, content) => {
    await new Promise((r) => setTimeout(r, 400))
    const post = communityPosts.find((p) => p.id === id)
    const comment = { author: 'Rina Kartika', avatar: '🧑‍🌾', time: new Date().toISOString(), content }
    post?.comments.push(comment)
    return { success: true, message: 'Komentar terkirim', data: comment }
  },
}

export const communityApi = {
  getPosts: async () => {
    if (apiMode() === 'api') {
      const res = await api.get('/community/posts', { params: { per_page: 30 } })
      return { success: true, message: res.message, data: mapPosts(unwrap(res)) }
    }
    return mockImpl.getPosts()
  },

  createPost: async ({ content }) => {
    if (apiMode() === 'api') {
      const res = await api.post('/community/posts', { content })
      return { success: true, message: res.message, data: res.data }
    }
    return mockImpl.createPost({ content })
  },

  toggleLike: async (id) => {
    if (apiMode() === 'api') {
      const res = await api.post(`/community/posts/${id}/like`)
      return { success: true, message: res.message, data: res.data }
    }
    return mockImpl.toggleLike(id)
  },

  addComment: async (id, content) => {
    if (apiMode() === 'api') {
      const res = await api.post(`/community/posts/${id}/comments`, { content })
      return { success: true, message: res.message, data: res.data }
    }
    return mockImpl.addComment(id, content)
  },
}
